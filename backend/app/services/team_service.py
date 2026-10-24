from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.team import Team
from app.schemas.team import TeamCreate


class TeamService:
    @staticmethod
    async def get_all(db: AsyncSession, limit: int = 100) -> List[Team]:
        result = await db.execute(select(Team).limit(limit))
        return list(result.scalars().all())

    @staticmethod
    async def create(db: AsyncSession, obj_in: TeamCreate, leader_id: int) -> Team:
        db_obj = Team(
            name=obj_in.name,
            description=obj_in.description,
            target_hackathon=obj_in.target_hackathon,
            max_members=obj_in.max_members,
            required_skills=obj_in.required_skills,
            leader_id=leader_id,
        )
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj
