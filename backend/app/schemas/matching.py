from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.team import TeamResponse


class CandidateProfile(BaseModel):
    id: str = Field(..., description="Mã định danh ứng viên")
    full_name: str = Field(..., description="Họ và tên ứng viên")
    skills: List[str] = Field(default_factory=list, description="Danh sách kỹ năng của ứng viên")
    preferred_roles: List[str] = Field(default_factory=list, description="Vai trò mong muốn")
    commitment_hours: Optional[int] = Field(10, description="Số giờ cam kết/tuần")
    bio: Optional[str] = Field(None, description="Giới thiệu bản thân ngắn gọn")


class ProjectMatchCriteria(BaseModel):
    id: Optional[str] = Field(None, description="ID dự án nếu có")
    title: str = Field(..., description="Tên dự án / đề tài")
    course_code: Optional[str] = Field(None, description="Mã môn học")
    missing_skills: List[str] = Field(..., description="Danh sách kỹ năng dự án đang còn thiếu")
    target_role: Optional[str] = Field(None, description="Vai trò cụ thể cần tìm")
    description: Optional[str] = Field(None, description="Mô tả dự án")


class MatchRequestPayload(BaseModel):
    project: ProjectMatchCriteria = Field(..., description="Thông tin dự án và kỹ năng còn thiếu")
    candidates: List[CandidateProfile] = Field(..., description="Danh sách profile ứng viên tham gia ghép đội")


class CandidateMatchResult(BaseModel):
    candidate_id: str = Field(..., description="ID ứng viên")
    full_name: str = Field(..., description="Tên ứng viên")
    match_score: float = Field(..., ge=0, le=100, description="Điểm số tương thích (0-100%)")
    reasoning: str = Field(..., description="Đoạn văn ngắn dưới 50 chữ giải thích lý do đề xuất")
    matched_skills: List[str] = Field(default_factory=list, description="Kỹ năng trùng khớp")
    missing_skills: List[str] = Field(default_factory=list, description="Kỹ năng còn thiếu so với yêu cầu")


class MatchResponsePayload(BaseModel):
    project_title: str
    evaluated_count: int
    matches: List[CandidateMatchResult]


class MatchRequest(BaseModel):
    user_id: int
    hackathon_id: Optional[str] = "default"
    target_role: Optional[str] = None
    top_k: int = 5


class MatchResult(BaseModel):
    team: TeamResponse
    match_score: float
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    reasoning: str
