# 🌐 MatchingTeam Frontend (Next.js 15 App Router & shadcn/ui)

Giao diện người dùng hiện đại xây dựng bằng **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, thư viện **shadcn/ui**, **Supabase Auth**, và kết nối trực tiếp với **FastAPI Backend (Gemini AI)**.

---

## 📂 Cấu Trúc Thư Mục Frontend

```text
frontend/
├── components.json          # Cấu hình shadcn/ui (style, aliases, cssVariables)
├── package.json             # Dependencies (Next.js, Supabase, next-themes, Tailwind, Radix)
├── tailwind.config.ts       # Theme màu Navy & Pastel Blue, shadcn HSL tokens
├── tsconfig.json            # Path alias (@/* trỏ tới ./src/*)
├── next.config.mjs          # Proxy API rewrites & Standalone build
├── Dockerfile               # Production multi-stage build
├── Dockerfile.dev           # Hot-reload container
└── src/
    ├── app/                 # Next.js App Router (Các trang & Routes)
    │   ├── globals.css      # HSL tokens cho Light/Dark theme & Navy styling
    │   ├── layout.tsx       # Root Layout bọc ThemeProvider & AuthProvider
    │   ├── page.tsx         # Trang chủ Landing Page giới thiệu nền tảng
    │   ├── login/           # Route /login: Đăng nhập Supabase Auth & Demo 1-Click
    │   │   └── page.tsx
    │   ├── dashboard/       # Route /dashboard: Tổng quan dự án, API fetch & AI Match Dialog
    │   │   └── page.tsx
    │   ├── projects/create/ # Route /projects/create: Form đăng ký đề tài & tìm đồng đội
    │   │   └── page.tsx
    │   └── workspace/[team_id]/ # Route /workspace/[team_id]: Bảng Kanban quản lý Task
    │       └── page.tsx
    ├── components/
    │   ├── auth/            # Quản lý xác thực & Bảo vệ Route
    │   │   └── AuthProvider.tsx # Provider bọc ứng dụng, kiểm tra session & chuyển hướng
    │   ├── layout/          # Global Layout components
    │   │   ├── AppLayout.tsx# Bọc Sidebar bên trái, TopNavbar & Content Area
    │   │   ├── Sidebar.tsx  # Sidebar định hướng với logo, menu & mini user profile
    │   │   └── TopNavbar.tsx# Header với search bar, thông báo, ThemeToggle & Avatar
    │   ├── ui/              # shadcn/ui Design System Primitives
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── input.tsx
    │   │   ├── progress.tsx
    │   │   └── select.tsx
    │   ├── theme-provider.tsx # Next-themes Provider wrapper
    │   ├── theme-toggle.tsx   # Nút chuyển đổi Light/Dark mode
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   └── FeatureGrid.tsx
    ├── hooks/
    │   └── useSupabaseAuth.ts # Hook truy cập trạng thái user, session, login/logout
    ├── lib/
    │   ├── api.ts           # Client gọi FastAPI: fetchProjects() & requestTeamMatch()
    │   ├── supabase.ts      # Khởi tạo Supabase client an toàn
    │   └── utils.ts         # Utility helper cn()
    ├── services/
    │   └── api.ts           # Re-export lib/api cho tính tương thích
    └── types/
        └── index.ts         # TypeScript interfaces
```

---

## ⚡ Các Tính Năng Đã Tích Hợp

### 1. Kết Nối FastAPI Backend ([`src/lib/api.ts`](file:///d:/MatchingTeam/frontend/src/lib/api.ts))
- **`fetchProjects(courseCode?)`**: Gọi `GET /api/projects` từ `http://localhost:8000`, có hỗ trợ lọc theo mã môn (`CS402`, `SE330`, `AI502`, `IS301`).
- **`requestTeamMatch(projectId, candidates?)`**: Gửi yêu cầu `POST /api/match` để nhận kết quả phân tích độ tương thích và giải thích dưới 50 chữ từ **Gemini AI**.
- **Cơ chế Dự phòng (Fallback Resilience)**: Tự động trả về dữ liệu mẫu khi backend đang khởi động, giúp giao diện không bao giờ bị gián đoạn.

### 2. Xác Thực Supabase & Bảo Vệ Route ([`src/components/auth/AuthProvider.tsx`](file:///d:/MatchingTeam/frontend/src/components/auth/AuthProvider.tsx))
- **Hook `useSupabaseAuth`**: Cung cấp `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`, `loginAsDemo`.
- **Route Guard**: Tự động chuyển hướng về `/login` nếu truy cập các route được bảo vệ (`/dashboard`, `/projects/create`, `/workspace/*`) khi chưa đăng nhập.
- **Tài khoản Demo 1-Click**: Cho phép kiểm thử tức thì không cần cấu hình Supabase phức tạp.

### 3. Trang Bảng Điều Khiển [`/dashboard`](file:///d:/MatchingTeam/frontend/src/app/dashboard/page.tsx)
- Gọi dữ liệu tự động từ `fetchProjects()`.
- Map toàn bộ danh sách ra các component **Card** của shadcn/ui:
  - Tên đề tài, mã học phần
  - Trạng thái (**OPEN**, **MATCHING**, **CLOSED**)
  - Thanh tiến độ (**Progress** bar 0-100%)
  - Nút **Ghép Đội AI** mở Modal hiển thị ứng viên và nhận xét từ Gemini.
