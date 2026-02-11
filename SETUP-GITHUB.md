# 🔗 Setup GitHub Repository - Gudang Mitra

## 📋 Informasi Repository

**Repository URL:** https://github.com/nug31/mitragudang.git

Repository ini akan digunakan untuk:
- ✅ Deploy backend ke Railway
- ✅ Version control kode Anda
- ✅ Backup kode secara online

---

## 🚀 Langkah-Langkah Setup

### **Step 1: Install Git (Jika Belum Ada)**

1. **Download Git:**
   - Buka: https://git-scm.com/download/win
   - Download versi terbaru untuk Windows
   - Atau gunakan installer yang sudah ada di project (jika ada)

2. **Install Git:**
   - Jalankan installer
   - Gunakan setting default (Next, Next, Next)
   - Pastikan "Git Bash" dan "Git CMD" tercentang

3. **Verify Installation:**
   - Buka Command Prompt atau PowerShell baru
   - Ketik: `git --version`
   - Harus muncul versi Git (contoh: `git version 2.40.0`)

---

### **Step 2: Konfigurasi Git**

Buka PowerShell atau Command Prompt di folder project, lalu jalankan:

```bash
# Set nama Anda
git config --global user.name "nug31"

# Set email Anda (gunakan email GitHub Anda)
git config --global user.email "your-email@example.com"
```

Ganti `your-email@example.com` dengan email GitHub Anda.

---

### **Step 3: Initialize Git Repository**

```bash
# Initialize git (jika belum)
git init

# Tambahkan remote repository
git remote add origin https://github.com/nug31/mitragudang.git

# Atau jika sudah ada remote, update:
git remote set-url origin https://github.com/nug31/mitragudang.git
```

---

### **Step 4: Prepare Files untuk Push**

```bash
# Cek status
git status

# Add semua file
git add .

# Commit
git commit -m "Initial commit - Gudang Mitra Application"
```

---

### **Step 5: Push ke GitHub**

```bash
# Push ke GitHub
git push -u origin main
```

**Jika diminta login:**
- Masukkan username GitHub: `nug31`
- Masukkan password atau Personal Access Token

**Jika branch bernama "master" bukan "main":**
```bash
git push -u origin master
```

---

### **Step 6: Verify di GitHub**

1. Buka browser
2. Pergi ke: https://github.com/nug31/mitragudang
3. Refresh halaman
4. Anda harus melihat semua file project sudah ter-upload

---

## 🔐 Setup Personal Access Token (Jika Diperlukan)

GitHub tidak lagi menerima password biasa untuk push. Anda perlu Personal Access Token:

### **Cara Membuat Token:**

1. **Login ke GitHub:**
   - Buka: https://github.com
   - Login dengan akun `nug31`

2. **Buka Settings:**
   - Klik foto profil (pojok kanan atas)
   - Klik "Settings"

3. **Developer Settings:**
   - Scroll ke bawah
   - Klik "Developer settings" (paling bawah)

4. **Personal Access Tokens:**
   - Klik "Personal access tokens"
   - Klik "Tokens (classic)"
   - Klik "Generate new token"
   - Klik "Generate new token (classic)"

5. **Konfigurasi Token:**
   - Note: `Railway Deployment`
   - Expiration: `90 days` atau `No expiration`
   - Select scopes:
     - ✅ `repo` (centang semua)
     - ✅ `workflow`
   - Klik "Generate token"

6. **Copy Token:**
   - **PENTING:** Copy token yang muncul
   - Simpan di tempat aman (Notepad)
   - Token hanya muncul sekali!

7. **Gunakan Token:**
   - Saat push, gunakan token sebagai password
   - Username: `nug31`
   - Password: `[paste token Anda]`

---

## 🎯 Cara Alternatif: Upload via GitHub Web

Jika Git terlalu ribet, Anda bisa upload manual:

### **Step 1: Compress Project**

1. Buka folder project
2. Select semua file dan folder (kecuali `node_modules`)
3. Klik kanan → "Compress to ZIP"
4. Atau buat ZIP manual

### **Step 2: Upload ke GitHub**

1. **Buka repository:**
   - https://github.com/nug31/mitragudang

2. **Upload files:**
   - Klik "Add file" → "Upload files"
   - Drag & drop file ZIP atau select files
   - Atau upload folder demi folder

3. **Commit:**
   - Scroll ke bawah
   - Isi commit message: "Upload Gudang Mitra Application"
   - Klik "Commit changes"

