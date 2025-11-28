# Testing Guide - Stock In/Out Feature

## Prerequisites
- Backend server running (railway-server.js)
- Frontend development server running (vite)
- Database connected dan tabel items sudah ada
- Beberapa items sudah terdaftar di database

## Manual Testing Steps

### Test 1: Access Stock Management Tab

**Steps:**
1. Login sebagai admin
2. Navigate ke "Inventory Management" page
3. Lihat ada 2 tab: "Inventory" dan "Stock In/Out"

**Expected Result:**
- ✅ Tab "Stock In/Out" visible dan clickable
- ✅ Icon arrows (up & down) ditampilkan
- ✅ Switching tab berfungsi

---

### Test 2: Load Available Items

**Steps:**
1. Buka tab "Stock In/Out"
2. Tunggu items ter-load

**Expected Result:**
- ✅ Loading spinner muncul sebentar
- ✅ Daftar items muncul dari database
- ✅ Setiap item menampilkan:
  - Item name
  - Description
  - Category
  - Current quantity (warna: hijau/kuning/merah)
  - Unit

---

### Test 3: Search Items

**Steps:**
1. Di "Select Item" section, ada search box
2. Type nama barang (contoh: "laptop")
3. Observe filtered results

**Expected Result:**
- ✅ List ter-filter real-time
- ✅ Search case-insensitive
- ✅ Search works untuk name dan category

---

### Test 4: Select Item

**Steps:**
1. Klik salah satu item dari list
2. Observe item card berubah

**Expected Result:**
- ✅ Item card highlight (blue border, blue background)
- ✅ Info item muncul di right panel:
  - Item name
  - Current quantity
  - Min quantity

---

### Test 5: Stock In Operation

**Steps:**
1. Select item dari list
2. Pastikan "In" button ter-highlight (green)
3. Input quantity: 5
4. (Optional) Add notes: "Pembelian supplier X"
5. Click "Record"
6. Wait for success message

**Expected Result:**
- ✅ Success alert muncul: "✅ Stock in recorded: +5 pcs of [ItemName]"
- ✅ Alert auto-hide setelah 5 detik
- ✅ Item quantity di list meningkat
- ✅ Form reset (quantity, notes kosong)
- ✅ Quantity di selected item updated

**Database Check:**
```sql
SELECT * FROM stock_tracking WHERE type = 'in' ORDER BY id DESC LIMIT 1;
-- Should show: new record dengan quantity=5, type='in'

SELECT quantity FROM items WHERE id = [selected_item_id];
-- Should show: previous_qty + 5
```

---

### Test 6: Stock Out Operation

**Steps:**
1. Select item dari list
2. Click "Out" button (red)
3. Input quantity: 2 (less than available)
4. (Optional) Add notes: "Pengeluaran dept IT"
5. Click "Record"
6. Wait for success message

**Expected Result:**
- ✅ Success alert muncul: "✅ Stock out recorded: -2 pcs of [ItemName]"
- ✅ Item quantity di list berkurang
- ✅ Form reset

**Database Check:**
```sql
SELECT * FROM stock_tracking WHERE type = 'out' ORDER BY id DESC LIMIT 1;
-- Should show: new record dengan quantity=2, type='out'

SELECT quantity FROM items WHERE id = [selected_item_id];
-- Should show: previous_qty - 2
```

---

### Test 7: Stock Out Validation (Insufficient Quantity)

**Steps:**
1. Select item dengan quantity rendah (contoh: 2 pcs)
2. Click "Out" button
3. Input quantity: 5 (lebih dari available)
4. Click "Record"

**Expected Result:**
- ❌ Error alert muncul: "Insufficient quantity. Available: 2, Requested: 5"
- ✅ Transaction NOT recorded
- ✅ Quantity di database tetap sama
- ✅ No entry di stock_tracking table

---

### Test 8: View Stock History

**Steps:**
1. Select item yang sudah punya transaksi
2. Click "View History" button
3. Modal muncul dengan history

