# Fitur Stock Management - Barang Masuk & Keluar

## Penjelasan Fitur

Fitur ini memungkinkan admin untuk mencatat dan melacak barang yang masuk (stock in) dan barang yang keluar (stock out) dari inventory. Admin dapat **menarik data barang langsung dari inventory yang sudah ada** tanpa perlu input ulang.

## Komponen yang Dibuat

### 1. Backend API Endpoints

File: `server/railway-server.js`

Ditambahkan endpoints baru:

- **GET `/api/stock/available-items`**
  - Mengambil semua barang yang tersedia di inventory
  - Menampilkan: ID, nama, deskripsi, kategori, qty saat ini, min qty, unit

- **GET `/api/stock/item/:id`**
  - Mengambil detail barang spesifik untuk operasi stock
  - Memperlihatkan info lengkap barang

- **POST `/api/stock/in`**
  - Mencatat barang masuk (stock in)
  - Body: `{ itemId, quantity, notes?, userId?, unit? }`
  - Update quantity otomatis

- **POST `/api/stock/out`**
  - Mencatat barang keluar (stock out)
  - Body: `{ itemId, quantity, notes?, userId?, unit? }`
  - Validasi stok tersedia

- **GET `/api/stock/history`**
  - Menampilkan history semua transaksi stock
  - Filter: itemId, type ('in' atau 'out')
  - Pagination: limit, offset

- **GET `/api/stock/summary`**
  - Summary data stock masuk/keluar per item
  - Menampilkan total transaksi

### 2. Database Schema

Tabel baru yang dibuat otomatis:

```sql
CREATE TABLE stock_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id INT NOT NULL,
  item_name VARCHAR(255),
  type ENUM('in', 'out') NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(50),
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_item_id (item_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
)
```

### 3. Frontend Service

File: `src/services/stockService.ts`

```typescript
- getAvailableItems()              // Tarik data barang dari inventory
- getItemDetails(itemId)           // Detail barang spesifik
- recordStockIn(operation)         // Catat barang masuk
- recordStockOut(operation)        // Catat barang keluar
- getStockHistory(filters)         // Lihat history transaksi
- getStockSummary()                // Ringkasan per barang
```

### 4. Frontend Component

File: `src/components/inventory/StockManagement.tsx`

UI dengan fitur:
- **Item Selection**: Cari dan pilih barang dari inventory yang sudah ada
- **Operation Type**: Pilih Barang Masuk atau Barang Keluar
- **Quantity Input**: Input jumlah barang (dalam unit yang sesuai)
- **Notes**: Tambah catatan opsional
- **History View**: Lihat history transaksi barang yang dipilih
- **Real-time Update**: Quantity barang otomatis ter-update

### 5. Integration ke Inventory Page

File: `src/pages/InventoryPage.tsx`

Ditambahkan:
- Tab navigation: "Inventory" dan "Stock In/Out"
- Icon untuk Stock In/Out: `<ArrowUpCircle />` dan `<ArrowDownCircle />`
- Import StockManagement component

## Cara Penggunaan

### Untuk Admin - Mencatat Barang Masuk:

1. Buka **Inventory Management** page
2. Klik tab **"Stock In/Out"**
3. Di section "Select Item", cari barang yang ingin dicatat
4. Klik barang untuk memilihnya
5. Pastikan tombol "In" terpilih (warna hijau)
6. Input jumlah barang
7. (Opsional) Tambah catatan
8. Klik **"Record"**
9. Lihat history dengan klik **"View History"**

### Untuk Admin - Mencatat Barang Keluar:

1. Buka **Inventory Management** page
2. Klik tab **"Stock In/Out"**
3. Di section "Select Item", cari barang yang ingin dicatat
4. Klik barang untuk memilihnya
5. Klik tombol "Out" (warna merah)
6. Input jumlah barang
7. (Opsional) Tambah catatan
8. Klik **"Record"**
9. Validasi otomatis: sistem cek apakah stok cukup
10. Lihat history dengan klik **"View History"**

## Fitur Utama

✅ **Pull Data dari Inventory**
- Admin tidak perlu input barang manual
- Data otomatis ditarik dari master inventory
- Sinkronisasi quantity real-time

