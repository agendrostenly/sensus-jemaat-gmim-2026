# 📋 Formulir Sensus Jemaat GMIM 2026

Website dinamis untuk pengisian formulir sensus warga Gereja Masehi Injili di Minahasa (GMIM) Tahun 2026.

## ✨ Fitur Utama

### 📝 Informasi Keluarga
- Kolom (1-20)
- Nama Keluarga
- Nomor Kartu Keluarga (KK)
- Tanggal Nikah
- No. Surat Nikah
- Pendeta Peneguh Nikah
- Alamat Rumah Tinggal
- Penghasilan Bulanan

### 👨‍👩‍👧‍👦 Data Anggota Keluarga
- Form dinamis untuk 1-8 anggota keluarga
- NIK (16 digit)
- Nama Lengkap
- Jenis Kelamin
- Tempat & Tanggal Lahir
- Hubungan Keluarga
- Status Pernikahan
- Pekerjaan
- Golongan Darah
- Pendidikan Terakhir
- No. Telepon/WA

### ⛪ Data Baptis & SIDI
- Status Baptis (Y/N)
- No. Surat Baptis
- Tanggal & Pendeta Baptis
- Gereja/Jemaat Baptis
- Status SIDI (Y/N)
- No. Surat SIDI
- Tanggal & Pendeta SIDI
- Gereja/Jemaat SIDI
- Domisili & Keterangan

### 💾 Fitur Tambahan
- **Simpan** - Menyimpan data ke localStorage browser
- **Muat** - Memuat data yang tersimpan
- **Cetak** - Mencetak formulir (format landscape A4)
- **Reset** - Menghapus semua data

## 🛠️ Teknologi

- **Next.js 16** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Komponen UI berkualitas tinggi
- **Lucide React** - Icon library

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📦 Deployment ke Vercel

### Cara 1: Via GitHub (Rekomendasi)

1. Push project ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Klik "Add New..." → "Project"
4. Pilih repository
5. Klik "Deploy"

### Cara 2: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

📖 Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap.

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx          # Halaman utama
│   ├── layout.tsx        # Layout
│   └── globals.css       # Styles & print CSS
├── components/ui/        # UI Components (shadcn)
└── lib/                  # Utilities
```

## 🖨️ Print Support

Website mendukung pencetakan langsung ke format A4 Landscape:
- Header dengan logo GMIM
- Tabel data keluarga
- Tabel data anggota
- Tanda tangan

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

MIT License - GMIM 2026

---

Built with ❤️ for GMIM community
