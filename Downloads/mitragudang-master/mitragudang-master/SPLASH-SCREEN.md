# 🎬 Netflix-Style Splash Screen

## ✨ Fitur Baru

Aplikasi Gudang Mitra sekarang memiliki **splash screen animasi** yang muncul saat pertama kali membuka aplikasi, mirip dengan Netflix!

## 🎨 Desain

- **Logo Gudang Mitra** dengan animasi scale-in dan glow effect
- **Warehouse Background** dengan grid pattern dan floating icons (Package, Box, Boxes)
- **Gradient background** dengan animated particles
- **Progress bar** dengan gradient warna (slower animation - 4 seconds)
- **Smooth fade-in/fade-out** transitions
- **Responsive design** untuk semua ukuran layar
- **Floating warehouse icons** dengan animasi yang berbeda-beda

## 🚀 Cara Kerja

1. **Pertama kali buka aplikasi** → Splash screen muncul selama ~4 detik (slower, more cinematic)
2. **Refresh halaman** → Splash screen tidak muncul lagi (disimpan di session storage)
3. **Buka tab baru** → Splash screen muncul lagi
4. **Background warehouse** → Grid pattern + floating icons (Package, Box, Boxes) dengan animasi float

## 🧪 Testing

Untuk selalu menampilkan splash screen (testing mode):

```
http://localhost:5173/?splash=true
```

Atau di production:

```
https://gudang-mitra-app.netlify.app/?splash=true
```

## 📁 File yang Ditambahkan/Diubah

### Baru:
- `src/components/ui/SplashScreen.tsx` - Komponen splash screen

### Diubah:
- `src/App.tsx` - Integrasi splash screen
- `src/index.css` - Animasi CSS (fade-in-up, scale-in, shimmer, dll)

## 🎯 Konfigurasi

Durasi splash screen dapat diubah di `src/components/ui/SplashScreen.tsx`:

```tsx
const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 4000 // Ubah durasi di sini (dalam ms) - default 4 detik
}) => {
  // ...

  // Progress speed
  const progressInterval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) return 100;
      return prev + 1; // Ubah increment untuk kecepatan progress (1 = slow, 2 = fast)
    });
  }, 50); // Ubah interval untuk smoothness (50ms = smooth, 30ms = faster)
}
```

## 🎨 Customization

### Mengubah Warna
Edit di `src/components/ui/SplashScreen.tsx`:

```tsx
// Background gradient
className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900"

// Progress bar
className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400"
```

### Mengubah Logo
Ganti icon `Warehouse` dengan icon lain dari `lucide-react`:

```tsx
import { YourIcon } from 'lucide-react';

<YourIcon className="w-24 h-24 text-white" />
```

### Mengubah Animasi
Edit keyframes di `src/index.css`:

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 🎭 Animasi yang Tersedia

- `animate-fade-in-up` - Fade in dengan slide dari bawah
- `animate-fade-out` - Fade out
- `animate-scale-in` - Scale in dengan bounce effect
- `animate-pulse-slow` - Pulse lambat untuk background
- `animate-shimmer` - Shimmer effect untuk progress bar

## 💡 Tips

1. **Disable splash screen** untuk development:
   - Hapus `?splash=true` dari URL
   - Atau comment out `<SplashScreen />` di `App.tsx`

2. **Ubah durasi** sesuai kebutuhan:
   - Terlalu cepat: User tidak sempat lihat
   - Terlalu lama: User bosan menunggu
   - **Current**: 4000ms (4 detik) - cinematic experience
   - **Rekomendasi**: 3000-5000ms untuk splash screen yang impressive

3. **Testing di berbagai device**:
   - Desktop: Animasi smooth
   - Mobile: Pastikan tidak lag
   - Tablet: Check responsive design

## 🐛 Troubleshooting

### Splash screen tidak muncul
- Clear session storage: `sessionStorage.clear()`
- Atau buka di incognito/private mode
- Atau tambahkan `?splash=true` ke URL

### Animasi patah-patah
- Check browser support untuk CSS animations
- Reduce animation complexity
- Test di browser lain

### Progress bar tidak smooth
- Adjust interval di `SplashScreen.tsx`:
  ```tsx
  setInterval(() => {
    setProgress((prev) => prev + 2); // Ubah increment
  }, 30); // Ubah interval
  ```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🎉 Enjoy!

Sekarang aplikasi Gudang Mitra punya splash screen yang keren seperti Netflix! 🚀

