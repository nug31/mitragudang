# 📤 Upload Kode ke GitHub Tanpa Git

## ⚠️ Situasi: Git Belum Terinstall

Anda punya beberapa opsi untuk upload kode ke GitHub tanpa install Git.

---

## 🎯 **Opsi 1: Install Git (PALING MUDAH & RECOMMENDED)**

### **Langkah Cepat:**

1. **Jalankan script installer:**
   ```powershell
   .\install-git.ps1
   ```
   Script akan membuka halaman download Git

2. **Download Git:**
   - Klik download (biasanya "64-bit Git for Windows Setup")
   - Tunggu download selesai

3. **Install Git:**
   - Jalankan installer yang sudah di-download
   - Klik **Next, Next, Next** (gunakan setting default)
   - Tunggu sampai selesai

4. **Restart PowerShell:**
   - Tutup PowerShell yang sekarang
   - Buka PowerShell baru di folder project

5. **Push ke GitHub:**
   ```powershell
   .\push-to-github.ps1
   ```

**Waktu:** ~5 menit

---

## 🖥️ **Opsi 2: Gunakan GitHub Desktop (PALING GAMPANG)**

### **Langkah-langkah:**

1. **Download GitHub Desktop:**
   - Buka: https://desktop.github.com/
   - Klik "Download for Windows"
   - Tunggu download selesai

2. **Install GitHub Desktop:**
   - Jalankan installer
   - Klik Next sampai selesai

3. **Login ke GitHub:**
   - Buka GitHub Desktop
   - Klik "Sign in to GitHub.com"
   - Login dengan username: `nug31`
   - Authorize aplikasi

4. **Add Repository:**
   - Klik **File** → **Add Local Repository**
   - Klik **Choose...**
   - Pilih folder: `C:\Users\User\Desktop\gudangmitra-main`
   - Klik **Add Repository**

5. **Publish ke GitHub:**
   - Klik **Publish repository**
   - Repository name: `mitragudang`
   - Uncheck "Keep this code private" (jika ingin public)
   - Klik **Publish repository**

6. **Selesai!**
   - Verify di: https://github.com/nug31/mitragudang

**Waktu:** ~10 menit

---

## 🌐 **Opsi 3: Upload Manual via GitHub Web**

### **Langkah-langkah:**

1. **Buka Repository:**
   - Pergi ke: https://github.com/nug31/mitragudang
   - Login jika belum

2. **Upload Folder Server:**
   - Klik **Add file** → **Upload files**
   - Buka Windows Explorer
   - Pergi ke folder project: `C:\Users\User\Desktop\gudangmitra-main`
   - **Drag & drop folder `server`** ke halaman GitHub
   - Tunggu upload selesai
   - Scroll ke bawah
   - Commit message: "Upload server folder"
   - Klik **Commit changes**

3. **Upload File-file Root:**
   - Klik **Add file** → **Upload files** lagi
   - Drag & drop file-file berikut:
     - `package.json`
     - `package-lock.json`
     - `vite.config.ts`
     - `tsconfig.json`
     - `tsconfig.app.json`
     - `tsconfig.node.json`
     - `tailwind.config.js`
     - `postcss.config.js`
     - `eslint.config.js`
     - `index.html`
     - `netlify.toml`
     - `railway.toml`
     - `.env.production`
   - Commit message: "Upload config files"
   - Klik **Commit changes**

4. **Upload Folder src:**
   - Klik **Add file** → **Upload files** lagi
   - Drag & drop folder `src`
   - Commit message: "Upload src folder"
   - Klik **Commit changes**

5. **Upload Folder public:**
   - Klik **Add file** → **Upload files** lagi
   - Drag & drop folder `public`
   - Commit message: "Upload public folder"
   - Klik **Commit changes**

6. **Buat .gitignore:**
   - Klik **Add file** → **Create new file**
   - Filename: `.gitignore`
   - Isi dengan:
     ```
     node_modules/
     dist/
     .env
     .env.local
     *.log
     ```
   - Klik **Commit changes**

