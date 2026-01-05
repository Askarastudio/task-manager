@echo off
echo 🚀 IkuHub Proyeksi - Quick Setup Script
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file for DEMO mode...
    (
        echo VITE_APP_MODE=demo
        echo VITE_API_BASE_URL=
    ) > .env
    echo ✅ .env created (Demo mode - data in browser only^)
    echo.
    echo ℹ️  To enable production mode with database:
    echo    1. Setup backend API (see backend-api/README.md^)
    echo    2. Update .env with your API URL:
    echo       VITE_API_BASE_URL=https://apiproyek.ikuhub.com
    echo       VITE_APP_MODE=production
    echo.
) else (
    echo ✅ .env file already exists
    type .env
    echo.
)

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
    echo.
) else (
    echo ✅ Dependencies already installed
    echo.
)

echo 🎉 Setup complete!
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:5173
echo   3. Login with: any email + password 'Ikuhub@2025'
echo.
echo 📚 Documentation:
echo   - PRODUCTION_SETUP.md - API ^& Database setup
echo   - DEPLOYMENT.md - Production deployment guide
echo   - backend-api/README.md - Backend server setup
echo.
pause
