from sqlalchemy import Column, Integer, String, Text, ForeignKey, ARRAY
from app.core.database import Base


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_hackathon = Column(String(255), nullable=True)
    max_members = Column(Integer, default=5)
    required_skills = Column(ARRAY(String), default=[])
    leader_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="recruiting")
