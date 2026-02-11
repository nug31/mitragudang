# Gudang Mitra - Quick Railway Connection Fix
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gudang Mitra - Quick Railway Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Langkah 1: Cek URL Backend Railway Anda" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "Silakan buka Railway dashboard:" -ForegroundColor White
Write-Host "1. Buka https://railway.app/dashboard" -ForegroundColor Gray
Write-Host "2. Pilih project backend Anda" -ForegroundColor Gray
Write-Host "3. Copy URL domain (contoh: gudangmitra-production.up.railway.app)" -ForegroundColor Gray
Write-Host ""

$railwayUrl = Read-Host "Masukkan URL Railway BACKEND Anda (tanpa https://)"

if ([string]::IsNullOrWhiteSpace($railwayUrl)) {
    Write-Host "Error: URL tidak boleh kosong!" -ForegroundColor Red
    pause
    exit 1
}

# Remove https:// or http:// if user included it
$railwayUrl = $railwayUrl -replace "^https?://", ""

# Check if user entered MySQL URL instead of backend URL
if ($railwayUrl -match "mysql-production") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  PERINGATAN!" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "URL yang Anda masukkan sepertinya adalah URL MySQL database," -ForegroundColor Yellow
    Write-Host "bukan URL backend service!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Anda perlu deploy BACKEND SERVICE terlebih dahulu." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Silakan baca: DEPLOY-BACKEND-RAILWAY.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Atau ikuti langkah berikut:" -ForegroundColor White
    Write-Host "1. Buka https://railway.app/dashboard" -ForegroundColor Gray
    Write-Host "2. Klik project Anda" -ForegroundColor Gray
    Write-Host "3. Klik '+ New' atau '+ Add Service'" -ForegroundColor Gray
    Write-Host "4. Pilih 'GitHub Repo' dan pilih repository Anda" -ForegroundColor Gray
    Write-Host "5. Set Root Directory ke 'server'" -ForegroundColor Gray
    Write-Host "6. Set environment variables" -ForegroundColor Gray
    Write-Host "7. Generate domain untuk backend service" -ForegroundColor Gray
    Write-Host ""

    $continue = Read-Host "Apakah Anda sudah punya URL backend service? (y/n)"

    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host ""
        Write-Host "Silakan deploy backend service terlebih dahulu." -ForegroundColor Yellow
        Write-Host "Baca panduan lengkap di: DEPLOY-BACKEND-RAILWAY.md" -ForegroundColor Cyan
        Write-Host ""
        pause
        exit 0
    }

    Write-Host ""
    $railwayUrl = Read-Host "Masukkan URL BACKEND service (bukan MySQL)"
    $railwayUrl = $railwayUrl -replace "^https?://", ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Updating Configuration Files..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Update .env.production
$envContent = "VITE_API_URL=https://$railwayUrl/api"
Set-Content -Path ".env.production" -Value $envContent
Write-Host "[OK] Updated .env.production" -ForegroundColor Green

# Update netlify.toml
$netlifyContent = @"
[build]
  command = "npm ci && npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"
  VITE_API_URL = "https://$railwayUrl/api"
  
# Redirect all routes to index.html for SPA routing  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
"@

Set-Content -Path "netlify.toml" -Value $netlifyContent
Write-Host "[OK] Updated netlify.toml" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration Updated!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: https://$railwayUrl/api" -ForegroundColor Green
Write-Host "Frontend URL: https://gudang-mitra-app.netlify.app" -ForegroundColor Green
Write-Host ""

# Test backend connection
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing Backend Connection..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    $testUrl = "https://$railwayUrl/health"
    Write-Host "Testing: $testUrl" -ForegroundColor Gray
    
    $response = Invoke-WebRequest -Uri $testUrl -Method Get -TimeoutSec 10 -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Backend Railway terhubung dengan baik!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[WARNING] Tidak dapat terhubung ke backend Railway" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pastikan:" -ForegroundColor Yellow
    Write-Host "1. Backend sudah di-deploy di Railway" -ForegroundColor Gray
    Write-Host "2. Domain sudah di-generate di Railway" -ForegroundColor Gray
    Write-Host "3. Environment variables sudah di-set dengan benar" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Build aplikasi:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy ke Netlify:" -ForegroundColor White
Write-Host "   netlify deploy --prod --dir=dist" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test aplikasi:" -ForegroundColor White
Write-Host "   https://gudang-mitra-app.netlify.app" -ForegroundColor Gray
Write-Host ""

$buildNow = Read-Host "Apakah Anda ingin build sekarang? (y/n)"

if ($buildNow -eq "y" -or $buildNow -eq "Y") {
    Write-Host ""
    Write-Host "Building application..." -ForegroundColor Yellow
    
    try {
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[OK] Build berhasil!" -ForegroundColor Green
            Write-Host ""
            
            $deployNow = Read-Host "Deploy ke Netlify sekarang? (y/n)"
            
            if ($deployNow -eq "y" -or $deployNow -eq "Y") {
                Write-Host ""
                Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
                
                netlify deploy --prod --dir=dist
                
                Write-Host ""
                Write-Host "[OK] Deploy selesai!" -ForegroundColor Green
                Write-Host ""
                Write-Host "Aplikasi Anda sekarang terhubung dengan Railway!" -ForegroundColor Green
                Write-Host "Buka: https://gudang-mitra-app.netlify.app" -ForegroundColor Cyan
            }
        } else {
            Write-Host ""
            Write-Host "[ERROR] Build gagal!" -ForegroundColor Red
        }
    } catch {
        Write-Host ""
        Write-Host "[ERROR] Build gagal: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show Railway environment variables reminder
Write-Host "REMINDER: Pastikan environment variables berikut sudah di-set di Railway:" -ForegroundColor Yellow
Write-Host ""
Write-Host "DB_HOST=nozomi.proxy.rlwy.net" -ForegroundColor Gray
Write-Host "DB_PORT=21817" -ForegroundColor Gray
Write-Host "DB_USER=root" -ForegroundColor Gray
Write-Host "DB_PASSWORD=pvOcQbzlDAobtcdozbMvCdIDDEmenwkO" -ForegroundColor Gray
Write-Host "DB_NAME=railway" -ForegroundColor Gray
Write-Host "DB_SSL=false" -ForegroundColor Gray
Write-Host "PORT=3002" -ForegroundColor Gray
Write-Host "NODE_ENV=production" -ForegroundColor Gray
Write-Host "CORS_ORIGIN=https://gudang-mitra-app.netlify.app" -ForegroundColor Gray
Write-Host ""

pause

