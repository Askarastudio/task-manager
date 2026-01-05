# Deployment Guide untuk IkuHub Proyeksi

## 📋 Ringkasan

Aplikasi IkuHub Proyeksi terdiri dari 2 bagian:
1. **Frontend** (React + Vite) - Deploy ke proyek.ikuhub.com
2. **Backend API** (Node.js + Express + MySQL) - Deploy ke apiproyek.ikuhub.com

---

## 🎯 Option 1: Production dengan Backend API (Recommended)

### Step 1: Setup Database

**Pilihan A: MySQL di VPS/Cloud**
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE ikuhub_proyeksi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Buat user
CREATE USER 'ikuhub_user'@'%' IDENTIFIED BY 'password_yang_kuat';
GRANT ALL PRIVILEGES ON ikuhub_proyeksi.* TO 'ikuhub_user'@'%';
FLUSH PRIVILEGES;
```

**Pilihan B: Managed Database (Recommended)**
- **Railway**: Otomatis provision MySQL
- **PlanetScale**: MySQL serverless (gratis tier)
- **AWS RDS**: MySQL managed service
- **DigitalOcean Managed Database**

### Step 2: Deploy Backend API

**Option A: Deploy ke Railway (Paling Mudah)**

1. Push backend ke GitHub repository
2. Buka https://railway.app
3. New Project → Deploy from GitHub
4. Pilih repository backend-api
5. Tambahkan environment variables:
   ```
   PORT=3000
   DATABASE_URL=mysql://user:pass@host:3306/ikuhub_proyeksi
   JWT_SECRET=generate-random-string-64-chars
   CORS_ORIGIN=https://proyek.ikuhub.com
   NODE_ENV=production
   ```
6. Deploy!
7. Railway akan memberikan URL: `xxx.railway.app`
8. Setup custom domain `apiproyek.ikuhub.com`

**Option B: Deploy ke VPS (Manual)**

```bash
# SSH ke VPS
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/backend-api.git
cd backend-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit dengan credentials yang benar

# Run migrations
npm run migrate

# Start dengan PM2
pm2 start server.js --name ikuhub-api
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/apiproyek.ikuhub.com
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name apiproyek.ikuhub.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site dan restart Nginx
sudo ln -s /etc/nginx/sites-available/apiproyek.ikuhub.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL dengan Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d apiproyek.ikuhub.com
```

### Step 3: Deploy Frontend

**Update Frontend Configuration**

Buat file `.env` di root project:
```env
VITE_API_BASE_URL=https://apiproyek.ikuhub.com
VITE_APP_MODE=production
```

**Build frontend:**
```bash
npm run build
# Output akan ada di folder dist/
```

**Deploy Options:**

**A. Netlify (Recommended)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Di Netlify dashboard:
- Set custom domain: proyek.ikuhub.com
- Environment variables: tambahkan VITE_API_BASE_URL

**B. Vercel**
```bash
npm install -g vercel
vercel --prod
```

**C. GitHub Pages**
- Push dist/ ke branch gh-pages
- Settings → Pages → Set custom domain

**D. VPS dengan Nginx**
```bash
# Upload dist/ ke server
scp -r dist/* root@your-server:/var/www/proyek.ikuhub.com/

# Nginx config
server {
    listen 80;
    server_name proyek.ikuhub.com;
    root /var/www/proyek.ikuhub.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 4: Setup DNS

Di panel domain Anda (Cloudflare, Namecheap, dll):

```
Type    Name                Value                           TTL
A       proyek.ikuhub.com   [IP Server Frontend]            Auto
A       apiproyek.ikuhub.com [IP Server Backend]          Auto
```

Atau jika menggunakan CDN:
```
CNAME   proyek.ikuhub.com   your-app.netlify.app           Auto
CNAME   apiproyek.ikuhub.com  xxx.railway.app             Auto
```

---

## 🎯 Option 2: Demo Mode (Tanpa Backend)

Jika Anda ingin deploy tanpa setup backend (data tersimpan di browser):

```bash
# Jangan buat .env atau set:
VITE_APP_MODE=demo

# Build
npm run build

# Deploy dist/ ke hosting manapun
```

⚠️ **Catatan**: Data akan hilang jika browser cache dibersihkan!

---

## 🔐 Keamanan Checklist

- [ ] Ganti `JWT_SECRET` dengan string random 64+ karakter
- [ ] Gunakan HTTPS (SSL/TLS) untuk frontend dan backend
- [ ] Set CORS origin yang spesifik, jangan gunakan `*`
- [ ] Password di-hash dengan bcrypt (sudah otomatis di backend)
- [ ] Database credentials tidak di-commit ke Git
- [ ] Firewall setup: hanya allow port 80, 443, dan SSH
- [ ] Regular backup database
- [ ] Update dependencies secara rutin

---

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl https://apiproyek.ikuhub.com/

# Test login
curl -X POST https://apiproyek.ikuhub.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ikuhub.com","password":"Ikuhub@2025"}'
```

### Test Frontend
1. Buka https://proyek.ikuhub.com
2. Login dengan: admin@ikuhub.com / Ikuhub@2025
3. Buat proyek baru
4. Refresh halaman → data harus tetap ada

---

## 🆘 Troubleshooting

### Frontend tidak bisa connect ke Backend

1. Cek CORS settings di backend
2. Pastikan VITE_API_BASE_URL benar
3. Buka DevTools → Network → lihat error

### Database connection error

1. Cek DATABASE_URL format benar
2. Test koneksi: `mysql -h host -u user -p database`
3. Pastikan firewall allow MySQL port (3306)

### Login tidak bekerja

1. Pastikan user sudah ada di database (run migration)
2. Cek console untuk error message
3. Verify JWT_SECRET sudah di-set

---

## 📞 Support

Untuk bantuan lebih lanjut, buka:
- GitHub Issues
- Email: support@ikuhub.com

---

## 📝 Quick Reference

```bash
# Backend commands
npm run dev          # Development
npm run migrate      # Setup database
npm start           # Production

# Frontend commands
npm run dev         # Development
npm run build       # Production build
npm run preview     # Preview build

# PM2 commands
pm2 status          # Check status
pm2 logs ikuhub-api # View logs
pm2 restart ikuhub-api # Restart app
pm2 stop ikuhub-api # Stop app
```
