from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.project import ProjectResponse

router = APIRouter()

# In-memory mock projects recruiting members (also queryable from Supabase if configured)
MOCK_RECRUITING_PROJECTS = [
    {
        "id": "proj-101",
        "title": "Hệ Thống Phân Tích Dữ Liệu Y Tế Thông Minh",
        "description": "Ứng dụng Machine Learning và FastAPI phân tích chỉ số sức khỏe người dùng theo thời gian thực.",
        "course_code": "AI502",
        "deadline": "2026-12-20",
        "target_member_count": 4,
        "current_members_count": 3,
        "status": "OPEN",
        "required_skills": ["Python", "FastAPI", "Next.js", "PostgreSQL"],
        "needed_roles": ["Backend Engineer", "Data Engineer"],
    },
    {
        "id": "proj-102",
        "title": "Sàn Giao Dịch Nông Sản Trực Tuyến & Truy Xuất",
        "description": "Xây dựng cổng thương mại điện tử kết hợp mã QR truy xuất nguồn gốc nông sản an toàn.",
        "course_code": "SE330",
        "deadline": "2026-12-05",
        "target_member_count": 5,
        "current_members_count": 2,
        "status": "MATCHING",
        "required_skills": ["TypeScript", "Tailwind CSS", "Next.js", "Docker"],
        "needed_roles": ["Frontend UI/UX", "Fullstack Developer"],
    },
    {
        "id": "proj-103",
        "title": "AI Multi-Agent Copilot Cho Doanh Nghiệp",
        "description": "Tích hợp Gemini API và LangChain tự động hóa quy trình phân loại và phản hồi email hỗ trợ khách hàng.",
        "course_code": "CS402",
        "deadline": "2026-11-30",
        "target_member_count": 4,
        "current_members_count": 2,
        "status": "OPEN",
        "required_skills": ["Python", "google-genai", "FastAPI", "React"],
        "needed_roles": ["AI Engineer", "Backend Developer"],
    },
    {
        "id": "proj-104",
        "title": "FinTech: Quản Lý Hóa Đơn Tự Động & Đối Soát",
        "description": "Hệ thống tự động đọc và trích xuất dữ liệu hóa đơn điện tử sử dụng OCR và đối soát giao dịch ngân hàng.",
        "course_code": "IS301",
        "deadline": "2026-11-28",
        "target_member_count": 4,
        "current_members_count": 1,
        "status": "OPEN",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Tailwind"],
        "needed_roles": ["Backend Developer", "DevOps"],
    },
]


@router.get("", response_model=List[ProjectResponse], summary="Lấy danh sách dự án đang tuyển người")
@router.get("/", response_model=List[ProjectResponse], include_in_schema=False)
async def get_projects(
    course_code: Optional[str] = Query(
        None,
        description="Lọc theo mã học phần (VD: CS402, AI502, SE330, IS301)",
    ),
):
    """
    Trả về danh sách các dự án đang tuyển người (status là OPEN hoặc MATCHING).
    Hỗ trợ filter theo mã học phần (course_code).
    """
    # Filter only recruiting projects (OPEN or MATCHING)
    recruiting = [p for p in MOCK_RECRUITING_PROJECTS if p["status"] in ("OPEN", "MATCHING")]

    if course_code:
        code_cleaned = course_code.strip().upper()
        recruiting = [p for p in recruiting if p["course_code"].upper() == code_cleaned]

    return [ProjectResponse(**p) for p in recruiting]