**CATATAN:** 
- ❌ **JANGAN upload folder `node_modules`** (terlalu besar)
- ❌ **JANGAN upload folder `dist`** (hasil build)

**Waktu:** ~15-20 menit

---

## 📦 **Opsi 4: Compress & Upload ZIP**

### **Langkah-langkah:**

1. **Hapus folder yang tidak perlu:**
   - Buka folder project
   - **Hapus folder `node_modules`** (jika ada)
   - **Hapus folder `dist`** (jika ada)

2. **Compress ke ZIP:**
   - Select semua file dan folder yang tersisa
   - Klik kanan → **Send to** → **Compressed (zipped) folder**
   - Nama: `gudangmitra.zip`

3. **Extract di tempat lain:**
   - Buat folder baru: `C:\Users\User\Desktop\gudangmitra-upload`
   - Extract ZIP ke folder tersebut

4. **Upload via GitHub Desktop:**
   - Ikuti Opsi 2 di atas
   - Tapi gunakan folder `gudangmitra-upload`

**Waktu:** ~10 menit

---

## 🚀 **Rekomendasi Saya**

Berdasarkan kemudahan dan kecepatan:

### **Untuk Pemula:**
✅ **Opsi 2: GitHub Desktop** (Paling mudah, GUI friendly)

### **Untuk Jangka Panjang:**
✅ **Opsi 1: Install Git** (Paling powerful, bisa pakai script otomatis)

### **Jika Terburu-buru:**
⚠️ **Opsi 3: Upload Manual** (Tidak recommended, tapi bisa)

---

## 📋 **Checklist Upload**

Pastikan file-file ini ter-upload:

### **Folder Penting:**
- [ ] `server/` (folder backend)
- [ ] `src/` (folder frontend source)
- [ ] `public/` (folder assets)

### **File Config:**
- [ ] `package.json`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.js`
- [ ] `index.html`
- [ ] `netlify.toml`
- [ ] `railway.toml`
- [ ] `.gitignore`

### **JANGAN Upload:**
- [ ] ❌ `node_modules/`
- [ ] ❌ `dist/`
- [ ] ❌ `.env.local`

---

## ✅ **Verify Upload**

Setelah upload, cek di GitHub:

1. **Buka:** https://github.com/nug31/mitragudang

2. **Pastikan ada:**
   - Folder `server`
   - Folder `src`
   - Folder `public`
   - File `package.json`
   - File `railway.toml`

3. **Jika semua ada:**
   - ✅ Upload berhasil!
   - Lanjut ke deploy Railway

---

## 🎯 **Setelah Upload Berhasil**

Langkah selanjutnya:

1. **Deploy Backend ke Railway:**
   - Buka: https://railway.app/dashboard
   - New Project → Deploy from GitHub repo
   - Pilih: `nug31/mitragudang`
   - Ikuti panduan: **LANGKAH-MUDAH.md**

2. **Update Frontend:**
   ```powershell
   .\quick-fix-railway.ps1
   ```

3. **Test Aplikasi:**
   - https://gudang-mitra-app.netlify.app

---

## 🆘 **Butuh Bantuan?**

Jika ada masalah:

1. **Opsi 1 atau 2 tidak bisa:**
   - Gunakan Opsi 3 (upload manual)

2. **Upload manual terlalu lama:**
   - Install GitHub Desktop (Opsi 2)

3. **Semua opsi gagal:**
   - Screenshot error
   - Cek koneksi internet

---

## 💡 **Tips**

1. **Koneksi Internet:**
   - Pastikan koneksi stabil
   - Upload bisa memakan waktu 5-15 menit

2. **File Size:**
   - Jangan upload `node_modules` (terlalu besar)
   - GitHub punya limit 100MB per file

3. **Backup:**
   - Sebelum upload, backup folder project
   - Copy ke tempat lain untuk jaga-jaga

---

**Pilih opsi yang paling cocok untuk Anda dan mulai upload! 🚀**

