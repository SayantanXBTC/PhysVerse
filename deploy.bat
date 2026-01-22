@echo off
echo 🚀 Starting PhysVerse deployment...

REM Check if we're in the right directory
if not exist "PhySSS" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

REM Frontend deployment
echo.
echo 📦 Building Frontend...
cd PhySSS\frontend

REM Install dependencies
echo ✅ Installing frontend dependencies...
call npm install

REM Build the project
echo ✅ Building frontend for production...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend build completed successfully!

REM Check for Netlify CLI
where netlify >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Deploying to Netlify...
    call netlify deploy --prod --dir=dist
    if %errorlevel% equ 0 (
        echo ✅ Frontend deployed to Netlify successfully!
    ) else (
        echo ⚠️ Netlify deployment failed. Please deploy manually.
    )
) else (
    echo ⚠️ Netlify CLI not found. Please install it or deploy manually.
    echo Run: npm install -g netlify-cli
)

REM Backend preparation
echo.
echo 🔧 Preparing Backend...
cd ..\backend

REM Install dependencies
echo ✅ Installing backend dependencies...
call npm install

REM Build the project
echo ✅ Building backend for production...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Backend build failed!
    pause
    exit /b 1
)

echo ✅ Backend build completed successfully!

echo.
echo 🎉 Deployment preparation completed!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Connect your GitHub repo to Render for backend deployment
echo 3. Set up environment variables on Render:
echo    - NODE_ENV=production
echo    - JWT_SECRET=your-secret-key
echo    - MONGODB_URI=your-mongodb-connection
echo    - FRONTEND_URL=your-netlify-url
echo 4. Update frontend .env.production with your Render backend URL
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
pause