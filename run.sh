#!/usr/bin/env bash
# ==============================================================================
# 🚀 MatchingTeam - 1-Command Web Starter (Bash Script)
# Khởi chạy toàn bộ hệ thống (Frontend + Backend) chỉ với 1 lệnh duy nhất!
# Cách dùng:
#   ./run.sh          -> Tự động nhận diện Docker hoặc chạy Local
#   ./run.sh --docker -> Buộc chạy qua Docker Compose
#   ./run.sh --local  -> Buộc chạy qua Python virtualenv & Node.js
# ==============================================================================

set -e

# Màu sắc hiển thị terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Đảm bảo nhận diện Node.js & npm trên Windows nếu chưa có trong PATH
if ! command -v npm &> /dev/null; then
    if [ -d "/c/Program Files/nodejs" ]; then
        export PATH="/c/Program Files/nodejs:$PATH"
    elif [ -d "C:/Program Files/nodejs" ]; then
        export PATH="C:/Program Files/nodejs:$PATH"
    fi
fi

echo -e "${CYAN}${BOLD}"
echo "====================================================================="
echo "   🚀 MatchingTeam - Khởi Chạy Nền Tảng Trong 1 Lần (1-Command Run)   "
echo "   Next.js 15 (App Router) + Python FastAPI + Supabase + Gemini AI    "
echo "====================================================================="
echo -e "${NC}"

# ------------------------------------------------------------------------------
# 1. Kiểm tra & Tự động tạo file .env nếu chưa có
# ------------------------------------------------------------------------------
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[!] Chưa tìm thấy file .env. Đang tự động sao chép từ .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}[✓] Đã tạo file .env thành công!${NC}"
else
    echo -e "${GREEN}[✓] File cấu hình .env đã sẵn sàng.${NC}"
fi

# ------------------------------------------------------------------------------
# 2. Xác định phương thức chạy (Docker hay Local)
# ------------------------------------------------------------------------------
MODE="auto"
if [[ "$1" == "--docker" ]]; then
    MODE="docker"
elif [[ "$1" == "--local" ]]; then
    MODE="local"
fi

HAS_DOCKER=false
if command -v docker &> /dev/null && docker info &> /dev/null; then
    HAS_DOCKER=true
fi

# ------------------------------------------------------------------------------
# 3. Phương thức A: Chạy qua Docker Compose (Nếu có Docker đang hoạt động)
# ------------------------------------------------------------------------------
if [ "$MODE" == "docker" ] || ([ "$MODE" == "auto" ] && [ "$HAS_DOCKER" = true ]); then
    echo -e "${BLUE}[+] Phát hiện Docker daemon đang hoạt động. Khởi chạy bằng Docker Compose...${NC}"
    echo -e "${CYAN}--> Frontend: http://localhost:3000${NC}"
    echo -e "${CYAN}--> Backend API Docs: http://localhost:8000/docs${NC}"
    echo -e "${YELLOW}[*] Nhấn Ctrl+C để dừng hệ thống.${NC}\n"

    # Mở trình duyệt sau 3 giây (hỗ trợ Windows Git Bash, macOS, Linux)
    (
        sleep 4
        if command -v start &> /dev/null; then
            start http://localhost:3000 2>/dev/null || true
        elif command -v open &> /dev/null; then
            open http://localhost:3000 2>/dev/null || true
        elif command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:3000 2>/dev/null || true
        fi
    ) &

    # Khởi chạy Docker Compose
    docker compose up --build
    exit 0
fi

# ------------------------------------------------------------------------------
# 4. Phương thức B: Chạy Local trực tiếp (Python & Node.js)
# ------------------------------------------------------------------------------
echo -e "${YELLOW}[*] Khởi chạy ở chế độ Local (Python FastAPI & Next.js)...${NC}"

# Hàm dọn dẹp tiến trình nền khi nhấn Ctrl+C
cleanup() {
    echo -e "\n${RED}[!] Đang dừng tất cả các tiến trình nền...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}[✓] Đã tắt Frontend và Backend an toàn. Tạm biệt!${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 4.1 Khởi động Backend (FastAPI)
echo -e "\n${BLUE}[1/2] Đang thiết lập và chạy Backend (FastAPI)...${NC}"
cd "$ROOT_DIR/backend"

# Tìm lệnh python
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
fi

if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}--> Đang tạo môi trường ảo Python (.venv)...${NC}"
    $PYTHON_CMD -m venv .venv
fi

# Kích hoạt virtualenv
if [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
elif [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

echo -e "${YELLOW}--> Cài đặt / cập nhật thư viện backend...${NC}"
pip install -q -r requirements.txt

echo -e "${GREEN}--> Khởi chạy Uvicorn Backend trên cổng 8000...${NC}"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo -e "${GREEN}[✓] Backend đang chạy (PID: $BACKEND_PID) tại: http://localhost:8000${NC}"

# 4.2 Khởi động Frontend (Next.js)
echo -e "\n${BLUE}[2/2] Đang thiết lập và chạy Frontend (Next.js)...${NC}"
cd "$ROOT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}--> Đang cài đặt thư viện frontend (npm install)...${NC}"
    npm install
fi

echo -e "${GREEN}--> Khởi chạy Next.js Dev Server trên cổng 3000...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}[✓] Frontend đang chạy (PID: $FRONTEND_PID) tại: http://localhost:3000${NC}"

# 4.3 Mở trình duyệt web tự động
echo -e "\n${GREEN}${BOLD}====================================================================="
echo "   🎉 HỆ THỐNG ĐÃ SẴN SÀNG! ĐANG MỞ TRÌNH DUYỆT...                    "
echo "   🌐 Frontend Web:    http://localhost:3000                         "
echo "   📊 Dashboard:       http://localhost:3000/dashboard               "
echo "   📡 FastAPI Swagger: http://localhost:8000/docs                    "
echo "=====================================================================${NC}"
echo -e "${YELLOW}Nhấn [Ctrl + C] tại cửa sổ này để tắt toàn bộ hệ thống cùng lúc.${NC}\n"

sleep 3
if command -v start &> /dev/null; then
    start http://localhost:3000 2>/dev/null || true
elif command -v open &> /dev/null; then
    open http://localhost:3000 2>/dev/null || true
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 2>/dev/null || true
fi

# Giữ script chạy để lắng nghe phím Ctrl+C
wait
