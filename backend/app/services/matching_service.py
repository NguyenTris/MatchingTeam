from typing import List, Dict, Any
from app.schemas.matching import MatchResult
from app.schemas.team import TeamResponse


class MatchingService:
    @staticmethod
    def calculate_compatibility(user_skills: List[str], required_skills: List[str]) -> Dict[str, Any]:
        """Calculates Jaccard / overlap score between user skills and team required skills."""
        user_set = set([s.lower() for s in user_skills])
        required_set = set([s.lower() for s in required_skills])

        if not required_set:
            return {
                "score": 0.5,
                "matched": [],
                "missing": [],
            }

        matched = list(user_set.intersection(required_set))
        missing = list(required_set.difference(user_set))
        score = round(len(matched) / len(required_set), 2)

        return {
            "score": score,
            "matched": matched,
            "missing": missing,
        }

    @staticmethod
    async def find_matches(user_id: int, hackathon_id: str, target_role: str, top_k: int = 5) -> List[MatchResult]:
        # Mock demonstration logic for team matching
        sample_teams = [
            {
                "id": 1,
                "name": "AI Visionaries",
                "description": "Building an AI-powered automated video summarizer",
                "target_hackathon": hackathon_id,
                "max_members": 4,
                "required_skills": ["python", "fastapi", "pytorch", "nextjs"],
                "leader_id": 10,
                "status": "recruiting",
            },
            {
                "id": 2,
                "name": "FinTech Disruptors",
                "description": "Real-time fraud detection engine with microservices",
                "target_hackathon": hackathon_id,
                "max_members": 5,
                "required_skills": ["python", "docker", "postgresql", "tailwind"],
                "leader_id": 12,
                "status": "recruiting",
            },
        ]

        user_mock_skills = ["python", "fastapi", "docker"]
        results = []

        for team_data in sample_teams:
            compat = MatchingService.calculate_compatibility(user_mock_skills, team_data["required_skills"])
            results.append(
                MatchResult(
                    team=TeamResponse(**team_data),
                    match_score=compat["score"],
                    matched_skills=compat["matched"],
                    missing_skills=compat["missing"],
                    reasoning=f"Matched {len(compat['matched'])}/{len(team_data['required_skills'])} critical skills.",
                )
            )

        results.sort(key=lambda x: x.match_score, reverse=True)
        return results[:top_k]
