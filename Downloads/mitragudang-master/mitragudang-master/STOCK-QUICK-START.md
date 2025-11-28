# 🚀 Quick Start - Stock Management Feature

## Apa Itu Fitur Ini?

Admin bisa **tarik data barang dari inventory** saat input barang masuk/keluar, **tanpa perlu input ulang**.

Sebelumnya: Admin input nama, deskripsi, qty (manual) ❌
Sekarang: Admin pilih barang dari list, input qty (dari database) ✅

---

## 5 Menit Setup

### 1️⃣ Backend Ready?
```bash
cd server
npm start  # atau yarn start
```
✅ Server berjalan di port 3002
✅ Database terhubung
✅ Table `stock_tracking` auto-dibuat

### 2️⃣ Frontend Ready?
```bash
# Another terminal
npm run dev  # atau yarn dev
```
✅ Vite running
✅ React komponen ter-load

### 3️⃣ Buka Aplikasi
- Navigate ke: http://localhost:5173
- Login sebagai admin
- Buka: **Inventory Management**

---

## Cara Pakai (Super Cepat)

### 📦 Stock In (Barang Masuk)
```
1. Click tab "Stock In/Out"
2. Cari barang: "Laptop" (search box)
3. Click barang dari list
4. Pastikan tombol "In" hijau
5. Input qty: 5
6. Click "Record"
7. ✅ Done! Qty barang +5
```

### 📤 Stock Out (Barang Keluar)
```
1. Click tab "Stock In/Out"
2. Cari barang: "Laptop"
3. Click barang dari list
4. Click tombol "Out" merah
5. Input qty: 2
6. Click "Record"
7. ✅ Done! Qty barang -2
```

---

## Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 🔍 **Search** | Cari barang by name/category |
| 📋 **Auto-Pull** | Data barang dari inventory otomatis |
| 📊 **Qty Update** | Quantity update real-time |
| ⚠️ **Validasi** | Cegah stok negatif |
| 📜 **History** | Lihat semua transaksi barang |
| 📝 **Notes** | Tambah catatan untuk transaksi |

---

## Files Created/Modified

```
✅ NEW:
   src/services/stockService.ts
   src/components/inventory/StockManagement.tsx

✅ UPDATED:
   server/railway-server.js (+6 endpoints)
   src/pages/InventoryPage.tsx (+tab navigation)

📖 DOCS:
   STOCK-MANAGEMENT-FEATURE.md
   STOCK-TESTING-GUIDE.md
   STOCK-FEATURE-SUMMARY.md
```

---

## API Endpoints (Jika perlu test langsung)

```bash
# Get available items
curl http://localhost:3002/api/stock/available-items

# Record stock in
curl -X POST http://localhost:3002/api/stock/in \
  -H "Content-Type: application/json" \
  -d '{"itemId": 1, "quantity": 5}'

# Record stock out
curl -X POST http://localhost:3002/api/stock/out \
  -H "Content-Type: application/json" \
  -d '{"itemId": 1, "quantity": 2}'

# Get history
curl "http://localhost:3002/api/stock/history?itemId=1"
```

---

## Database Schema

Tabel baru otomatis dibuat:

```sql
stock_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id INT,
  item_name VARCHAR(255),
  type ENUM('in', 'out'),
  quantity INT,
  unit VARCHAR(50),
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP
)
```

---

## Troubleshooting

### ❌ Tab "Stock In/Out" tidak muncul?
- Refresh browser (Ctrl+R)
- Clear cache (Ctrl+Shift+Delete)
- Restart dev server

### ❌ Available items tidak keluar?
- Check database connection
- Ensure `items` table exist dengan data
- Check browser console for errors

### ❌ Stock out error "Insufficient quantity"?
- ✅ Normal! Qty tidak boleh melebihi available
- Kurangi quantity atau cek qty available terlebih dahulu

### ❌ Button "Record" tidak responsive?
- Pastikan sudah select item
- Pastikan quantity > 0
- Check console untuk errors

---

## Testing Checklist

- [ ] Bisa buka tab "Stock In/Out"
- [ ] Available items ter-load
- [ ] Search barang berfungsi
- [ ] Bisa select barang
- [ ] Stock in: qty ter-update (+)
- [ ] Stock out: qty ter-update (-)
- [ ] Stock out: validasi qty bekerja
- [ ] History modal berfungsi
- [ ] Notes tersimpan
- [ ] Refresh button berfungsi

---

## Key Info

✅ **Auto-Pull Data**: Barang ditarik dari `items` table
✅ **Real-time Update**: Qty langsung terupdate
✅ **Full History**: Semua transaksi dicatat di `stock_tracking`
✅ **Safe**: Validasi otomatis, tidak bisa negative stock

---

## Next Steps

1. ✅ **Test fitur** sesuai testing guide
2. ✅ **Check database** untuk verify data
3. ✅ **Report issues** jika ada
4. ✅ **Collect feedback** dari end-user

---

## Documentation

📖 **Detailed Guide**: `STOCK-MANAGEMENT-FEATURE.md`
🧪 **Testing Guide**: `STOCK-TESTING-GUIDE.md`
📋 **Full Summary**: `STOCK-FEATURE-SUMMARY.md`

---

## Questions?

Check the documentation files atau review code comments for more details.

**Status**: ✅ Ready to Use
**Date**: 28 Nov 2024
