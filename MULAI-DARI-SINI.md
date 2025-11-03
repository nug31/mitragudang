# 🚀 MULAI DARI SINI - Setup Lengkap Gudang Mitra

## 📋 Situasi Anda Saat Ini

✅ **Yang Sudah Ada:**
- Frontend di Netlify: https://gudang-mitra-app.netlify.app
- MySQL Database di Railway: `mysql-production-628a.up.railway.app`
- GitHub Repository: https://github.com/nug31/mitragudang.git

❌ **Yang Belum Ada:**
- Backend Service di Railway (perlu di-deploy)
- Kode belum di-push ke GitHub (perlu di-upload)

---

## 🎯 Langkah-Langkah Lengkap (3 Tahap)

### **TAHAP 1: Upload Kode ke GitHub** ⏱️ 5 menit

#### **Cara Termudah - Gunakan Script:**

1. **Buka PowerShell** di folder project

2. **Jalankan script:**
   ```powershell
   .\push-to-github.ps1
   ```
   
   Atau jika PowerShell tidak bisa:
   ```cmd
   push-to-github.bat
   ```

3. **Ikuti instruksi** di layar:
   - Masukkan nama dan email (jika diminta)
   - Tunggu proses upload
   - Login ke GitHub jika diminta

4. **Verify:**
   - Buka: https://github.com/nug31/mitragudang
   - Pastikan semua file sudah ter-upload

#### **Jika Git Belum Terinstall:**

1. Download Git: https://git-scm.com/download/win
2. Install dengan setting default
3. Restart PowerShell/CMD
4. Jalankan script lagi

#### **Jika Diminta Password:**

- **Username:** `nug31`
- **Password:** Gunakan **Personal Access Token** (bukan password biasa)
- Cara buat token: https://github.com/settings/tokens
  - Klik "Generate new token (classic)"
  - Centang "repo"
  - Copy token dan gunakan sebagai password

---

### **TAHAP 2: Deploy Backend ke Railway** ⏱️ 10 menit

Setelah kode ter-upload ke GitHub:

#### **Step 1: Buka Railway**
- Pergi ke: https://railway.app/dashboard
- Login dengan akun Anda

#### **Step 2: Buat Service Baru**
1. Klik project Anda (yang sudah ada MySQL)
2. Klik **"+ New"** atau **"+ Add Service"**
3. Pilih **"GitHub Repo"**
4. Pilih **"nug31/mitragudang"**
5. Klik **"Deploy"**

#### **Step 3: Set Root Directory**
1. Klik service backend yang baru dibuat
2. Tab **"Settings"**
3. Cari **"Root Directory"**
4. Isi: `server`
5. Klik **"Save"**

#### **Step 4: Dapatkan Password MySQL**
1. Kembali ke dashboard project
2. Klik service **MySQL** (bukan backend)
3. Tab **"Variables"**
4. Cari `MYSQL_ROOT_PASSWORD` atau `MYSQLPASSWORD`
5. **Copy password** tersebut

#### **Step 5: Set Environment Variables**
1. Kembali ke service backend
2. Tab **"Variables"**
3. Tambahkan 9 variables berikut:

```
DB_HOST=mysql-production-628a.up.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=[paste password dari Step 4]
DB_NAME=railway
DB_SSL=false
PORT=3002
NODE_ENV=production
CORS_ORIGIN=https://gudang-mitra-app.netlify.app
```

#### **Step 6: Generate Domain**
1. Tab **"Settings"**
2. Bagian **"Domains"**
3. Klik **"Generate Domain"**
4. **COPY URL** yang muncul (contoh: `web-production-xxxx.up.railway.app`)
5. **SIMPAN URL INI!**

#### **Step 7: Tunggu Deployment**
1. Tab **"Deployments"**
2. Tunggu status menjadi **"Success"** (hijau)
3. Jika failed, cek logs untuk error

#### **Step 8: Test Backend**
Buka di browser:
```
https://[URL-ANDA].up.railway.app/health
```
Harus return: `{"status":"healthy"}`

---

### **TAHAP 3: Hubungkan Frontend dengan Backend** ⏱️ 5 menit

