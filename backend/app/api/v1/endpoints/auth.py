from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import Token, UserCreate, UserResponse
from app.core.security import create_access_token

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Demonstration authentication flow
    if form_data.username and form_data.password:
        access_token = create_access_token(subject=form_data.username)
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Incorrect username or password",
    )


@router.post("/register", response_model=UserResponse)
async def register_user(user_in: UserCreate):
    return {
        "id": 1,
        "email": user_in.email,
        "full_name": user_in.full_name,
        "bio": user_in.bio,
        "skills": user_in.skills,
        "github_url": user_in.github_url,
        "linkedin_url": user_in.linkedin_url,
        "is_active": True,
    }