**CATATAN:** Cara ini lebih lambat dan tidak recommended untuk project besar.

---

## 🚀 Setelah Push ke GitHub

Setelah kode ter-upload ke GitHub:

### **Step 1: Deploy Backend ke Railway**

1. **Buka Railway:**
   - https://railway.app/dashboard

2. **New Project:**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"

3. **Select Repository:**
   - Pilih `nug31/mitragudang`
   - Klik "Deploy"

4. **Configure:**
   - Set Root Directory: `server`
   - Set Environment Variables (9 variables)
   - Generate Domain

5. **Ikuti panduan:** `LANGKAH-MUDAH.md`

---

## 📝 Script Otomatis

Saya sudah buatkan script untuk memudahkan:

### **Opsi 1: PowerShell Script**

Buat file `push-to-github.ps1`:

```powershell
# Check if git is installed
try {
    git --version
} catch {
    Write-Host "Git belum terinstall!" -ForegroundColor Red
    Write-Host "Download dari: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Initialize and push
Write-Host "Initializing Git repository..." -ForegroundColor Cyan
git init

Write-Host "Adding remote..." -ForegroundColor Cyan
git remote add origin https://github.com/nug31/mitragudang.git 2>$null
git remote set-url origin https://github.com/nug31/mitragudang.git

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing..." -ForegroundColor Cyan
git commit -m "Deploy Gudang Mitra Application"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "Done!" -ForegroundColor Green
```

Jalankan:
```powershell
.\push-to-github.ps1
```

### **Opsi 2: Batch Script**

Buat file `push-to-github.bat`:

```batch
@echo off
echo Checking Git installation...
git --version
if errorlevel 1 (
    echo Git belum terinstall!
    echo Download dari: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo Initializing Git repository...
git init

echo Adding remote...
git remote add origin https://github.com/nug31/mitragudang.git 2>nul
git remote set-url origin https://github.com/nug31/mitragudang.git

echo Adding files...
git add .

echo Committing...
git commit -m "Deploy Gudang Mitra Application"

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done!
pause
```

Jalankan:
```cmd
push-to-github.bat
```

---

## ✅ Checklist

- [ ] Git sudah terinstall
- [ ] Git config (name & email) sudah di-set
- [ ] Repository sudah di-initialize
- [ ] Remote origin sudah ditambahkan
- [ ] Files sudah di-commit
- [ ] Kode sudah di-push ke GitHub
- [ ] Verify di https://github.com/nug31/mitragudang

---

## 🆘 Troubleshooting

### **Error: "git is not recognized"**

**Solusi:**
1. Install Git dari https://git-scm.com/download/win
2. Restart PowerShell/CMD setelah install
3. Verify dengan `git --version`

---

### **Error: "Permission denied"**

**Solusi:**
1. Buat Personal Access Token (lihat panduan di atas)
2. Gunakan token sebagai password saat push

---

### **Error: "Repository not found"**

**Solusi:**
1. Pastikan repository sudah dibuat di GitHub
2. Pastikan URL benar: `https://github.com/nug31/mitragudang.git`
3. Pastikan Anda punya akses ke repository

---

### **Error: "Failed to push"**

**Solusi:**
1. Cek koneksi internet
2. Cek apakah sudah login ke GitHub
3. Gunakan Personal Access Token
4. Atau gunakan GitHub Desktop

---

## 🎯 Alternatif: GitHub Desktop

Jika command line terlalu ribet:

1. **Download GitHub Desktop:**
   - https://desktop.github.com/

2. **Install dan Login:**
   - Install aplikasi
   - Login dengan akun GitHub

3. **Clone Repository:**
   - File → Clone Repository
   - Pilih `nug31/mitragudang`
   - Pilih folder tujuan

4. **Copy Files:**
   - Copy semua file project ke folder yang di-clone

5. **Commit & Push:**
   - Buka GitHub Desktop
   - Akan muncul semua perubahan
   - Isi commit message
   - Klik "Commit to main"
   - Klik "Push origin"

---

## 🎉 Setelah Selesai

Setelah kode ter-upload ke GitHub:

1. ✅ **Verify di GitHub:** https://github.com/nug31/mitragudang
2. ✅ **Deploy ke Railway:** Ikuti `LANGKAH-MUDAH.md`
3. ✅ **Update Frontend:** Jalankan `quick-fix-railway.ps1`
4. ✅ **Test Aplikasi:** https://gudang-mitra-app.netlify.app

**Aplikasi Anda akan fully functional! 🚀**