**Expected Result:**
- ✅ Modal shows "Stock History - [ItemName]"
- ✅ History records ditampilkan:
  - Transaction type (warna: hijau untuk in, merah untuk out)
  - Quantity (+5 atau -2)
  - Unit (pcs, rim, box, dll)
  - Notes (jika ada)
  - Date & time

---

### Test 9: Refresh Items

**Steps:**
1. Click "Refresh" button
2. Observe loading

**Expected Result:**
- ✅ Items re-load dari API
- ✅ Latest quantities ditampilkan

---

### Test 10: Multiple Operations

**Steps:**
1. Do multiple stock in/out operations untuk item yang sama
2. View history
3. Check database

**Expected Result:**
- ✅ Semua transaksi tercatat
- ✅ Final quantity = initial - (sum of outs) + (sum of ins)
- ✅ Urutan history benar (newest first)

---

### Test 11: Notes & Unit Support

**Steps:**
1. Record stock operation dengan berbagai unit
2. Add descriptive notes
3. View history

**Expected Result:**
- ✅ Unit ditampilkan sesuai konfigurasi
- ✅ Notes tersimpan dan ditampilkan di history

---

## API Testing (Optional - using cURL/Postman)

### Test API: Get Available Items
```bash
curl http://localhost:3002/api/stock/available-items
```

Expected Response:
```json
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

### Test API: Record Stock In
```bash
curl -X POST http://localhost:3002/api/stock/in \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 10,
    "notes": "Pembelian supplier A",
    "unit": "pcs"
  }'
```

Expected Response:
```json
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
    "newQuantity": 15
  }
}
```

### Test API: Record Stock Out
```bash
curl -X POST http://localhost:3002/api/stock/out \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 2,
    "notes": "Pengeluaran dept IT",
    "unit": "pcs"
  }'
```

Expected Response:
```json
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
    "newQuantity": 13
  }
}
```

### Test API: Get Stock History
```bash
curl "http://localhost:3002/api/stock/history?itemId=1&limit=10"
```

Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "item_id": 1,
      "item_name": "Laptop",
      "type": "out",
      "quantity": 2,
      "unit": "pcs",
      "notes": "Pengeluaran dept IT",
      "created_by": null,
      "created_at": "2024-11-28 11:15:00"
    },
    {
      "id": 1,
      "item_id": 1,
      "item_name": "Laptop",
      "type": "in",
      "quantity": 10,
      "unit": "pcs",
      "notes": "Pembelian supplier A",
      "created_by": null,
      "created_at": "2024-11-28 10:30:00"
    }
  ],
  "total": 2
}
```

---

## Database Verification Queries

```sql
-- Check stock_tracking table exists
SHOW TABLES LIKE 'stock_tracking';

-- View all stock transactions
SELECT * FROM stock_tracking ORDER BY created_at DESC;

-- View transactions for specific item
SELECT * FROM stock_tracking WHERE item_id = 1 ORDER BY created_at DESC;

-- Get summary by item
SELECT 
  item_id, 
  item_name,
  SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) as total_in,
  SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) as total_out,
  COUNT(*) as total_transactions
FROM stock_tracking
GROUP BY item_id, item_name;

-- Verify item quantities are correct
SELECT id, name, quantity, minQuantity FROM items;
```

---

## Error Scenarios to Test

1. **Empty selection** → Click Record tanpa select item
   - Expected: Error message muncul

2. **Invalid quantity** → Input quantity 0 atau negative
   - Expected: Error message muncul

3. **Insufficient stock** → Stock out lebih dari available
   - Expected: Error message dengan available qty

4. **Network error** → Disconnect API saat recording
   - Expected: Error message, transaction not recorded

5. **Database error** → Stop database temporarily
   - Expected: API error response

---

## Performance Tests

- [ ] Load 100+ items dan search response time < 500ms
- [ ] Recording transaction response time < 1s
- [ ] History view dengan 1000+ records responsive

---

## Sign-off Checklist

- [ ] All basic tests passed
- [ ] API tests successful
- [ ] Database records correct
- [ ] Error handling works
- [ ] UI responsive on mobile
- [ ] No console errors
- [ ] Feature ready for production

---

**Test Date**: ________________
**Tester Name**: ________________
**Status**: ________________
