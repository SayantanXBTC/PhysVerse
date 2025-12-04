@echo off
echo ========================================
echo PhysVerse Setup Script
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed!
echo.

echo [3/5] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed!
echo.

echo [4/5] Setting up environment files...
cd ..

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo Created backend/.env from example
) else (
    echo backend/.env already exists
)

if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env"
    echo Created frontend/.env from example
) else (
    echo frontend/.env already exists
)
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Configure backend/.env with your MongoDB URI and JWT secret
echo 2. Start MongoDB (if using local installation)
echo 3. Open two terminals:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm run dev
echo 4. Visit http://localhost:5173
echo.
echo For detailed instructions, see QUICKSTART.md
echo ========================================
pause
