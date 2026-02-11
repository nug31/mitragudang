# 🚀 Deploy Backend ke Railway - Panduan Lengkap

## ⚠️ PENTING!

URL yang Anda berikan (`mysql-production-628a.up.railway.app`) adalah URL untuk **MySQL database**, bukan backend service.

Anda perlu **deploy backend service** terpisah yang akan:
- Menjalankan server Node.js/Express
- Terhubung ke MySQL database
- Menyediakan API untuk frontend

---

## 📋 Langkah-Langkah Deploy Backend

### **Cara 1: Deploy via Railway Dashboard (TERMUDAH)**

#### **Step 1: Buka Railway Dashboard**
1. Buka https://railway.app/dashboard
2. Login dengan akun Anda
3. Anda akan melihat project yang sudah ada (yang berisi MySQL database)

#### **Step 2: Tambah Service Baru untuk Backend**
1. **Klik project Anda** (yang sudah ada MySQL database)
2. **Klik tombol "+ New"** atau **"+ Add Service"**
3. **Pilih "GitHub Repo"**
4. **Pilih repository** `gudangmitra-main` (atau nama repo Anda)
5. **Klik "Deploy"**

#### **Step 3: Konfigurasi Backend Service**

Setelah service dibuat:

1. **Set Root Directory:**
   - Klik service backend yang baru dibuat
   - Klik tab **"Settings"**
   - Scroll ke **"Root Directory"**
   - Isi dengan: `server`
   - Klik **"Save"**

2. **Set Start Command (opsional):**
   - Masih di tab "Settings"
   - Scroll ke **"Start Command"**
   - Isi dengan: `node railway-server.js`
   - Klik **"Save"**

#### **Step 4: Set Environment Variables**

1. **Klik tab "Variables"**
2. **Klik "New Variable"** untuk setiap variable berikut:

```env
DB_HOST=mysql-production-628a.up.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=[password-mysql-anda]
DB_NAME=railway
DB_SSL=false
PORT=3002
NODE_ENV=production
CORS_ORIGIN=https://gudang-mitra-app.netlify.app
```

**PENTING:** 
- Ganti `[password-mysql-anda]` dengan password MySQL yang sebenarnya
- Untuk mendapatkan password MySQL:
  1. Klik service MySQL di Railway
  2. Klik tab "Variables"
  3. Cari variable `MYSQL_ROOT_PASSWORD` atau `MYSQLPASSWORD`
  4. Copy password tersebut

#### **Step 5: Generate Domain**

1. Masih di service backend
2. Klik tab **"Settings"**
3. Scroll ke bagian **"Domains"**
4. Klik **"Generate Domain"**
5. **Copy URL** yang muncul (contoh: `gudangmitra-backend-production.up.railway.app`)
6. **SIMPAN URL INI** - Anda akan membutuhkannya!

#### **Step 6: Tunggu Deployment Selesai**

1. Klik tab **"Deployments"**
2. Tunggu sampai status menjadi **"Success"** (hijau)
3. Jika ada error, klik deployment untuk melihat logs

#### **Step 7: Test Backend**

Buka di browser:
```
https://[URL-BACKEND-ANDA].up.railway.app/health
```

Seharusnya return:
```json
{"status":"healthy"}
```

Atau:
```
https://[URL-BACKEND-ANDA].up.railway.app/api/test-connection
```

Seharusnya return:
```json
{"success":true,"message":"Database connection successful"}
```

---

### **Cara 2: Deploy via Railway CLI**

Jika Anda lebih suka menggunakan command line:

#### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **Step 2: Login**
```bash
railway login
```

#### **Step 3: Link ke Project**
```bash
cd server
railway link
```
Pilih project yang sudah ada (yang berisi MySQL)

#### **Step 4: Set Environment Variables**
```bash
railway variables set DB_HOST=mysql-production-628a.up.railway.app
railway variables set DB_PORT=3306
railway variables set DB_USER=root
railway variables set DB_PASSWORD=[password-anda]
railway variables set DB_NAME=railway
railway variables set DB_SSL=false
railway variables set PORT=3002
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://gudang-mitra-app.netlify.app
```

#### **Step 5: Deploy**
```bash
railway up
```

#### **Step 6: Generate Domain**
```bash
railway domain
```

---

## 🔍 Cara Mendapatkan Password MySQL

### **Opsi 1: Via Railway Dashboard**
1. Buka Railway dashboard
2. Klik service **MySQL** (bukan backend)
3. Klik tab **"Variables"**
4. Cari variable:
   - `MYSQL_ROOT_PASSWORD` atau
   - `MYSQLPASSWORD` atau
   - `DB_PASSWORD`
5. Copy password tersebut

### **Opsi 2: Via Railway CLI**
```bash
railway variables
```
Cari password MySQL di output

---

## 📊 Struktur Project Railway Anda

Setelah selesai, project Railway Anda akan punya 2 services:

```
Project: gudangmitra-production
├── MySQL Database Service
│   └── URL: mysql-production-628a.up.railway.app:3306
│   └── Variables: MYSQL_ROOT_PASSWORD, dll
│
└── Backend Service (Node.js)
    └── URL: [generated-url].up.railway.app
    └── Variables: DB_HOST, DB_PORT, dll
    └── Root Directory: server
```

---

## ✅ Checklist Deployment

- [ ] Service backend sudah dibuat di Railway
- [ ] Root directory di-set ke `server`
- [ ] Semua 9 environment variables sudah di-set
- [ ] Password MySQL sudah benar
- [ ] Domain sudah di-generate
- [ ] Deployment status = Success (hijau)
- [ ] Endpoint `/health` bisa diakses
- [ ] Endpoint `/api/test-connection` return success

---

## 🎯 Setelah Backend Deploy

Setelah backend berhasil di-deploy dan Anda punya URL backend:

1. **Jalankan script quick-fix:**
   ```powershell
   .\quick-fix-railway.ps1
   ```

2. **Masukkan URL backend** (bukan URL MySQL!)
   ```
   [generated-url].up.railway.app
   ```

3. **Build dan deploy frontend:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

4. **Test aplikasi:**
   ```
   https://gudang-mitra-app.netlify.app
   ```

---

## 🆘 Troubleshooting

### **Error: "Application failed to respond"**
- Backend belum selesai deploy
- Root directory salah (harus `server`)
- Start command salah
- Environment variables belum di-set

**Solusi:** Cek deployment logs di Railway

### **Error: "Database connection failed"**
- Password MySQL salah
- DB_HOST salah (harus URL MySQL, bukan backend)
- DB_PORT salah (harus 3306 untuk MySQL)

**Solusi:** Cek environment variables, pastikan password benar

### **Error: "CORS error"**
- CORS_ORIGIN tidak include Netlify URL

**Solusi:** Set `CORS_ORIGIN=https://gudang-mitra-app.netlify.app`

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:

1. **Screenshot deployment logs** dari Railway
2. **Screenshot environment variables** (sembunyikan password)
3. **Copy error message** yang muncul

---

## 🎉 Hasil Akhir

Setelah selesai:

✅ **MySQL Database** di Railway (sudah ada)
✅ **Backend Service** di Railway (baru dibuat)
✅ **Frontend** di Netlify (sudah ada, tinggal update URL)
✅ Semua terhubung dan berfungsi!

**Selamat! Aplikasi Anda akan fully functional! 🚀**

