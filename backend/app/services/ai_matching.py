import os
import json
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.schemas.matching import (
    ProjectMatchCriteria,
    CandidateProfile,
    CandidateMatchResult,
    MatchResponsePayload,
)

logger = logging.getLogger(__name__)


class AIMatchingService:
    @staticmethod
    def _create_gemini_client():
        """Creates Google GenAI Client if API key is configured."""
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None
        try:
            from google import genai
            return genai.Client(api_key=api_key)
        except Exception as e:
            logger.warning(f"Failed to initialize google-genai client: {e}")
            return None

    @staticmethod
    def _rule_based_fallback(
        project: ProjectMatchCriteria,
        candidates: List[CandidateProfile],
    ) -> List[CandidateMatchResult]:
        """High quality deterministic fallback when Gemini API is unavailable."""
        results: List[CandidateMatchResult] = []
        required_set = {s.strip().lower() for s in project.missing_skills if s.strip()}

        for candidate in candidates:
            cand_skills_map = {s.strip().lower(): s for s in candidate.skills}
            cand_skills_set = set(cand_skills_map.keys())

            matched_keys = required_set.intersection(cand_skills_set)
            missing_keys = required_set.difference(cand_skills_set)

            matched_skills = [cand_skills_map[k] for k in matched_keys]
            missing_skills = [k for k in missing_keys]

            # Calculate score (0 - 100)
            if not required_set:
                score = 80.0
            else:
                ratio = len(matched_keys) / len(required_set)
                score = round(ratio * 100, 1)

            # Boost slightly if candidate has matching preferred role
            if project.target_role and candidate.preferred_roles:
                target_r = project.target_role.lower()
                if any(target_r in r.lower() for r in candidate.preferred_roles):
                    score = min(100.0, score + 10.0)

            # Concise reasoning under 50 words in Vietnamese
            if matched_skills:
                matched_str = ", ".join(matched_skills[:3])
                reasoning = (
                    f"Trùng khớp {len(matched_skills)}/{len(project.missing_skills)} kỹ năng ({matched_str}). "
                    f"Kinh nghiệm phù hợp với mục tiêu đề tài."
                )
            else:
                reasoning = (
                    f"Chưa có kỹ năng trùng với các vị trí còn thiếu ({', '.join(project.missing_skills[:2])}). "
                    f"Cần cân nhắc đào tạo thêm."
                )

            results.append(
                CandidateMatchResult(
                    candidate_id=candidate.id,
                    full_name=candidate.full_name,
                    match_score=score,
                    reasoning=reasoning,
                    matched_skills=matched_skills,
                    missing_skills=missing_skills,
                )
            )

        results.sort(key=lambda x: x.match_score, reverse=True)
        return results

    @classmethod
    async def match_candidates(
        cls,
        project: ProjectMatchCriteria,
        candidates: List[CandidateProfile],
    ) -> MatchResponsePayload:
        """Evaluates and matches candidate profiles with project requirements using Gemini API."""
        if not candidates:
            return MatchResponsePayload(
                project_title=project.title,
                evaluated_count=0,
                matches=[],
            )

        client = cls._create_gemini_client()

        # If Gemini client cannot be initialized, use fallback immediately
        if not client:
            logger.info("Gemini API key not found. Using intelligent rule-based matching fallback.")
            fallback_results = cls._rule_based_fallback(project, candidates)
            return MatchResponsePayload(
                project_title=project.title,
                evaluated_count=len(fallback_results),
                matches=fallback_results,
            )

        # Prepare payload for Gemini prompt interpolation
        project_data = {
            "title": project.title,
            "course_code": project.course_code,
            "missing_skills": project.missing_skills,
            "target_role": project.target_role,
            "description": project.description,
        }

        candidates_data = [
            {
                "id": c.id,
                "full_name": c.full_name,
                "skills": c.skills,
                "preferred_roles": c.preferred_roles,
                "commitment_hours": c.commitment_hours,
                "bio": c.bio,
            }
            for c in candidates
        ]

        prompt = f"""
Bạn là một chuyên gia đánh giá và ghép đội ngũ (Matching Team AI) cho các dự án công nghệ và Hackathon.

Dưới đây là thông tin dự án đang tuyển người và danh sách ứng viên (dưới dạng JSON):

--- THÔNG TIN DỰ ÁN ---
{json.dumps(project_data, ensure_ascii=False, indent=2)}

--- DANH SÁCH ỨNG VIÊN ---
{json.dumps(candidates_data, ensure_ascii=False, indent=2)}

NHIỆM VỤ CỦA BẠN:
1. Đánh giá từng ứng viên dựa trên độ tương thích giữa kỹ năng của họ và danh sách kỹ năng đang thiếu của dự án.
2. Cho điểm số tương thích 'match_score' trên thang từ 0.0 đến 100.0 (phần trăm).
3. Viết một đoạn văn 'reasoning' BẮT BUỘC NGẮN GỌN DƯỚI 50 CHỮ bằng tiếng Việt giải thích lý do đề xuất ứng viên cho dự án này.
4. Xác định danh sách 'matched_skills' (kỹ năng trùng khớp) và 'missing_skills' (kỹ năng còn thiếu so với yêu cầu dự án).

BẮT BUỘC ĐẦU RA PHẢI LÀ CHUẨN JSON HỢP LỆ VỚI CẤU TRÚC SAU:
[
  {{
    "candidate_id": "string (khớp với id của ứng viên)",
    "full_name": "string",
    "match_score": 95.0,
    "reasoning": "Giải thích ngắn gọn dưới 50 chữ tại sao ứng viên này phù hợp.",
    "matched_skills": ["kỹ năng 1", "kỹ năng 2"],
    "missing_skills": ["kỹ năng chưa có"]
  }}
]
Chỉ trả về JSON thuần túy, không có giải thích hay markdown code blocks ngoài JSON.
"""

        try:
            from google.genai import types

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )

            response_text = response.text.strip()
            # Clean markdown code blocks if any
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

            parsed_data = json.loads(response_text)

            # Handle both list output or wrapped object {"matches": [...]}
            if isinstance(parsed_data, dict):
                items = parsed_data.get("matches") or parsed_data.get("results") or []
            elif isinstance(parsed_data, list):
                items = parsed_data
            else:
                items = []

            matches: List[CandidateMatchResult] = []
            for item in items:
                # Ensure word limit constraint under 50 words
                reason = str(item.get("reasoning", ""))
                words = reason.split()
                if len(words) > 50:
                    reason = " ".join(words[:48]) + "..."

                matches.append(
                    CandidateMatchResult(
                        candidate_id=str(item.get("candidate_id")),
                        full_name=str(item.get("full_name")),
                        match_score=float(item.get("match_score", 0.0)),
                        reasoning=reason,
                        matched_skills=list(item.get("matched_skills", [])),
                        missing_skills=list(item.get("missing_skills", [])),
                    )
                )

            matches.sort(key=lambda x: x.match_score, reverse=True)

            return MatchResponsePayload(
                project_title=project.title,
                evaluated_count=len(matches),
                matches=matches,
            )

        except Exception as err:
            logger.error(f"Error calling Gemini API for matching: {err}. Falling back to rule-based engine.")
            fallback_results = cls._rule_based_fallback(project, candidates)
            return MatchResponsePayload(
                project_title=project.title,
                evaluated_count=len(fallback_results),
                matches=fallback_results,
            )
