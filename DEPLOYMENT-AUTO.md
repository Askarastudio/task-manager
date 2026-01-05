# 🚀 Auto Deployment Setup

Sistem ini menggunakan GitHub Actions untuk auto-deploy frontend dan backend setiap kali ada push ke branch `main`.

## 📋 Setup GitHub Secrets

Anda perlu menambahkan secrets di GitHub repository:

1. Buka **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret**
3. Tambahkan secret berikut:

### Required Secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VPS_PASSWORD` | `Rifqirachel@123` | Password untuk akses VPS |

## 🔧 Workflow Files

Ada 3 workflow yang tersedia:

### 1. `deploy.yml` - Frontend Only
Deploy frontend ke GitHub Pages (proyek.ikuhub.com)
- **Trigger:** Push ke `main` branch
- **Target:** GitHub Pages
- **URL:** https://proyek.ikuhub.com

### 2. `deploy-backend.yml` - Backend Only
Deploy backend ke VPS (apiproyek.ikuhub.com)
- **Trigger:** Push ke `main` branch (hanya jika ada perubahan di `backend-api/`)
- **Target:** VPS 72.62.120.94
- **User:** ikuhub-apiproyek
- **Path:** `/home/ikuhub-apiproyek/htdocs/apiproyek.ikuhub.com/`

### 3. `deploy-fullstack.yml` - Frontend + Backend ⭐ (RECOMMENDED)
Deploy frontend dan backend sekaligus
- **Trigger:** Push ke `main` branch ATAU manual dispatch
- **Target:** GitHub Pages + VPS
- **Advantages:** Deploy sekali jalan untuk keduanya

## 🎯 Cara Menggunakan

### Auto Deploy (Recommended)
```bash
# 1. Buat perubahan di code
git add .
git commit -m "feat: your changes"
git push origin main

# GitHub Actions akan otomatis:
# ✅ Build frontend
# ✅ Deploy ke GitHub Pages (proyek.ikuhub.com)
# ✅ Deploy backend ke VPS (apiproyek.ikuhub.com)
# ✅ Restart PM2
```

### Manual Deploy
1. Buka **GitHub Repository** → **Actions**
2. Pilih workflow **Deploy Full Stack**
3. Klik **Run workflow** → **Run workflow**

## 🔍 Monitoring

### Cek Status Deployment
1. Buka **GitHub Repository** → **Actions**
2. Lihat status workflow terakhir
3. Klik workflow untuk melihat detail logs

### Cek Status Backend di VPS
```bash
ssh ikuhub-apiproyek@72.62.120.94
cd /home/ikuhub-apiproyek/htdocs/apiproyek.ikuhub.com
pm2 list
pm2 logs ikuhub-api
```

## 📦 Deployment Flow

```
┌─────────────────┐
│  Git Push       │
│  to main        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  GitHub Actions Triggered   │
└─────────┬───────────────────┘
          │
          ├──────────────────┬─────────────────┐
          │                  │                 │
          ▼                  ▼                 ▼
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │  Build   │      │  Deploy  │     │  Deploy  │
    │ Frontend │      │ Frontend │     │ Backend  │
    └──────────┘      └──────────┘     └──────────┘
          │                  │                 │
          │                  ▼                 │
          │          ┌──────────────┐          │
          │          │ GitHub Pages │          │
          │          │proyek.ikuhub │          │
          │          └──────────────┘          │
          │                                    │
          └────────────────┬───────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ VPS Server   │
                    │apiproyek.iku │
                    │ PM2 Restart  │
                    └──────────────┘
```

## 🛠️ Troubleshooting

### Frontend tidak update
1. Cek GitHub Actions logs
2. Pastikan GitHub Pages enabled di **Settings** → **Pages**
3. Source harus **GitHub Actions**

### Backend tidak update
1. Cek GitHub Actions logs untuk error
2. Cek PM2 logs: `pm2 logs ikuhub-api`
3. Restart manual: `pm2 restart ikuhub-api`

### Permission denied errors
1. Pastikan VPS_PASSWORD secret sudah benar
2. Cek file permissions di VPS
3. Cek PM2 running as correct user

## 📝 First Time Setup

### 1. Setup GitHub Pages
```
GitHub Repo → Settings → Pages
Source: GitHub Actions
```

### 2. Setup PM2 di VPS (Jika belum)
```bash
ssh ikuhub-apiproyek@72.62.120.94
cd /home/ikuhub-apiproyek/htdocs/apiproyek.ikuhub.com

# Install PM2 globally (if not installed)
npm install -g pm2

# Start backend
pm2 start server.js --name ikuhub-api --env production
pm2 save
pm2 startup
```

### 3. Setup .env di VPS
```bash
# File .env harus ada di VPS
cd /home/ikuhub-apiproyek/htdocs/apiproyek.ikuhub.com
nano .env

# Isi dengan konfigurasi database, dll
```

## ✅ Verification Checklist

Setelah deployment:

- [ ] Frontend accessible: https://proyek.ikuhub.com
- [ ] Backend API: https://apiproyek.ikuhub.com
- [ ] Menu Laporan muncul di navbar
- [ ] Login berfungsi
- [ ] CRUD operations berfungsi
- [ ] PM2 running: `pm2 list` shows ikuhub-api
- [ ] No errors in PM2 logs: `pm2 logs ikuhub-api --lines 50`

## 🔒 Security Notes

- ✅ VPS password disimpan sebagai GitHub Secret (encrypted)
- ✅ GitHub Actions hanya bisa dijalankan oleh repository collaborators
- ✅ .env file tidak ter-deploy (excluded dari deployment)
- ⚠️ Pastikan .env di VPS sudah dikonfigurasi manual

## 📞 Support

Jika ada masalah:
1. Cek GitHub Actions logs
2. Cek PM2 logs di VPS
3. Cek browser console untuk frontend errors
4. Review recent commits yang mungkin break deployment
