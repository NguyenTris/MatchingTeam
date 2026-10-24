from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    title: str = Field(..., description="Tên đề tài / dự án")
    description: Optional[str] = Field(None, description="Mô tả dự án và mục tiêu")
    course_code: str = Field(..., description="Mã học phần (VD: CS402, SE330)")
    deadline: Optional[str] = Field(None, description="Hạn chót nộp đồ án / tuyển quân")
    target_member_count: int = Field(4, description="Số lượng thành viên mục tiêu")
    status: str = Field("OPEN", description="Trạng thái: OPEN, MATCHING, CLOSED")
    required_skills: List[str] = Field(default_factory=list, description="Kỹ năng yêu cầu")
    needed_roles: List[str] = Field(default_factory=list, description="Các vai trò đang tìm")


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: str
    current_members_count: int = 1
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
