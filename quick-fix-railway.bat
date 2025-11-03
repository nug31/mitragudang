@echo off
echo ========================================
echo   Gudang Mitra - Quick Railway Fix
echo ========================================
echo.

echo Langkah 1: Cek URL Backend Railway Anda
echo ----------------------------------------
echo.
echo Silakan buka Railway dashboard:
echo 1. Buka https://railway.app/dashboard
echo 2. Pilih project backend Anda
echo 3. Copy URL domain (contoh: gudangmitra-production.up.railway.app)
echo.

set /p RAILWAY_URL="Masukkan URL Railway Anda (tanpa https://): "

if "%RAILWAY_URL%"=="" (
    echo Error: URL tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Updating Configuration Files...
echo ========================================
echo.

REM Update .env.production
echo VITE_API_URL=https://%RAILWAY_URL%/api > .env.production
echo [OK] Updated .env.production

REM Update netlify.toml
(
echo [build]
echo   command = "npm ci && npm run build"
echo   publish = "dist"
echo   
echo [build.environment]
echo   NODE_VERSION = "18"
echo   NPM_FLAGS = "--production=false"
echo   VITE_API_URL = "https://%RAILWAY_URL%/api"
echo   
echo # Redirect all routes to index.html for SPA routing  
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
) > netlify.toml
echo [OK] Updated netlify.toml

echo.
echo ========================================
echo   Configuration Updated!
echo ========================================
echo.
echo Backend URL: https://%RAILWAY_URL%/api
echo Frontend URL: https://gudang-mitra-app.netlify.app
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Build aplikasi:
echo    npm run build
echo.
echo 2. Deploy ke Netlify:
echo    netlify deploy --prod --dir=dist
echo.
echo 3. Test aplikasi:
echo    https://gudang-mitra-app.netlify.app
echo.

set /p BUILD_NOW="Apakah Anda ingin build sekarang? (y/n): "

if /i "%BUILD_NOW%"=="y" (
    echo.
    echo Building application...
    call npm run build
    
    if errorlevel 1 (
        echo.
        echo [ERROR] Build gagal!
        pause
        exit /b 1
    )
    
    echo.
    echo [OK] Build berhasil!
    echo.
    
    set /p DEPLOY_NOW="Deploy ke Netlify sekarang? (y/n): "
    
    if /i "%DEPLOY_NOW%"=="y" (
        echo.
        echo Deploying to Netlify...
        call netlify deploy --prod --dir=dist
        
        echo.
        echo [OK] Deploy selesai!
        echo.
        echo Aplikasi Anda sekarang terhubung dengan Railway!
        echo Buka: https://gudang-mitra-app.netlify.app
    )
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
pause

