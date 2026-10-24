# 🚀 MatchingTeam - Fullstack AI Matching Platform

> Nền tảng kết nối và ghép đội ngũ (Matching Team) thông minh dành cho các dự án công nghệ, Hackathon và đồ án đại học tích hợp **Next.js 15 App Router**, **Python FastAPI**, **Supabase** và **Google Gemini AI**.

Dự án được cấu trúc theo mô hình **Monorepo chuẩn hóa**, hỗ trợ kiểm thử tự động với **GitHub Actions CI**, triển khai đám mây với **Render/Railway/Vercel**, và môi trường phát triển cục bộ 1-click với **Docker Compose**.

---

## 📂 Cây Thư Mục Chi Tiết Của Dự Án (ASCII Tree)

```text
MatchingTeam/
│
├── .github/                             # Tự động hóa CI/CD với GitHub Actions
│   ├── workflows/
│   │   ├── ci.yml                       # CI Pipeline: Tự động chạy Lint/Test cho Next.js & FastAPI khi push main
│   │   └── deploy.yml                   # Pipeline triển khai tự động
│   └── pull_request_template.md         # Mẫu chuẩn khi tạo Pull Request
│
├── frontend/                            # Giao diện người dùng Web (Next.js 15 App Router)
│   ├── public/                          # Static assets (Favicons, logos)
│   ├── src/
│   │   ├── app/                         # App Router (Pages & Routes)
│   │   │   ├── globals.css              # Theme HSL Tokens (Navy / Pastel Blue) cho Light/Dark
│   │   │   ├── layout.tsx               # Root Layout bọc ThemeProvider & AuthProvider
│   │   │   ├── page.tsx                 # Trang chủ Landing Page giới thiệu nền tảng
│   │   │   ├── login/                   # [Route] /login: Đăng nhập Supabase Auth & Demo 1-Click
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/               # [Route] /dashboard: Bảng điều khiển (fetchProjects, lọc học phần)
│   │   │   │   └── page.tsx             # Hiển thị thẻ Card: Tên dự án, Trạng thái, Tiến độ & AI Match
│   │   │   ├── projects/create/         # [Route] /projects/create: Form tạo dự án & yêu cầu nhân sự
│   │   │   │   └── page.tsx
│   │   │   └── workspace/[team_id]/     # [Route] /workspace/[team_id]: Không gian nhóm
│   │   │       └── page.tsx             # Bảng Kanban board quản lý Task (Realtime sync)
│   │   ├── components/
│   │   │   ├── auth/                    # Quản lý phiên đăng nhập
│   │   │   │   └── AuthProvider.tsx     # Context bọc ứng dụng, bảo vệ route & session Supabase
│   │   │   ├── layout/                  # Global Layout
│   │   │   │   ├── AppLayout.tsx        # Layout bọc Sidebar + TopNavbar + Content
│   │   │   │   ├── Sidebar.tsx          # Thanh điều hướng trái (Logo, menu, user profile)
│   │   │   │   └── TopNavbar.tsx        # Thanh tìm kiếm (⌘K), ThemeToggle & User Avatar menu
│   │   │   ├── ui/                      # Thư viện component chuẩn shadcn/ui
│   │   │   │   ├── avatar.tsx           # Avatar component
│   │   │   │   ├── badge.tsx            # Badge component
│   │   │   │   ├── button.tsx           # Button component
│   │   │   │   ├── card.tsx             # Card component family
│   │   │   │   ├── dialog.tsx           # Modal Dialog component
│   │   │   │   ├── dropdown-menu.tsx    # Dropdown Menu component
│   │   │   │   ├── input.tsx            # Input field component
│   │   │   │   ├── progress.tsx         # Progress bar component
│   │   │   │   └── select.tsx           # Select dropdown component
│   │   │   ├── theme-provider.tsx       # Provider bọc theme từ next-themes
│   │   │   ├── theme-toggle.tsx         # Nút chuyển chế độ Sáng/Tối (Light/Dark)
│   │   │   ├── Navbar.tsx               # Header trang Landing
│   │   │   ├── Hero.tsx                 # Hero banner trang Landing
│   │   │   └── FeatureGrid.tsx          # Lưới tính năng nổi bật
│   │   ├── hooks/
│   │   │   └── useSupabaseAuth.ts       # Hook truy cập user, session, signIn, signOut
│   │   ├── lib/
│   │   │   ├── api.ts                   # Client gọi FastAPI: fetchProjects() & requestTeamMatch()
│   │   │   ├── supabase.ts              # Khởi tạo Supabase client an toàn
│   │   │   └── utils.ts                 # Helper cn() kết hợp Tailwind & clsx
│   │   ├── services/
│   │   │   └── api.ts                   # Re-export lib/api
│   │   └── types/
│   │       └── index.ts                 # TypeScript interfaces (User, Team, MatchResult)
│   ├── components.json                  # Cấu hình shadcn/ui
│   ├── package.json                     # Quản lý dependencies (Next.js, Supabase, Tailwind, Radix)
│   ├── tailwind.config.ts               # Theme màu Xanh Navy & Pastel Blue
│   ├── tsconfig.json                    # Path alias (@/* trỏ tới ./src/*)
│   ├── Dockerfile                       # Multi-stage production build (Standalone)
│   ├── Dockerfile.dev                   # Hot-reload container phục vụ dev
│   └── README.md                        # Tài liệu chi tiết Frontend
│
├── backend/                             # Dịch vụ Backend API (Python FastAPI & Gemini AI)
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── projects.py          # [GET /api/projects] Lọc dự án tuyển người theo mã học phần
│   │   │   │   └── matching.py          # [POST /api/match] Đánh giá ghép ứng viên qua Gemini AI
│   │   │   ├── v1/                      # Router v1 (auth, users, teams)
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   ├── config.py                # Pydantic BaseSettings, CORS origins, Gemini API key
│   │   │   ├── database.py              # Async SQLAlchemy Engine & Session provider
│   │   │   └── security.py              # Băm mật khẩu (Bcrypt) & Cấp phát JWT
│   │   ├── models/                      # SQLAlchemy Database ORM Models
│   │   │   ├── user.py
│   │   │   ├── team.py
│   │   │   └── matching.py
│   │   ├── schemas/                     # Pydantic v2 Data Validation
│   │   │   ├── project.py               # ProjectBase, ProjectResponse
│   │   │   ├── matching.py              # MatchRequestPayload, CandidateMatchResult
│   │   │   ├── user.py
│   │   │   └── team.py
│   │   ├── services/                    # Business Logic & AI Services
│   │   │   ├── ai_matching.py           # Tích hợp google-genai (Gemini AI) sinh điểm & reasoning < 50 từ
│   │   │   ├── matching_service.py      # Thuật toán tính Jaccard similarity cục bộ
│   │   │   ├── user_service.py
│   │   │   └── team_service.py
│   │   ├── __init__.py
│   │   └── main.py                      # Khởi tạo FastAPI App, CORS Middleware & Routes
│   ├── requirements.txt                 # fastapi, uvicorn, supabase, google-genai, pydantic...
│   ├── main.py                          # Entry point chạy Uvicorn server
│   ├── render.yaml                      # Cấu hình Deploy FastAPI lên Render Cloud
│   ├── railway.json                     # Cấu hình Deploy FastAPI lên Railway
│   ├── Dockerfile                       # Production Docker image (Python 3.11-slim)
│   ├── Dockerfile.dev                   # Hot-reload container cho môi trường dev
│   └── README.md                        # Tài liệu chi tiết Backend
│
├── database/                            # Cấu hình Cơ sở dữ liệu (PostgreSQL & Supabase)
│   ├── schema.sql                       # Schema Supabase hoàn chỉnh (Profiles, Projects, Teams, Tasks, Feedbacks, RLS & Realtime)
│   └── init/
│       └── 01-init.sql                  # Script SQL tạo schema ban đầu cho local PostgreSQL
│
├── deploy/                              # Cấu hình triển khai hệ thống (DevOps)
│   ├── nginx/
│   │   └── nginx.conf                   # Reverse Proxy phân luồng API (/api/) & Web (/)
│   └── scripts/
│       ├── deploy.sh                    # Kịch bản triển khai tự động lên máy chủ
│       └── backup.sh                    # Kịch bản sao lưu dữ liệu tự động
│
├── docker-compose.yml                   # Docker Compose chạy đồng thời Frontend và Backend trong môi trường Local Dev
├── run.sh                               # Script Bash chạy toàn bộ hệ thống (Frontend + Backend) trong 1 lần
├── start.bat                            # Script Windows 1-Click chạy ứng dụng
├── .env.example                         # Biến môi trường mẫu chi tiết (SUPABASE_URL, GEMINI_API_KEY)
├── .gitignore                           # GitIgnore chuẩn hóa cho cả Node.js và Python
└── README.md                            # Hướng dẫn tổng quan & Onboarding thành viên mới
```

