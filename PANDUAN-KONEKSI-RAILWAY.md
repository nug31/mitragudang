# 🚀 Panduan Menghubungkan Frontend dengan Database Railway

## 📋 Ringkasan Masalah

Frontend Netlify belum terhubung dengan backend Railway karena:
1. Backend Railway mungkin belum di-deploy dengan benar
2. URL backend di frontend mungkin salah
3. Environment variables di Railway mungkin belum di-set

---

## ✅ Solusi Lengkap (3 Cara)

### **Cara 1: Menggunakan Script Otomatis (TERMUDAH)**

1. **Jalankan script setup:**
   ```cmd
   node connect-to-railway.js
   ```

2. **Ikuti instruksi di layar:**
   - Masukkan URL backend Railway Anda
   - Script akan otomatis update konfigurasi
   - Pilih untuk build dan deploy otomatis

3. **Selesai!** Script akan mengurus semuanya.

---

### **Cara 2: Manual Step-by-Step**

#### **Step 1: Deploy Backend ke Railway**

1. **Buka Railway Dashboard:**
   - Pergi ke https://railway.app/dashboard
   - Login dengan akun Anda

2. **Buat New Project (jika belum ada):**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `gudangmitra-main`

3. **Konfigurasi Service:**
   - Setelah project dibuat, klik service yang baru dibuat
   - Klik tab "Settings"
   - Scroll ke "Root Directory"
   - Set ke: `server`
   - Klik "Save"

4. **Set Environment Variables:**
   - Klik tab "Variables"
   - Tambahkan variable berikut (klik "New Variable" untuk setiap item):

   ```
   DB_HOST=nozomi.proxy.rlwy.net
   DB_PORT=21817
   DB_USER=root
   DB_PASSWORD=pvOcQbzlDAobtcdozbMvCdIDDEmenwkO
   DB_NAME=railway
   DB_SSL=false
   PORT=3002
   NODE_ENV=production
   CORS_ORIGIN=https://gudang-mitra-app.netlify.app
   ```

5. **Generate Domain:**
   - Klik tab "Settings"
   - Scroll ke bagian "Domains"
   - Klik "Generate Domain"
   - Copy URL yang di-generate (contoh: `gudangmitra-production.up.railway.app`)

6. **Redeploy:**
   - Klik tab "Deployments"
   - Klik "Deploy" atau tunggu auto-deploy selesai
   - Tunggu sampai status menjadi "Success" (hijau)

#### **Step 2: Test Backend Railway**

1. **Buka browser**
2. **Test endpoint health:**
   ```
   https://[URL-RAILWAY-ANDA].up.railway.app/health
   ```
   Seharusnya return: `{"status":"healthy"}` atau sejenisnya

3. **Test endpoint database:**
   ```
   https://[URL-RAILWAY-ANDA].up.railway.app/api/test-connection
   ```
   Seharusnya return: `{"success":true,"message":"Database connection successful"}`

#### **Step 3: Update Frontend Configuration**

1. **Update file `.env.production`:**
   ```env
   VITE_API_URL=https://[URL-RAILWAY-ANDA].up.railway.app/api
   ```
   
   Ganti `[URL-RAILWAY-ANDA]` dengan URL Railway yang Anda copy di Step 1.5

