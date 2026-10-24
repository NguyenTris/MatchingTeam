@echo off
TITLE MatchingTeam - 1-Click Runner
COLOR 0B
echo =====================================================================
echo    MatchingTeam - Khoi Chay He Thong Trong 1 Lan (1-Click Run)
echo    Next.js 15 (App Router) + Python FastAPI + Supabase + Gemini AI
echo =====================================================================
echo.

cd /d "%~dp0"

:: Đảm bảo PATH có Node.js
if exist "C:\Program Files\nodejs" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
)

:: 1. Kiem tra file .env
if not exist ".env" (
    echo [!] Chua tim thay file .env. Dang tao tu .env.example...
    copy .env.example .env >nul
    echo [OK] Da tao file .env thanh cong!
)

:: 2. Kiem tra Docker
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Phat hien Docker dang chay. Dang khoi dong qua Docker Compose...
    start http://localhost:3000
    docker compose up --build
    goto end
)

:: 3. Chay Local neu khong co Docker
echo [*] Khoi chay bang Python va Node.js...

:: Start Backend in new window
echo [1/2] Dang khoi chay FastAPI Backend tren cong 8000...
start "MatchingTeam - Backend API" cmd /k "cd /d %~dp0backend && if not exist .venv (py -3.12 -m venv .venv 2>nul || python -m venv .venv) && call .venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: Start Frontend in new window
echo [2/2] Dang khoi chay Next.js Frontend tren cong 3000...
start "MatchingTeam - Frontend Web" cmd /k "if exist ""C:\Program Files\nodejs"" set ""PATH=C:\Program Files\nodejs;%%PATH%%"" && cd /d %~dp0frontend && if not exist node_modules (npm install) && npm run dev"

timeout /t 5 >nul
start http://localhost:3000

echo.
echo =====================================================================
echo   He thong da khoi dong xong!
echo   Web: http://localhost:3000
echo   API: http://localhost:8000/docs
echo =====================================================================

:end
