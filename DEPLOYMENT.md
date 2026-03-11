# 📋 Panduan Deployment ke Vercel

## Formulir Sensus Jemaat GMIM 2026

Website ini sudah siap untuk di-deploy ke Vercel. Ikuti langkah-langkah berikut:

---

## 🚀 Cara 1: Deploy via GitHub (Rekomendasi)

### Langkah 1: Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit - Sensus Jemaat GMIM 2026"

# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/sensus-jemaat-gmim.git

# Push ke GitHub
git push -u origin main
```

### Langkah 2: Deploy di Vercel

1. Buka **[vercel.com](https://vercel.com)** dan login dengan akun GitHub
2. Klik **"Add New..."** → **"Project"**
3. Pilih repository **"sensus-jemaat-gmim"** dari daftar
4. Vercel akan otomatis mendeteksi Next.js
5. Klik **"Deploy"**
6. Tunggu beberapa menit hingga selesai
7. Website akan live di `https://sensus-jemaat-gmim.vercel.app`

---

## ⚡ Cara 2: Deploy via Vercel CLI

### Langkah 1: Install Vercel CLI

```bash
# Menggunakan npm
npm install -g vercel

# Atau menggunakan bun
bun add -g vercel
```

### Langkah 2: Login ke Vercel

```bash
vercel login
```

Pilih login dengan:
- GitHub
- GitLab
- Bitbucket
- Email

### Langkah 3: Deploy

```bash
# Masuk ke folder project
cd /home/z/my-project

# Deploy ke production
vercel --prod
```

Ikuti instruksi di terminal:
1. Confirm deployment: **Y**
2. Link to existing project: **N** (untuk project baru)
3. Project name: **sensus-jemaat-gmim-2026** (atau nama lain)
4. Directory: **./** (tekan Enter)
5. Settings: Vercel akan otomatis detect Next.js

---

## 📁 Struktur Project

```
sensus-jemaat-gmim-2026/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Halaman utama
│   │   ├── layout.tsx        # Layout
│   │   └── globals.css       # Styles
│   └── components/ui/        # UI Components (shadcn)
├── public/                   # Static files
├── vercel.json               # Vercel config
├── next.config.ts            # Next.js config
└── package.json              # Dependencies
```

---

## 🔧 Konfigurasi

### Environment Variables (Opsional)
Tidak ada environment variable yang diperlukan untuk website ini karena menggunakan localStorage untuk menyimpan data.

Jika ingin menambahkan fitur database di kemudian hari, tambahkan di Vercel Dashboard:
1. Buka Project → Settings → Environment Variables
2. Tambahkan variabel yang diperlukan

### Custom Domain
Untuk menggunakan domain sendiri:
1. Buka Project → Settings → Domains
2. Tambahkan domain (misal: `sensus.gmim.org`)
3. Update DNS sesuai instruksi Vercel

---

## ✅ Checklist Sebelum Deploy

- [x] Build berhasil (`npm run build`)
- [x] Tidak ada error TypeScript
- [x] Tidak ada error ESLint
- [x] `vercel.json` sudah dikonfigurasi
- [x] `.gitignore` sudah benar

---

## 🔗 URL Setelah Deploy

Website akan tersedia di:
- **Default**: `https://sensus-jemaat-gmim-2026.vercel.app`
- **Custom Domain**: `https://domain-anda.com` (jika dikonfigurasi)

---

## 📞 Bantuan

Jika mengalami masalah:
1. Cek log di Vercel Dashboard → Deployments → klik deployment → Logs
2. Pastikan `npm run build` berhasil di lokal
3. Hubungi support Vercel: **[vercel.com/support](https://vercel.com/support)**
