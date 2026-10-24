from typing import List
from fastapi import APIRouter
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_user_me():
    return {
        "id": 1,
        "email": "developer@matchingteam.dev",
        "full_name": "Fullstack Developer",
        "bio": "Building scalable platforms with Next.js & FastAPI",
        "skills": ["Next.js", "TypeScript", "Tailwind CSS", "Python", "FastAPI"],
        "github_url": "https://github.com",
        "linkedin_url": "https://linkedin.com",
        "is_active": True,
    }


@router.get("/", response_model=List[UserResponse])
async def list_users():
    return [
        {
            "id": 1,
            "email": "alice@example.com",
            "full_name": "Alice Nguyen",
            "bio": "AI & ML Engineer",
            "skills": ["Python", "PyTorch", "FastAPI"],
            "github_url": "https://github.com",
            "linkedin_url": None,
            "is_active": True,
        },
        {
            "id": 2,
            "email": "bob@example.com",
            "full_name": "Bob Tran",
            "bio": "Frontend Architect",
            "skills": ["Next.js", "TypeScript", "Tailwind CSS"],
            "github_url": "https://github.com",
            "linkedin_url": None,
            "is_active": True,
        },
    ]
