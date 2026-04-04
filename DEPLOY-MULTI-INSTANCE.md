# Panduan Deployment Multi-Instance (Gudang Mitra 02, 03, dst)

Sekarang Anda bisa menggunakan **satu repository GitHub saja** untuk men-deploy banyak situs Netlify (Gudang Mitra utama, 02, dan 03). Setiap kali Anda melakukan update pada repository utama, semua situs akan otomatis ikut terupdate.

## Langkah-langkah Deployment

### 1. Hubungkan Repository yang Sama ke Netlify
Saat mendepoy di Netlify, alih-alih membuat repo baru, hubungkan situs baru Anda ke repository utama (`mitragudang`).

### 2. Atur Environment Variable di Netlify
Setiap instance (Situs Netlify) membutuhkan variabel berikut agar memiliki nama yang berbeda dan terhubung ke database Supabase yang tepat.

Buka **Site configuration** > **Environment variables** di Dashboard Netlify masing-masing situs:

**Untuk Gudang Mitra 02:**
- `VITE_APP_NAME` = `Gudang Mitra 02`
- `DATABASE_URL` = `[URL_DATABASE_SUPABASE_02]`
- `SUPABASE_URL` = `[URL_PROJECT_SUPABASE_02]`
- `SUPABASE_ANON_KEY` = `[KEY_ANON_SUPABASE_02]`

**Untuk Gudang Mitra 03:**
- `VITE_APP_NAME` = `Gudang Mitra 03`
- `DATABASE_URL` = `[URL_DATABASE_SUPABASE_03]`
- `SUPABASE_URL` = `[URL_PROJECT_SUPABASE_03]`
- `SUPABASE_ANON_KEY` = `[KEY_ANON_SUPABASE_03]`

## Cara Memisahkan Database (PENTING)

Karena Anda menggunakan **Netlify Functions** (Backend menyatu dengan Frontend di Netlify), Anda tidak perlu deploy terpisah untuk backend. Cukup ikuti langkah ini untuk memisahkan data:

1. **Buat Project Supabase Baru**: Buat project baru di Supabase untuk Gudang Mitra 03.
2. **Copy Kredensial**: Ambil `DATABASE_URL` dan API Keys dari project Supabase baru tersebut.
3. **Masukkan ke Netlify 03**: Masukkan kredensial tersebut ke bagian **Environment variables** di situs Netlify Gudang Mitra 03.
4. **Deploy**: Klik **Clear cache and deploy site** di Netlify agar perubahan variabel lingkungan terbaca oleh backend (Functions).

### Keuntungan Metode Ini
- **Satu Dashboard**: Semua pengaturan backend (database connection) dan frontend (app name) ada di satu tempat (Netlify UI).
- **Tanpa Railway**: Anda menghemat biaya dan tenaga karena semuanya berjalan di ekosistem Netlify + Supabase.
- **Update Serentak**: Saat Anda push kode baru ke repo GitHub, semua situs (Utama, 02, 03) akan melakukan build ulang menggunakan database mereka masing-masing secara otomatis.

> [!TIP]
> Anda juga bisa membedakan URL Database (`VITE_API_URL` atau data Supabase) dengan cara yang sama jika ingin 02 dan 03 menggunakan database yang terpisah.

---
*Dibuat untuk membantu pengelolaan Gudang Mitra yang lebih efisien.*
