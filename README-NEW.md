# IkuHub Proyeksi

<div align="center">

**Sistem Manajemen Proyek Lengkap**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Aplikasi web untuk mengelola proyek, task, user, dan keuangan dengan interface yang modern dan intuitif.

[Demo](#quick-start) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

---

## ✨ Fitur Utama

- 🔐 **Autentikasi & Keamanan** - Login dengan password terenkripsi
- 📊 **Dashboard Interaktif** - Visualisasi progress proyek dengan grafik
- 🏗️ **Manajemen Proyek** - Track nilai, customer, dan progress proyek
- ✓ **Task Management** - Assign task ke user dengan auto-progress tracking
- 👥 **User Management** - CRUD user dengan custom password
- 💰 **Expense Tracking** - Catat pengeluaran: Petty Cash, Operational, Material, dll
- 🏢 **Company Settings** - Upload logo dan kop surat
- 📱 **Responsive Design** - Mobile-friendly interface

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/ikuhub-proyeksi.git
cd ikuhub-proyeksi

# Quick setup (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or manual setup
npm install
npm run dev

# Buka browser: http://localhost:5173
# Login: any-email@example.com / Ikuhub@2025
```

**Windows users:** Jalankan `setup.bat`

## 📖 Documentation

- **[SOLUTION.md](SOLUTION.md)** - Overview masalah dan solusi
- **[PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)** - API endpoints & database schema
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Step-by-step deployment guide
- **[backend-api/README.md](backend-api/README.md)** - Backend server documentation

## 🎯 Mode Operasi

### Demo Mode (Default)
Data disimpan di browser localStorage - cocok untuk testing.

```env
VITE_APP_MODE=demo
```

### Production Mode
Data disimpan di database server - cocok untuk production.

```env
VITE_API_BASE_URL=https://api.proyek.ikuhub.com
VITE_APP_MODE=production
```

Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk setup lengkap.

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Shadcn UI Components
- Framer Motion
- Recharts

**Backend:**
- Node.js + Express
- MySQL/PostgreSQL
- JWT Authentication
- bcrypt Password Hashing

## 📦 Project Structure

```
ikuhub-proyeksi/
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks including useApiData
│   ├── lib/            # Utils, types, and API client
│   └── styles/         # CSS files
├── backend-api/        # Backend server (Node.js + Express)
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   └── migrations/     # Database schema
├── DEPLOYMENT.md       # Deployment guide
├── PRODUCTION_SETUP.md # API documentation
└── SOLUTION.md         # Technical overview
```

## 🔐 Security

- ✅ Password hashing with bcrypt (production)
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ⚠️ Demo mode uses hardcoded password: `Ikuhub@2025`

## 🚀 Deployment

Aplikasi ini siap di-deploy ke:

**Frontend:**
- Netlify (Recommended)
- Vercel
- GitHub Pages
- VPS with Nginx

**Backend:**
- Railway (Recommended)
- Heroku
- DigitalOcean
- AWS
- VPS with PM2

Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan lengkap.

## 📝 Environment Variables

```env
# Frontend (.env)
VITE_API_BASE_URL=https://api.proyek.ikuhub.com
VITE_APP_MODE=production

# Backend (.env)
PORT=3000
DATABASE_URL=mysql://user:pass@host:3306/ikuhub_proyeksi
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://proyek.ikuhub.com
NODE_ENV=production
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - Copyright (c) 2025 IkuHub

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 📞 Support

- 📧 Email: support@ikuhub.com
- 🌐 Website: https://proyek.ikuhub.com
- 📝 Issues: [GitHub Issues](https://github.com/your-org/ikuhub-proyeksi/issues)

---

<div align="center">

Made with ❤️ by IkuHub Team

**[⬆ back to top](#ikuhub-proyeksi)**

</div>
