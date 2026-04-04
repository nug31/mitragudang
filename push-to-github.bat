@echo off
echo ========================================
echo   Gudang Mitra - GitHub Push Script
echo ========================================
echo.

REM Check if git is installed
echo Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git belum terinstall!
    echo.
    echo Silakan install Git terlebih dahulu:
    echo 1. Download dari: https://git-scm.com/download/win
    echo 2. Install dengan setting default
    echo 3. Restart Command Prompt setelah install
    echo 4. Jalankan script ini lagi
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Initialize git if needed
echo Initializing Git repository...
if exist ".git" (
    echo [OK] Git repository already initialized
) else (
    git init
    echo [OK] Git repository initialized
)
echo.

REM Add or update remote
echo Setting up remote repository...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/nug31/mitragudang.git
    echo [OK] Remote 'origin' added
) else (
    git remote set-url origin https://github.com/nug31/mitragudang.git
    echo [OK] Remote 'origin' updated
)
echo.

REM Create .gitignore if not exists
if not exist ".gitignore" (
    echo Creating .gitignore...
    (
        echo # Dependencies
        echo node_modules/
        echo package-lock.json
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.development
        echo .env.test
        echo .env.production.local
        echo.
        echo # Build output
        echo dist/
        echo build/
        echo *.log
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
    ) > .gitignore
    echo [OK] .gitignore created
)
echo.

REM Add files
echo ========================================
echo   Adding Files to Git
echo ========================================
echo.

echo Adding all files...
git add .
echo [OK] Files staged for commit
echo.

REM Commit
echo Committing changes...
git commit -m "Deploy Gudang Mitra Application"
if errorlevel 1 (
    echo [INFO] No changes to commit or already committed
)
echo.

REM Push to GitHub
echo ========================================
echo   Pushing to GitHub
echo ========================================
echo.

echo Pushing to GitHub...
echo.
echo CATATAN:
echo - Jika diminta login, gunakan username GitHub Anda
echo - Untuk password, gunakan Personal Access Token
echo - Cara buat token: https://github.com/settings/tokens
echo.

git push -u origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Push gagal!
    echo.
    echo Kemungkinan penyebab:
    echo 1. Belum login ke GitHub
    echo 2. Password salah (harus gunakan Personal Access Token^)
    echo 3. Tidak punya akses ke repository
    echo 4. Koneksi internet bermasalah
    echo.
    echo Solusi:
    echo 1. Buat Personal Access Token di: https://github.com/settings/tokens
    echo 2. Gunakan token sebagai password saat push
    echo 3. Atau gunakan GitHub Desktop: https://desktop.github.com
    echo.
    echo Baca panduan lengkap di: SETUP-GITHUB.md
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo [OK] Kode berhasil di-push ke GitHub!
echo.
echo Verify di: https://github.com/nug31/mitragudang
echo.

REM Next steps
echo ========================================
echo   Next Steps
echo ========================================
echo.
echo Kode sudah ter-upload ke GitHub!
echo.
echo Langkah selanjutnya:
echo 1. Deploy backend ke Railway
echo    - Buka: https://railway.app/dashboard
echo    - New Project -^> Deploy from GitHub repo
echo    - Pilih: nug31/mitragudang
echo    - Ikuti panduan: LANGKAH-MUDAH.md
echo.
echo 2. Update frontend configuration
echo    - Jalankan: quick-fix-railway.bat
echo.
echo 3. Test aplikasi
echo    - https://gudang-mitra-app.netlify.app
echo.

pause

