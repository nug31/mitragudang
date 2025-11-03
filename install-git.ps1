# Install Git for Windows
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Git Installation Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is already installed
try {
    $gitVersion = git --version 2>&1
    Write-Host "[OK] Git sudah terinstall: $gitVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "Anda bisa langsung menjalankan:" -ForegroundColor White
    Write-Host "  .\push-to-github.ps1" -ForegroundColor Cyan
    Write-Host ""
    pause
    exit 0
} catch {
    Write-Host "[INFO] Git belum terinstall" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Git diperlukan untuk upload kode ke GitHub." -ForegroundColor White
Write-Host ""

# Option 1: Download Git
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Opsi 1: Download Git Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Saya akan membuka halaman download Git." -ForegroundColor White
Write-Host "Silakan:" -ForegroundColor White
Write-Host "1. Download Git installer" -ForegroundColor Gray
Write-Host "2. Jalankan installer" -ForegroundColor Gray
Write-Host "3. Klik Next, Next, Next (gunakan setting default)" -ForegroundColor Gray
Write-Host "4. Setelah selesai, restart PowerShell" -ForegroundColor Gray
Write-Host "5. Jalankan: .\push-to-github.ps1" -ForegroundColor Gray
Write-Host ""

$download = Read-Host "Buka halaman download Git? (y/n)"

if ($download -eq "y" -or $download -eq "Y") {
    Write-Host ""
    Write-Host "Membuka browser..." -ForegroundColor Yellow
    Start-Process "https://git-scm.com/download/win"
    Write-Host ""
    Write-Host "[OK] Browser dibuka!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Setelah install Git:" -ForegroundColor Yellow
    Write-Host "1. Restart PowerShell" -ForegroundColor Gray
    Write-Host "2. Jalankan: .\push-to-github.ps1" -ForegroundColor Gray
    Write-Host ""
    pause
    exit 0
}

# Option 2: Use GitHub Desktop
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Opsi 2: Gunakan GitHub Desktop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GitHub Desktop adalah aplikasi GUI yang lebih mudah." -ForegroundColor White
Write-Host ""
Write-Host "Langkah-langkah:" -ForegroundColor White
Write-Host "1. Download GitHub Desktop" -ForegroundColor Gray
Write-Host "2. Install dan login dengan akun GitHub" -ForegroundColor Gray
Write-Host "3. File -> Add Local Repository" -ForegroundColor Gray
Write-Host "4. Pilih folder project ini" -ForegroundColor Gray
Write-Host "5. Publish repository ke GitHub" -ForegroundColor Gray
Write-Host ""

$downloadDesktop = Read-Host "Buka halaman download GitHub Desktop? (y/n)"

if ($downloadDesktop -eq "y" -or $downloadDesktop -eq "Y") {
    Write-Host ""
    Write-Host "Membuka browser..." -ForegroundColor Yellow
    Start-Process "https://desktop.github.com/"
    Write-Host ""
    Write-Host "[OK] Browser dibuka!" -ForegroundColor Green
    Write-Host ""
    pause
    exit 0
}

# Option 3: Manual upload
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Opsi 3: Upload Manual via Web" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Anda bisa upload file secara manual ke GitHub:" -ForegroundColor White
Write-Host ""
Write-Host "Langkah-langkah:" -ForegroundColor White
Write-Host "1. Buka: https://github.com/nug31/mitragudang" -ForegroundColor Gray
Write-Host "2. Klik 'Add file' -> 'Upload files'" -ForegroundColor Gray
Write-Host "3. Drag & drop folder 'server' dan file-file lainnya" -ForegroundColor Gray
Write-Host "4. Klik 'Commit changes'" -ForegroundColor Gray
Write-Host ""
Write-Host "CATATAN: Jangan upload folder 'node_modules'" -ForegroundColor Yellow
Write-Host ""

$openGithub = Read-Host "Buka repository GitHub? (y/n)"

if ($openGithub -eq "y" -or $openGithub -eq "Y") {
    Write-Host ""
    Write-Host "Membuka browser..." -ForegroundColor Yellow
    Start-Process "https://github.com/nug31/mitragudang"
    Write-Host ""
    Write-Host "[OK] Browser dibuka!" -ForegroundColor Green
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rekomendasi" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Untuk kemudahan jangka panjang, saya rekomendasikan:" -ForegroundColor White
Write-Host "1. Install Git (Opsi 1) - Paling powerful" -ForegroundColor Green
Write-Host "2. Atau GitHub Desktop (Opsi 2) - Paling mudah" -ForegroundColor Green
Write-Host ""

pause