---

## 🚀 Hướng Dẫn Dành Cho Thành Viên Mới (Onboarding Guide)

### Bước 1: Clone Mã Nguồn (Clone Repository)
```bash
git clone https://github.com/your-username/MatchingTeam.git
cd MatchingTeam
```

---

### Bước 2: Cấu Hình File Biến Môi Trường (`.env`)
Tạo file `.env` tại thư mục gốc từ file mẫu:
```bash
cp .env.example .env
```

Mở file `.env` và điền các thông tin quan trọng sau:

```env
# 1. Supabase Cloud Configuration (Lấy từ Supabase Dashboard -> Project Settings -> API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-role-key

# 2. Google Gemini AI API Key (Lấy miễn phí tại: https://aistudio.google.com/)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash

# 3. Backend Service
HOST=0.0.0.0
PORT=8000
DEBUG=True

# 4. Frontend Service
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-service-role-key
```

> [!NOTE]
> Nếu bạn chưa có sẵn key Supabase hoặc Gemini, hệ thống đã tích hợp sẵn **chế độ Demo 1-Click** và **cơ chế Fallback thông minh**, cho phép chạy và kiểm thử toàn bộ giao diện mà không gặp bất kỳ lỗi gián đoạn nào!

---

### Bước 3: Lệnh Khởi Chạy Local (Run Local)

