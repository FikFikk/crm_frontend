# 🚀 Quick Start - Mini CRM

## ✅ Status Saat Ini:
- Node.js: **v22.19.0** ✓ 
- npm: **v10.9.3** ✓
- nvm: **v1.2.2** ✓
- Masalah: npm tidak bisa dijalankan di PowerShell pada direktori proyek

## 💡 Solusi Tercepat:

### **Option 1: Command Prompt (SANGAT DISARANKAN)**
1. **Tutup PowerShell**
2. **Buka Command Prompt (CMD)**
3. Jalankan:
   ```cmd
   cd "C:\Project\mini-crm\crm-frontend"
   start.bat
   ```

### **Option 2: Double-click**
1. Buka Windows Explorer
2. Navigate ke: `C:\Project\mini-crm\crm-frontend`
3. **Double-click file `start.bat`**

### **Option 3: Manual di CMD**
```cmd
cd "C:\Project\mini-crm\crm-frontend"
npm install
npm run dev
```

## � Yang Akan Terjadi:
- Install dependencies Vue.js
- Jalankan development server
- Aplikasi terbuka di: **http://localhost:5173**
- Login: `/login` atau `/`
- Register: `/register`

## � Template yang Sudah Diintegrasikan:

✅ **`login-light-login.html`** → **`src/pages/Login.vue`**
- Form email & password
- Remember me checkbox  
- Loading state
- Forgot password link
- Redirect ke register

✅ **`login-light-register.html`** → **`src/pages/Register.vue`**
- Form registrasi lengkap
- Password strength indicator (4 level)
- Password confirmation
- Terms checkbox
- Form validation

✅ **Fitur tambahan:**
- Vue Router dengan authentication guard
- Responsive design + smooth animations
- TypeScript support
- CSS utilities (Tailwind-style)

## 🔧 Troubleshooting:

**Jika tetap error:**
1. **Restart komputer** (kadang diperlukan setelah install Node.js)
2. **Install ulang Node.js** dari https://nodejs.org/ (pastikan centang "Add to PATH")
3. **Gunakan nvm** untuk manage versi Node.js

**Pesan Error Umum:**
- `'npm' is not recognized` → Gunakan CMD bukan PowerShell
- `Cannot find module` → Jalankan `npm install` dulu
- Port sudah digunakan → Vite akan auto-pilih port lain

## 🎉 **Coba Option 1 atau 2 - harusnya berhasil!**

Setelah berhasil, aplikasi Vue.js dengan template Tinker akan berjalan di browser! �
