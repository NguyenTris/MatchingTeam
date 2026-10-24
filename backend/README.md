# ⚡ MatchingTeam Backend (Python FastAPI & Gemini AI)

Dịch vụ Backend API hiện đại được xây dựng bằng **FastAPI**, **Pydantic v2**, **google-genai** (Gemini 2.5 Flash), và **Supabase**, tối ưu hóa thuật toán ghép đội tự động và phân tích độ tương thích theo thời gian thực.

---

## 📂 Cấu Trúc Thư Mục Backend

```text
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── projects.py      # [GET /api/projects] Lọc dự án tuyển người theo mã học phần
│   │   │   └── matching.py      # [POST /api/match] Đánh giá ghép ứng viên qua Gemini AI
│   │   ├── v1/                  # Router v1 (auth, users, teams)
│   │   └── __init__.py
│   ├── core/                    # Cấu hình hệ thống, bảo mật, database
│   │   ├── config.py            # Pydantic BaseSettings, CORS origins, Gemini API key
│   │   ├── database.py          # Async SQLAlchemy Engine & Session provider
│   │   └── security.py          # Băm mật khẩu (Bcrypt) & Cấp phát JWT
│   ├── models/                  # SQLAlchemy Database ORM Models
│   │   ├── user.py
│   │   ├── team.py
│   │   └── matching.py
│   ├── schemas/                 # Pydantic v2 Data Validation
│   │   ├── project.py           # ProjectBase, ProjectResponse
│   │   ├── matching.py          # MatchRequestPayload, CandidateMatchResult, MatchResponsePayload
│   │   ├── user.py
│   │   └── team.py
│   ├── services/                # Business Logic & AI Services
│   │   ├── ai_matching.py       # Tích hợp google-genai (Gemini API) sinh điểm & reasoning < 50 từ
│   │   ├── matching_service.py  # Thuật toán tính Jaccard similarity
│   │   ├── user_service.py
│   │   └── team_service.py
│   ├── __init__.py
│   └── main.py                  # Khởi tạo FastAPI App, CORS Middleware & Routes
├── requirements.txt             # fastapi, uvicorn, supabase, google-genai, pydantic...
├── main.py                      # Entry point chạy Uvicorn server
├── Dockerfile                   # Multi-stage production build (Python 3.11-slim)
├── Dockerfile.dev               # Development build với Hot Reload
└── .env.example                 # Biến môi trường mẫu
```

---

## 📡 Chi Tiết Các API Endpoints Chính

### 1. `GET /api/projects`
Trả về danh sách các đề tài/dự án đang mở tuyển thành viên (`status` là `OPEN` hoặc `MATCHING`).
- **Query Parameter**: `course_code` (tùy chọn) - Lọc theo mã học phần (VD: `CS402`, `AI502`, `SE330`, `IS301`).
- **Ví dụ Request**:
  ```http
  GET /api/projects?course_code=CS402 HTTP/1.1
  Host: localhost:8000
  ```

---

### 2. `POST /api/match`
Nhận thông tin dự án (kỹ năng đang thiếu) và danh sách hồ sơ ứng viên, gọi **Gemini API (google-genai)** để tính toán điểm tương thích (0-100%) và trả về đoạn văn giải thích ngắn gọn (dưới 50 từ) bằng chuẩn JSON.

- **Ví dụ Payload (Request)**:
  ```json
  {
    "project": {
      "title": "Hệ Thống Phân Tích Dữ Liệu Y Tế Thông Minh",
      "course_code": "AI502",
      "missing_skills": ["Python", "FastAPI", "PyTorch"],
      "target_role": "Backend & AI Engineer",
      "description": "Phân tích dữ liệu nhịp tim và huyết áp theo thời gian thực."
    },
    "candidates": [
      {
        "id": "cand-01",
        "full_name": "Nguyễn Văn An",
        "skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
        "preferred_roles": ["Backend Developer"],
        "commitment_hours": 15,
        "bio": "Sinh viên năm 4 đam mê xây dựng hệ thống phân tán và API."
      },
      {
        "id": "cand-02",
        "full_name": "Trần Thị Mai",
        "skills": ["Figma", "UI/UX", "HTML", "CSS"],
        "preferred_roles": ["UI/UX Designer"],
        "commitment_hours": 10,
        "bio": "Chuyên gia thiết kế giao diện ứng dụng web và mobile."
      }
    ]
  }
  ```

- **Ví dụ Phản Hồi (Response)**:
  ```json
  {
    "project_title": "Hệ Thống Phân Tích Dữ Liệu Y Tế Thông Minh",
    "evaluated_count": 2,
    "matches": [
      {
        "candidate_id": "cand-01",
        "full_name": "Nguyễn Văn An",
        "match_score": 88.0,
        "reasoning": "Thành thạo Python và FastAPI khớp chính xác 2/3 kỹ năng cốt lõi. Kinh nghiệm phát triển API backend rất phù hợp với dự án.",
        "matched_skills": ["Python", "FastAPI"],
        "missing_skills": ["PyTorch"]
      },
      {
        "candidate_id": "cand-02",
        "full_name": "Trần Thị Mai",
        "match_score": 20.0,
        "reasoning": "Chuyên về thiết kế UI/UX, chưa có kỹ năng lập trình Python hoặc FastAPI cần thiết cho vị trí kỹ thuật này.",
        "matched_skills": [],
        "missing_skills": ["Python", "FastAPI", "PyTorch"]
      }
    ]
  }
  ```

---

## 🔒 Cấu Hình CORS Middleware
CORS Middleware đã được thiết lập sẵn trong [`app/main.py`](file:///d:/MatchingTeam/backend/app/main.py) cho phép Frontend gọi API:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `allow_credentials=True`
- `allow_methods=["*"]`
- `allow_headers=["*"]`

---

## 🚀 Khởi Chạy Local

### 1. Tạo môi trường ảo & Cài đặt thư viện
```bash
python -m venv .venv
# Trên Windows:
.venv\Scripts\activate
# Trên Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Cấu hình biến môi trường
```bash
cp .env.example .env
# Mở file .env và điền GEMINI_API_KEY nếu có
```

### 3. Chạy Server
```bash
python main.py
# Hoặc: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Swagger UI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health check**: [http://localhost:8000/health](http://localhost:8000/health)
