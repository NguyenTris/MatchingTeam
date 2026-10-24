from typing import List
from fastapi import APIRouter
from app.schemas.team import TeamResponse, TeamCreate

router = APIRouter()


@router.get("/", response_model=List[TeamResponse])
async def list_teams():
    return [
        {
            "id": 1,
            "name": "Team Hyperion",
            "description": "Building next-gen AI productivity copilot",
            "target_hackathon": "Global AI Hackathon 2026",
            "max_members": 4,
            "required_skills": ["Python", "FastAPI", "React", "Next.js"],
            "leader_id": 1,
            "status": "recruiting",
        },
        {
            "id": 2,
            "name": "Team Quantum",
            "description": "Decentralized automated matching protocol",
            "target_hackathon": "Web3 Innovators",
            "max_members": 5,
            "required_skills": ["Solidity", "TypeScript", "Tailwind CSS"],
            "leader_id": 2,
            "status": "recruiting",
        },
    ]


@router.post("/", response_model=TeamResponse)
async def create_team(team_in: TeamCreate):
    return {
        "id": 3,
        "name": team_in.name,
        "description": team_in.description,
        "target_hackathon": team_in.target_hackathon,
        "max_members": team_in.max_members,
        "required_skills": team_in.required_skills,
        "leader_id": 1,
        "status": "recruiting",
    }
