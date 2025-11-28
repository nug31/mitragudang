# Gudang Mitra - Push to GitHub Script
# Repository: https://github.com/nug31/mitragudang.git

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gudang Mitra - GitHub Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "[OK] Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git belum terinstall!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Silakan install Git terlebih dahulu:" -ForegroundColor Yellow
    Write-Host "1. Download dari: https://git-scm.com/download/win" -ForegroundColor Gray
    Write-Host "2. Install dengan setting default" -ForegroundColor Gray
    Write-Host "3. Restart PowerShell setelah install" -ForegroundColor Gray
    Write-Host "4. Jalankan script ini lagi" -ForegroundColor Gray
    Write-Host ""
    pause
    exit 1
}

Write-Host ""

# Check git config
Write-Host "Checking Git configuration..." -ForegroundColor Yellow
$gitName = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if ([string]::IsNullOrWhiteSpace($gitName) -or [string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Host "[WARNING] Git config belum di-set" -ForegroundColor Yellow
    Write-Host ""
    
    if ([string]::IsNullOrWhiteSpace($gitName)) {
        $name = Read-Host "Masukkan nama Anda (contoh: nug31)"
        git config --global user.name "$name"
        Write-Host "[OK] Git name set to: $name" -ForegroundColor Green
    }
    
    if ([string]::IsNullOrWhiteSpace($gitEmail)) {
        $email = Read-Host "Masukkan email GitHub Anda"
        git config --global user.email "$email"
        Write-Host "[OK] Git email set to: $email" -ForegroundColor Green
    }
} else {
    Write-Host "[OK] Git config:" -ForegroundColor Green
    Write-Host "  Name: $gitName" -ForegroundColor Gray
    Write-Host "  Email: $gitEmail" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Repository Information" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository: https://github.com/nug31/mitragudang.git" -ForegroundColor White
Write-Host ""

# Initialize git if needed
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "[OK] Git repository already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Add or update remote
Write-Host "Setting up remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/nug31/mitragudang.git"

$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "[INFO] Remote 'origin' already exists: $existingRemote" -ForegroundColor Gray
    git remote set-url origin $remoteUrl
    Write-Host "[OK] Remote 'origin' updated to: $remoteUrl" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "[OK] Remote 'origin' added: $remoteUrl" -ForegroundColor Green
}

Write-Host ""

# Create .gitignore if not exists
Write-Host "Checking .gitignore..." -ForegroundColor Yellow
if (-not (Test-Path ".gitignore")) {
    Write-Host "[INFO] Creating .gitignore..." -ForegroundColor Gray
    
    $gitignoreContent = @"
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.development
.env.test
.env.production.local

# Build output
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
"@
    
    Set-Content -Path ".gitignore" -Value $gitignoreContent
    Write-Host "[OK] .gitignore created" -ForegroundColor Green
} else {
    Write-Host "[OK] .gitignore already exists" -ForegroundColor Green
}

Write-Host ""

# Check current branch
Write-Host "Checking current branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current 2>$null

if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    Write-Host "[INFO] No branch yet (first commit)" -ForegroundColor Gray
    $targetBranch = "main"
} else {
    Write-Host "[OK] Current branch: $currentBranch" -ForegroundColor Green
    $targetBranch = $currentBranch
}

Write-Host ""

# Add files
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Adding Files to Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

$stagedFiles = git diff --cached --name-only
$fileCount = ($stagedFiles | Measure-Object).Count

if ($fileCount -eq 0) {
    Write-Host "[INFO] No changes to commit" -ForegroundColor Yellow
    Write-Host ""
    
    $forcePush = Read-Host "Push existing commits? (y/n)"
    if ($forcePush -ne "y" -and $forcePush -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Yellow
        pause
        exit 0
    }
} else {
    Write-Host "[OK] $fileCount files staged for commit" -ForegroundColor Green
    Write-Host ""
    
    # Show some of the files
    Write-Host "Files to be committed (showing first 10):" -ForegroundColor Gray
    $stagedFiles | Select-Object -First 10 | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Gray
    }
    
    if ($fileCount -gt 10) {
        Write-Host "  ... and $($fileCount - 10) more files" -ForegroundColor Gray
    }
    
    Write-Host ""
    
    # Commit
    Write-Host "Committing changes..." -ForegroundColor Yellow
    $commitMessage = "Deploy Gudang Mitra Application - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    
    git commit -m "$commitMessage"
    Write-Host "[OK] Changes committed" -ForegroundColor Green
}

Write-Host ""

# Push to GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pushing to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "CATATAN:" -ForegroundColor Yellow
Write-Host "- Jika diminta login, gunakan username GitHub Anda" -ForegroundColor Gray
Write-Host "- Untuk password, gunakan Personal Access Token (bukan password biasa)" -ForegroundColor Gray
Write-Host "- Cara buat token: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host ""

try {
    # Try to push
    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
        # First push, set upstream
        git push -u origin main 2>&1
    } else {
        # Subsequent push
        git push origin $targetBranch 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  SUCCESS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "[OK] Kode berhasil di-push ke GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Verify di: https://github.com/nug31/mitragudang" -ForegroundColor Cyan
        Write-Host ""
    } else {
        throw "Push failed"
    }
} catch {
    Write-Host ""
    Write-Host "[ERROR] Push gagal!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Kemungkinan penyebab:" -ForegroundColor Yellow
    Write-Host "1. Belum login ke GitHub" -ForegroundColor Gray
    Write-Host "2. Password salah (harus gunakan Personal Access Token)" -ForegroundColor Gray
    Write-Host "3. Tidak punya akses ke repository" -ForegroundColor Gray
    Write-Host "4. Koneksi internet bermasalah" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Solusi:" -ForegroundColor Yellow
    Write-Host "1. Buat Personal Access Token di: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "2. Gunakan token sebagai password saat push" -ForegroundColor Gray
    Write-Host "3. Atau gunakan GitHub Desktop: https://desktop.github.com" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Baca panduan lengkap di: SETUP-GITHUB.md" -ForegroundColor Cyan
    Write-Host ""
    pause
    exit 1
}

# Next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Kode sudah ter-upload ke GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor White
Write-Host "1. Deploy backend ke Railway" -ForegroundColor Gray
Write-Host "   - Buka: https://railway.app/dashboard" -ForegroundColor Gray
Write-Host "   - New Project → Deploy from GitHub repo" -ForegroundColor Gray
Write-Host "   - Pilih: nug31/mitragudang" -ForegroundColor Gray
Write-Host "   - Ikuti panduan: LANGKAH-MUDAH.md" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update frontend configuration" -ForegroundColor Gray
Write-Host "   - Jalankan: .\quick-fix-railway.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test aplikasi" -ForegroundColor Gray
Write-Host "   - https://gudang-mitra-app.netlify.app" -ForegroundColor Gray
Write-Host ""

pause

