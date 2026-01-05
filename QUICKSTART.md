# 🚀 Quick Start Guide - IkuHub Proyeksi

## Untuk Developer Baru

### 1️⃣ Clone & Install (5 menit)

```bash
# Clone repository
git clone https://github.com/your-org/ikuhub-proyeksi.git
cd ikuhub-proyeksi

# Install dependencies
npm install

# Start development server
npm run dev
```

**✅ Akses:** http://localhost:5173  
**🔑 Login:** email apapun + password `Ikuhub@2025`

> ℹ️ Mode default adalah **Demo Mode** - data disimpan di browser localStorage

---

## Untuk Testing Production Mode (15 menit)

### 2️⃣ Setup Backend Local

```bash
# Masuk ke folder backend
cd backend-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env - update dengan MySQL credentials Anda
nano .env
```

**Isi `.env`:**
```env
PORT=3000
DATABASE_URL=mysql://root:password@localhost:3306/ikuhub_proyeksi
JWT_SECRET=your-random-64-char-secret-here
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Setup database:**
```bash
# Buat database (jalankan di MySQL)
mysql -u root -p
CREATE DATABASE ikuhub_proyeksi;
EXIT;

# Run migrations
npm run migrate

# Start backend server
npm run dev
```

**✅ Backend running di:** http://localhost:3000

### 3️⃣ Connect Frontend ke Backend

```bash
# Kembali ke root folder
cd ..

# Buat .env
echo "VITE_API_BASE_URL=http://localhost:3000" > .env
echo "VITE_APP_MODE=production" >> .env

# Restart frontend
npm run dev
```

**🎉 Sekarang data tersimpan di database MySQL!**

**Test:**
1. Login dengan: `admin@ikuhub.com` / `Ikuhub@2025`
2. Buat proyek baru
3. Refresh halaman → data masih ada
4. Stop backend → frontend error (normal, karena butuh API)

---

## Untuk Deploy ke Production (30-60 menit)

### 4️⃣ Deploy Backend

**Option A: Railway (Tercepat)**
1. Push backend ke GitHub
2. Login https://railway.app
3. New Project → Deploy from GitHub
4. Add MySQL service
5. Set environment variables (lihat [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md))
6. Deploy!

**Option B: VPS**
- Follow panduan di [DEPLOYMENT.md](DEPLOYMENT.md)

### 5️⃣ Deploy Frontend

**Option A: Netlify (Tercepat)**
```bash
npm install -g netlify-cli

# Update .env dengan production URL
echo "VITE_API_BASE_URL=https://apiproyek.ikuhub.com" > .env
echo "VITE_APP_MODE=production" >> .env

# Build & deploy
npm run build
netlify deploy --prod --dir=dist
```

**Option B: Vercel / VPS**
- Follow panduan di [DEPLOYMENT.md](DEPLOYMENT.md)

### 6️⃣ Setup Domain

Di DNS provider (Cloudflare, Namecheap, dll):
```
CNAME  proyek.ikuhub.com       → your-app.netlify.app
CNAME  apiproyek.ikuhub.com   → xxx.railway.app
```

**🎊 Done! Aplikasi live di proyek.ikuhub.com**

---

## 📚 Dokumentasi Lengkap

| File | Isi |
|------|-----|
| [README-NEW.md](README-NEW.md) | Overview aplikasi |
| [SOLUTION.md](SOLUTION.md) | Masalah & solusi yang diimplementasikan |
| [API_REFERENCE.md](API_REFERENCE.md) | Dokumentasi semua API endpoints |
| [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) | Database schema & API setup |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Panduan deployment detail |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Checklist deployment step-by-step |

---

## 🔍 Struktur Folder Penting

```
ikuhub-proyeksi/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Login component
│   │   ├── layout/         # Navbar component
│   │   ├── pages/          # Dashboard, Projects, Users, Company pages
│   │   ├── projects/       # Project-related components
│   │   ├── tasks/          # Task-related components
│   │   └── users/          # User management components
│   ├── hooks/
│   │   ├── use-api-data.ts    # [BARU] Hook untuk data fetching
│   │   └── use-demo-data.ts   # Demo data generator
│   ├── lib/
│   │   ├── api.ts             # [BARU] API client
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── utils.ts           # Helper functions
│   ├── App.tsx              # Main app component
│   └── index.css           # Global styles & theme
│
├── backend-api/            # [BARU] Backend server
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth middleware
│   ├── migrations/        # Database setup
│   └── server.js          # Main server file
│
└── [documentation files...]
```

---

## 💡 Tips & Tricks

### Switch Mode

**Demo → Production:**
```bash
echo "VITE_API_BASE_URL=http://localhost:3000" > .env
echo "VITE_APP_MODE=production" >> .env
```

**Production → Demo:**
```bash
echo "VITE_APP_MODE=demo" > .env
# atau hapus .env file
```

### Debug API Calls

Buka Browser DevTools → Network tab untuk melihat request/response API

### Reset Demo Data

Di browser console:
```javascript
localStorage.clear()
location.reload()
```

### Check Backend Health

```bash
curl http://localhost:3000/
# Should return: {"message":"IkuHub Proyeksi API","version":"1.0.0","status":"running"}
```

### View Backend Logs (Production)

**Railway:** Dashboard → Service → Logs  
**PM2 (VPS):** `pm2 logs ikuhub-api`

---

## 🆘 Troubleshooting

### Frontend tidak connect ke backend

**Check:**
1. Backend running? `curl http://localhost:3000/`
2. `.env` file benar? `cat .env`
3. CORS error? Check browser console

**Fix:**
```bash
# Restart backend dengan CORS logging
cd backend-api
npm run dev
```

### Login tidak berfungsi

**Demo mode:**
- Password harus `Ikuhub@2025` (exact)

**Production mode:**
- User harus ada di database
- Password sudah di-hash dengan bcrypt
- Default user: `admin@ikuhub.com` / `Ikuhub@2025`

**Fix:**
```bash
cd backend-api
npm run migrate  # Create default admin user
```

### Data hilang setelah refresh

**Jika di demo mode:**
- Normal, data di localStorage
- Bisa hilang jika cache dibersihkan

**Jika di production mode:**
- Backend mungkin tidak running
- Check connection ke database

**Fix:**
```bash
# Verify mode
cat .env

# Should show:
# VITE_APP_MODE=production
# VITE_API_BASE_URL=http://localhost:3000
```

---

## 📞 Butuh Bantuan?

1. **Cek dokumentasi** - 90% pertanyaan sudah dijawab di docs
2. **GitHub Issues** - Report bugs atau minta fitur baru
3. **Email support** - support@ikuhub.com

---

## ✅ Next Steps Setelah Setup

- [ ] Customize company settings (logo, alamat, dll)
- [ ] Buat user untuk tim Anda
- [ ] Import atau buat proyek pertama
- [ ] Setup backup database (production)
- [ ] Monitor aplikasi (logs, errors)
- [ ] Update dependencies secara berkala

---

**🎉 Selamat coding! Happy building dengan IkuHub Proyeksi!**

---

**Last Updated:** 2025-01-11  
**Version:** 1.0.0