#### **Step 1: Update Konfigurasi**

Jalankan script:
```powershell
.\quick-fix-railway.ps1
```

Masukkan URL backend (dari Tahap 2, Step 6)

#### **Step 2: Build & Deploy**

Script akan otomatis:
- Update konfigurasi frontend
- Build aplikasi
- Deploy ke Netlify

Atau manual:
```bash
npm run build
netlify deploy --prod --dir=dist
```

#### **Step 3: Test Aplikasi**

1. Buka: https://gudang-mitra-app.netlify.app
2. Login dengan:
   - Email: `manager@gudangmitra.com`
   - Password: `password123`
3. Cek dashboard - harus menampilkan data real

---

## ✅ Checklist Lengkap

### Tahap 1 - GitHub:
- [ ] Git sudah terinstall
- [ ] Script push-to-github berhasil dijalankan
- [ ] Kode ter-upload di https://github.com/nug31/mitragudang

### Tahap 2 - Railway Backend:
- [ ] Service backend sudah dibuat
- [ ] Root directory = `server`
- [ ] Password MySQL sudah didapat
- [ ] 9 environment variables sudah di-set
- [ ] Domain sudah di-generate dan di-copy
- [ ] Deployment status = Success (hijau)
- [ ] Endpoint `/health` bisa diakses

### Tahap 3 - Frontend:
- [ ] Script quick-fix sudah dijalankan
- [ ] URL backend sudah benar
- [ ] Build berhasil
- [ ] Deploy ke Netlify berhasil
- [ ] Aplikasi bisa dibuka dan login berhasil

---

## 📚 Panduan Detail

Jika butuh panduan lebih detail:

- **SETUP-GITHUB.md** - Panduan lengkap upload ke GitHub
- **LANGKAH-MUDAH.md** - Panduan detail deploy Railway
- **DEPLOY-BACKEND-RAILWAY.md** - Troubleshooting Railway
- **PANDUAN-KONEKSI-RAILWAY.md** - Panduan koneksi lengkap

---

## 🆘 Troubleshooting Cepat

### **Problem: Git tidak terinstall**
**Solusi:** Download dari https://git-scm.com/download/win

### **Problem: Push ke GitHub gagal**
**Solusi:** Gunakan Personal Access Token sebagai password
- Buat di: https://github.com/settings/tokens
- Centang "repo"
- Copy token dan gunakan sebagai password

### **Problem: Railway deployment failed**
**Solusi:**
1. Cek root directory = `server`
2. Cek semua environment variables
3. Cek password MySQL benar
4. Lihat deployment logs untuk error detail

### **Problem: Frontend tidak connect**
**Solusi:**
1. Pastikan backend Railway sudah running
2. Test: `https://[backend-url]/health`
3. Jalankan ulang `quick-fix-railway.ps1`
4. Pastikan URL yang dimasukkan adalah backend, bukan MySQL

---

## 🎯 Quick Commands

```powershell
# 1. Push ke GitHub
.\push-to-github.ps1

# 2. Setelah deploy Railway, update frontend
.\quick-fix-railway.ps1

# 3. Check koneksi
node check-connection.js

# 4. Manual build & deploy
npm run build
netlify deploy --prod --dir=dist
```

---

## 📊 Arsitektur Final

```
USER
  ↓
FRONTEND (Netlify)
  ↓ API Calls
BACKEND (Railway) ← Deploy dari GitHub
  ↓ SQL Queries
MYSQL (Railway) ← Sudah ada
```

---

## 🎉 Hasil Akhir

Setelah selesai semua tahap:

✅ Kode ter-backup di GitHub
✅ Backend running di Railway
✅ Frontend terhubung dengan backend
✅ Backend terhubung dengan database
✅ Aplikasi fully functional!

**URL Aplikasi:** https://gudang-mitra-app.netlify.app

---

## 🚀 Mulai Sekarang!

**Langkah pertama:**
```powershell
.\push-to-github.ps1
```

Setelah itu ikuti Tahap 2 dan 3 di atas.

**Good luck! 🎊**