✅ **Validasi Stok**
- Sistem cek qty tersedia sebelum stock out
- Prevent negative stock
- Alert jika stok tidak cukup

✅ **History Tracking**
- Setiap transaksi dicatat dengan timestamp
- Terlihat siapa yang input (created_by)
- Catatan untuk setiap transaksi

✅ **Unit Support**
- Support berbagai unit: pcs, rim, box, pack, dll
- Unit ditampilkan sesuai dengan konfigurasi barang

✅ **Search & Filter**
- Search barang by name atau category
- Filter history by type (in/out)
- Summary report per item

## Flow Diagram

```
┌─────────────────────────────────────────┐
│  Admin buka Inventory Management Page   │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
    Inventory      Stock In/Out
    (Tab 1)          (Tab 2)
       │                │
       │        ┌───────┴──────────┐
       │        │                  │
       │     Select Item ──► Qty Input
       │     (Pull dari       (Barang
       │      inventory)      Masuk/Keluar)
       │        │                  │
       │        │          ┌───────┴──────┐
       │        │          │              │
       │        │       Validasi       Success!
       │        │          │              │
       │        └──────────┴──────────────┤
       │                                  │
       └──────────────────┬───────────────┘
                          │
                   ┌──────┴──────────┐
                   │                 │
                History View    Updated Qty
                   │                 │
              (stock_tracking)  (items table)
```

## API Call Examples

### 1. Get Available Items
```bash
GET /api/stock/available-items
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "Dell Latitude",
      "category": "Electronics",
      "currentQuantity": 5,
      "minQuantity": 2,
      "unit": "pcs",
      "status": "in-stock"
    }
  ]
}
```

### 2. Record Stock In
```bash
POST /api/stock/in
Body:
{
  "itemId": 1,
  "quantity": 10,
  "notes": "Pembelian dari supplier A",
  "userId": 2,
  "unit": "pcs"
}

Response:
{
  "success": true,
  "message": "Stock in recorded successfully",
  "data": {
    "id": 1,
    "itemId": 1,
    "itemName": "Laptop",
    "type": "in",
    "quantity": 10,
    "previousQuantity": 5,
    "newQuantity": 15,
    "timestamp": "2024-11-28T10:30:00Z"
  }
}
```

### 3. Record Stock Out
```bash
POST /api/stock/out
Body:
{
  "itemId": 1,
  "quantity": 2,
  "notes": "Pengeluaran untuk dept. IT",
  "userId": 3,
  "unit": "pcs"
}

Response:
{
  "success": true,
  "message": "Stock out recorded successfully",
  "data": {
    "id": 2,
    "itemId": 1,
    "itemName": "Laptop",
    "type": "out",
    "quantity": 2,
    "previousQuantity": 15,
    "newQuantity": 13,
    "timestamp": "2024-11-28T11:15:00Z"
  }
}
```

### 4. Get Stock History
```bash
GET /api/stock/history?itemId=1&type=in&limit=10&offset=0

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "item_id": 1,
      "item_name": "Laptop",
      "type": "in",
      "quantity": 10,
      "unit": "pcs",
      "notes": "Pembelian dari supplier A",
      "created_by": 2,
      "created_at": "2024-11-28 10:30:00"
    }
  ],
  "total": 1
}
```

## Testing Checklist

- [ ] Admin bisa buka tab Stock In/Out
- [ ] Available items ter-load dari inventory
- [ ] Search barang berfungsi
- [ ] Bisa select barang dari list
- [ ] Stock In: bisa input qty dan catat
- [ ] Stock Out: bisa input qty dan catat
- [ ] Stock Out: validasi qty tidak boleh melebihi available
- [ ] History view menampilkan transaksi
- [ ] Quantity di inventory ter-update otomatis
- [ ] Notes tersimpan dengan transaksi
- [ ] Multiple operations bisa dicatat

## Notes

- Fitur ini **menarik data langsung dari master inventory** - tidak perlu input ulang
- **Auto-update quantity** saat stock in/out dicatat
- **History tercatat permanent** di `stock_tracking` table
- **Validasi built-in** untuk mencegah negative stock
- Support untuk **multiple units** (pcs, rim, box, pack, etc)

---

**Status**: ✅ **Implemented** - Siap digunakan
**Last Updated**: 28 Nov 2024
