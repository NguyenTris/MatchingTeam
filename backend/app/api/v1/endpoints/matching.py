from typing import List
from fastapi import APIRouter
from app.schemas.matching import MatchRequest, MatchResult
from app.services.matching_service import MatchingService

router = APIRouter()


@router.post("/recommend", response_model=List[MatchResult])
async def recommend_teams(payload: MatchRequest):
    return await MatchingService.find_matches(
        user_id=payload.user_id,
        hackathon_id=payload.hackathon_id,
        target_role=payload.target_role,
        top_k=payload.top_k,
    )