2. **Update file `netlify.toml`:**
   ```toml
   [build]
     command = "npm ci && npm run build"
     publish = "dist"
     
   [build.environment]
     NODE_VERSION = "18"
     NPM_FLAGS = "--production=false"
     VITE_API_URL = "https://[URL-RAILWAY-ANDA].up.railway.app/api"
     
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### **Step 4: Rebuild dan Redeploy Frontend**

1. **Build aplikasi:**
   ```cmd
   npm run build
   ```

2. **Deploy ke Netlify:**
   ```cmd
   netlify deploy --prod --dir=dist
   ```

3. **Atau deploy via Netlify Dashboard:**
   - Buka https://app.netlify.com
   - Pilih site "gudang-mitra-app"
   - Klik "Deploys"
   - Klik "Trigger deploy" → "Deploy site"

#### **Step 5: Test Aplikasi**

1. **Buka aplikasi:**
   ```
   https://gudang-mitra-app.netlify.app
   ```

2. **Login dengan akun test:**
   - **Manager:**
     - Email: `manager@gudangmitra.com`
     - Password: `password123`
   
   - **User:**
     - Email: `bob@gudangmitra.com`
     - Password: `password123`

3. **Cek fitur-fitur:**
   - Dashboard harus menampilkan data real dari database
   - Inventory harus menampilkan items
   - Request system harus berfungsi

---

### **Cara 3: Deploy Backend Lokal Dulu (Untuk Testing)**

Jika Railway belum siap, Anda bisa test dengan backend lokal:

1. **Jalankan backend lokal:**
   ```cmd
   cd server
   node railway-server.js
   ```

2. **Update frontend untuk development:**
   - Buat file `.env.local`:
     ```env
     VITE_API_URL=http://localhost:3002/api
     ```

3. **Jalankan frontend:**
   ```cmd
   npm run dev
   ```

4. **Test di browser:**
   ```
   http://localhost:5173
   ```

---

## 🔍 Troubleshooting

### **Problem 1: Backend Railway tidak bisa diakses**

**Solusi:**
1. Cek deployment logs di Railway
2. Pastikan root directory di-set ke `server`
3. Pastikan semua environment variables sudah benar
4. Pastikan domain sudah di-generate
5. Tunggu beberapa menit setelah deploy

### **Problem 2: Frontend tidak bisa connect ke backend**

**Solusi:**
1. Cek URL di `.env.production` dan `netlify.toml`
2. Pastikan URL Railway benar (tanpa trailing slash)
3. Cek CORS settings di backend (harus include Netlify URL)
4. Cek browser console untuk error messages
5. Test backend endpoint langsung di browser

### **Problem 3: Database connection error**

**Solusi:**
1. Cek environment variables di Railway:
   - `DB_HOST=nozomi.proxy.rlwy.net`
   - `DB_PORT=21817`
   - `DB_USER=root`
   - `DB_PASSWORD=pvOcQbzlDAobtcdozbMvCdIDDEmenwkO`
   - `DB_NAME=railway`
2. Test koneksi database dengan script:
   ```cmd
   cd server
   node check-railway-db.cjs
   ```

### **Problem 4: Login tidak berhasil**

**Solusi:**
1. Pastikan database sudah ada data users
2. Jalankan script setup database:
   ```cmd
   cd server
   node setup-railway-tables.js
   ```
3. Cek password di database (harus ter-hash dengan bcrypt)

---

## 📊 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         FRONTEND (Netlify)                              │
│   https://gudang-mitra-app.netlify.app                  │
│   - React + TypeScript + Vite                           │
│   - Tailwind CSS + 3D Effects                           │
└────────────────────┬────────────────────────────────────┘
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│         BACKEND (Railway)                               │
│   https://[your-url].up.railway.app                     │
│   - Node.js + Express                                   │
│   - REST API Endpoints                                  │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
                     ▼
┌─────────────────────────────────────────────────────────┐
│         DATABASE (Railway MySQL)                        │
│   nozomi.proxy.rlwy.net:21817                          │
│   - MySQL Database                                      │
│   - Tables: users, items, requests, etc.                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Checklist Deployment

Gunakan checklist ini untuk memastikan semua sudah benar:

### **Backend Railway:**
- [ ] Project Railway sudah dibuat
- [ ] Repository GitHub sudah terhubung
- [ ] Root directory di-set ke `server`
- [ ] Semua environment variables sudah di-set (9 variables)
- [ ] Domain sudah di-generate
- [ ] Deployment status: Success (hijau)
- [ ] Endpoint `/health` bisa diakses
- [ ] Endpoint `/api/test-connection` return success

### **Frontend Netlify:**
- [ ] File `.env.production` sudah diupdate dengan URL Railway
- [ ] File `netlify.toml` sudah diupdate dengan URL Railway
- [ ] Build berhasil tanpa error
- [ ] Deploy ke Netlify berhasil
- [ ] Site bisa diakses di https://gudang-mitra-app.netlify.app

### **Testing:**
- [ ] Login berhasil dengan akun manager
- [ ] Dashboard menampilkan data real
- [ ] Inventory menampilkan items dari database
- [ ] Request system berfungsi
- [ ] User management berfungsi (untuk admin)

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah, cek:

1. **Railway Logs:**
   - Buka Railway dashboard
   - Klik service backend
   - Klik tab "Deployments"
   - Klik deployment terakhir
   - Lihat "Build Logs" dan "Deploy Logs"

2. **Netlify Logs:**
   - Buka https://app.netlify.com
   - Pilih site Anda
   - Klik "Deploys"
   - Klik deployment terakhir
   - Lihat "Deploy log"

3. **Browser Console:**
   - Buka aplikasi di browser
   - Tekan F12
   - Lihat tab "Console" untuk error messages
   - Lihat tab "Network" untuk failed requests

---

## ✅ Kesimpulan

Setelah mengikuti panduan ini, aplikasi Anda akan:

✅ **Frontend** di Netlify terhubung dengan **Backend** di Railway
✅ **Backend** di Railway terhubung dengan **Database** Railway MySQL
✅ Semua fitur berfungsi dengan data real dari database
✅ Aplikasi siap digunakan secara production

**Selamat! Aplikasi Gudang Mitra Anda sudah terhubung dengan Railway! 🎉**

