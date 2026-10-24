from typing import List, Optional
from pydantic import BaseModel


class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_hackathon: Optional[str] = None
    max_members: int = 5
    required_skills: List[str] = []


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_hackathon: Optional[str] = None
    max_members: Optional[int] = None
    required_skills: Optional[List[str]] = None


class TeamResponse(TeamBase):
    id: int
    leader_id: int
    status: str = "recruiting"

    class Config:
        from_attributes = True