#### 🚀 Cách 1: Chạy 1 Lần Duy Nhất Với File Bash (`run.sh`) - Khuyến nghị
Chỉ cần thực thi file [`run.sh`](file:///d:/MatchingTeam/run.sh) (tự động sao chép `.env`, phát hiện Docker hoặc tự động kích hoạt Python/Node và mở trình duyệt):

```bash
# Trên Linux, macOS hoặc Git Bash trên Windows:
./run.sh

# Hoặc trên Windows CMD / PowerShell (chạy file .bat):
start.bat
```
- Tự động phát hiện Docker: nếu Docker đang mở, script sẽ chạy `docker compose up --build`.
- Nếu không dùng Docker: script tự động tạo môi trường ảo Python, cài đặt thư viện và khởi chạy đồng thời cả **Frontend (port 3000)** và **Backend (port 8000)** trong nền.
- Tự động mở trình duyệt web tại [http://localhost:3000](http://localhost:3000).
- Nhấn `Ctrl + C` để tắt sạch tất cả tiến trình cùng lúc.

---

#### 🐳 Cách 2: Khởi chạy bằng Docker Compose
Chạy đồng thời cả **Frontend Next.js (port 3000)** và **Backend FastAPI (port 8000)** với tính năng Hot-Reload:

```bash
docker compose up --build
```

- **Frontend Web**: [http://localhost:3000](http://localhost:3000)
- **Bảng điều khiển**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **FastAPI Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

#### 💻 Cách 2: Khởi chạy trực tiếp qua Terminal (Manual Run)

##### 1. Khởi chạy Backend (FastAPI):
```bash
cd backend

# Tạo và kích hoạt virtual environment
python -m venv .venv
# Trên Windows:
.venv\Scripts\activate
# Trên macOS/Linux:
source .venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt

# Chạy server với Uvicorn (Hot-Reload)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

##### 2. Khởi chạy Frontend (Next.js 15):
Mở một cửa sổ Terminal mới:
```bash
cd frontend

# Cài đặt thư viện
npm install

# Chạy dev server
npm run dev
```

---

## 📡 Danh Sách API Endpoints Chính

| Method | Endpoint | Tham số / Payload | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Không | Kiểm tra tình trạng hoạt động của API và CORS origins |
| `GET` | `/api/projects` | `course_code` (Query param) | Trả về danh sách dự án đang mở tuyển thành viên, lọc theo mã học phần (`CS402`, `SE330`, v.v.) |
| `POST` | `/api/match` | `{ project: {...}, candidates: [...] }` | Ghép ứng viên bằng **Gemini AI (google-genai)**, trả về điểm tương thích (0-100%) và lý do dưới 50 chữ |
| `POST` | `/api/v1/auth/login` | `username`, `password` | Đăng nhập nhận JWT Access Token |
| `POST` | `/api/v1/auth/register` | User profile data | Đăng ký tài khoản người dùng mới |
| `GET` | `/api/v1/users/me` | Bearer Token | Lấy thông tin cá nhân của người dùng hiện tại |

---

## 🚢 Hướng Dẫn Deploy Lên Production

### 1. Deploy Backend lên Render hoặc Railway
- **Render**: Dự án đã có sẵn file [`backend/render.yaml`](file:///d:/MatchingTeam/backend/render.yaml). Truy cập [Render.com](https://render.com) $\rightarrow$ *New Blueprint Instance* $\rightarrow$ chọn repo `MatchingTeam`.
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Railway**: Dự án đã có sẵn file [`backend/railway.json`](file:///d:/MatchingTeam/backend/railway.json). Kết nối repo GitHub với [Railway.app](https://railway.app), hệ thống sẽ tự động build và chạy qua Nixpacks.

### 2. Deploy Frontend lên Vercel
- Kết nối GitHub repo với [Vercel.com](https://vercel.com).
- Chọn root directory là `frontend`.
- Thêm Environment Variable: `NEXT_PUBLIC_API_URL` trỏ tới URL backend đã deploy trên Render/Railway.

### 3. CI/CD Tự Động Với GitHub Actions
- File [`.github/workflows/ci.yml`](file:///d:/MatchingTeam/.github/workflows/ci.yml) được cấu hình tự động:
  - **Frontend Job**: Chạy `npm ci`, kiểm tra ESLint và build bundle Next.js.
  - **Backend Job**: Thiết lập Python 3.11, cài đặt `requirements.txt`, kiểm tra cú pháp với `flake8` và xác thực khởi tạo FastAPI App.
  - Tự động kích hoạt mỗi khi push code hoặc mở Pull Request vào nhánh `main`.
