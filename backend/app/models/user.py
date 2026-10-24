from sqlalchemy import Column, Integer, String, Boolean, Text, ARRAY
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    bio = Column(Text, nullable=True)
    skills = Column(ARRAY(String), default=[])
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
