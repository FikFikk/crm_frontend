# Mini CRM - Frontend

Proyek Vue.js untuk sistem CRM mini yang mengintegrasikan template Tinker.

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstall:

1. **Node.js** (versi 18 atau lebih baru)

   - Download dari: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)

2. **npm** (biasanya sudah termasuk dengan Node.js)

## Instalasi

1. Buka terminal/command prompt
2. Navigasi ke folder proyek:

   ```bash
   cd "c:\Project\mini-crm\crm-frontend"
   ```

3. Install dependensi:
   ```bash
   npm install
   ```

## Menjalankan Proyek

Untuk development:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## Fitur yang Sudah Diintegrasikan

### ✅ Halaman Login

- Path: `/login` atau `/`
- Komponen: `src/pages/Login.vue`
- Fitur:
  - Form login dengan email dan password
  - Remember me checkbox
  - Link forgot password
  - Redirect ke register
  - Loading state
  - Validasi form

### ✅ Halaman Register

- Path: `/register`
- Komponen: `src/pages/Register.vue`
- Fitur:
  - Form registrasi lengkap (nama depan, belakang, email, password)
  - Password strength indicator
  - Password confirmation
  - Checkbox persetujuan terms
  - Redirect ke login setelah sukses

### ✅ Layout Dashboard

- Komponen: `src/components/Layout/AppLayout.vue`
- Fitur:
  - Top navigation bar
  - Logout button
  - Container untuk konten

### ✅ Routing

- Vue Router dengan authentication guard
- Redirect otomatis berdasarkan status login
- Meta titles untuk setiap halaman

## Struktur Proyek

```
src/
├── components/
│   └── Layout/
│       └── AppLayout.vue      # Layout utama untuk halaman authenticated
├── pages/
│   ├── Login.vue              # Halaman login
│   ├── Register.vue           # Halaman register
│   └── Dashboard.vue          # Halaman dashboard
├── router/
│   └── index.ts               # Konfigurasi routing
├── App.vue                    # Root component
└── main.ts                    # Entry point aplikasi
```

## Styling

Proyek ini menggunakan CSS utility classes yang terinspirasi dari Tailwind CSS, diintegrasikan langsung ke dalam `App.vue` untuk memastikan kompatibilitas dengan template Tinker yang asli.

## Template Sumber

Template ini diadaptasi dari:

- **Tinker v2.0.1** - Tailwind HTML Admin Template
- Path sumber: `c:\Project\Template Web\Midone v4.0.5 Laravel\...\Source\`
- File yang diadaptasi:
  - `login-light-login.html`
  - `login-light-register.html`

## Development

### Menambah Halaman Baru

1. Buat file Vue component di `src/pages/`
2. Tambahkan route di `src/router/index.ts`
3. Jika memerlukan authentication, set `meta.requiresAuth: true`

### Customisasi Styling

Edit bagian `<style>` di `App.vue` untuk mengubah utility classes global, atau tambahkan styling khusus di masing-masing component.

## Catatan

- Authentication saat ini menggunakan localStorage sederhana
- Untuk production, implementasikan authentication yang lebih aman
- Template dirancang responsive dan mendukung dark mode toggle
- Semua animasi dan transisi dari template asli telah dipertahankan

## Build untuk Production

```bash
npm run build
```

File hasil build akan tersedia di folder `dist/`
