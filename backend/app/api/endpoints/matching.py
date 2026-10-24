from fastapi import APIRouter, HTTPException, status
from app.schemas.matching import MatchRequestPayload, MatchResponsePayload
from app.services.ai_matching import AIMatchingService

router = APIRouter()


@router.post(
    "",
    response_model=MatchResponsePayload,
    summary="Đánh giá và ghép ứng viên cho dự án bằng Gemini AI",
)
@router.post(
    "/",
    response_model=MatchResponsePayload,
    include_in_schema=False,
)
async def match_project_candidates(payload: MatchRequestPayload):
    """
    Nhận thông tin dự án (kỹ năng đang thiếu) và danh sách profile ứng viên.
    Gọi Gemini API (google-genai) để tính điểm số tương thích (0-100%) và
    giải thích ngắn gọn (dưới 50 chữ) lý do đề xuất ứng viên.
    """
    if not payload.project.missing_skills:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dự án phải có ít nhất một kỹ năng đang thiếu ('missing_skills') để thực hiện matching.",
        )

    response = await AIMatchingService.match_candidates(
        project=payload.project,
        candidates=payload.candidates,
    )

    return response
