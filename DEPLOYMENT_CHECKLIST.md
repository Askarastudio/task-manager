# 🚀 Deployment Checklist untuk IkuHub Proyeksi

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Buat file `.env` di root project
- [ ] Set `VITE_API_BASE_URL` ke URL backend production
- [ ] Set `VITE_APP_MODE=production`
- [ ] Pastikan `.env` ada di `.gitignore`

### 2. Backend Setup
- [ ] Database MySQL/PostgreSQL sudah running
- [ ] Copy `backend-api/.env.example` ke `backend-api/.env`
- [ ] Update `DATABASE_URL` dengan credentials database
- [ ] Generate `JWT_SECRET` random (min 64 karakter)
- [ ] Set `CORS_ORIGIN` ke domain frontend
- [ ] Jalankan migrations: `npm run migrate`
- [ ] Test API endpoints

### 3. Frontend Build
- [ ] Run `npm run build` berhasil
- [ ] Test build dengan `npm run preview`
- [ ] Verify semua environment variables terbaca
- [ ] Check console untuk errors

### 4. Security
- [ ] Password tidak hardcoded di production
- [ ] JWT_SECRET menggunakan random string yang kuat
- [ ] Database credentials aman (tidak di-commit)
- [ ] CORS configured correctly
- [ ] HTTPS/SSL enabled

### 5. Testing
- [ ] Login/logout berfungsi
- [ ] Create/update/delete proyek tersimpan
- [ ] Task assignment berfungsi
- [ ] Expense tracking berfungsi
- [ ] Data persist setelah refresh
- [ ] User management berfungsi
- [ ] Company settings tersimpan

---

## 📋 Backend Deployment Steps

### Option 1: Railway (Recommended)

1. **Prepare Repository**
   ```bash
   cd backend-api
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/your-repo/backend-api.git
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Login ke https://railway.app
   - New Project → Deploy from GitHub
   - Select repository: `backend-api`
   - Add MySQL database service
   - Set environment variables:
     ```
     DATABASE_URL=<dari railway mysql>
     JWT_SECRET=<generate random 64 chars>
     CORS_ORIGIN=https://proyek.ikuhub.com
     PORT=3000
     NODE_ENV=production
     ```

3. **Run Migrations**
   - Di Railway dashboard → Service → Settings
   - Add Start Command: `npm run migrate && npm start`
   - Atau manual via Railway CLI:
     ```bash
     railway run npm run migrate
     ```

4. **Setup Custom Domain**
   - Settings → Networking → Custom Domain
   - Add: `api.proyek.ikuhub.com`
   - Copy CNAME record ke DNS provider

### Option 2: VPS Manual

```bash
# SSH ke VPS
ssh root@your-vps-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Setup database
sudo mysql
CREATE DATABASE ikuhub_proyeksi;
CREATE USER 'ikuhub'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON ikuhub_proyeksi.* TO 'ikuhub'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Clone backend
git clone https://github.com/your-repo/backend-api.git
cd backend-api

# Install PM2
sudo npm install -g pm2

# Setup environment
cp .env.example .env
nano .env  # Edit dengan credentials

# Install deps & migrate
npm install
npm run migrate

# Start with PM2
pm2 start server.js --name ikuhub-api
pm2 save
pm2 startup

# Install & configure Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/api.proyek.ikuhub.com
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name api.proyek.ikuhub.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/api.proyek.ikuhub.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.proyek.ikuhub.com
```

---

## 🌐 Frontend Deployment Steps

### Option 1: Netlify (Recommended)

1. **Setup Environment**
   ```bash
   # Create .env
   echo "VITE_API_BASE_URL=https://api.proyek.ikuhub.com" > .env
   echo "VITE_APP_MODE=production" >> .env
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or via Netlify Dashboard**
   - Login ke https://app.netlify.com
   - New site from Git
   - Select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables:
     - `VITE_API_BASE_URL`: `https://api.proyek.ikuhub.com`
     - `VITE_APP_MODE`: `production`

4. **Custom Domain**
   - Site settings → Domain management
   - Add custom domain: `proyek.ikuhub.com`
   - Update DNS CNAME

### Option 2: Vercel

```bash
npm install -g vercel
vercel --prod
```

Set environment variables di Vercel dashboard.

### Option 3: VPS with Nginx

```bash
# Build locally
npm run build

# Upload to VPS
scp -r dist/* root@your-vps:/var/www/proyek.ikuhub.com/

# Nginx config
sudo nano /etc/nginx/sites-available/proyek.ikuhub.com
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name proyek.ikuhub.com;
    root /var/www/proyek.ikuhub.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/proyek.ikuhub.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d proyek.ikuhub.com
```

---

## 🔧 DNS Configuration

### Cloudflare / Domain Provider

```
Type    Name                    Value                       TTL
A       proyek.ikuhub.com       <Frontend IP/CNAME>         Auto
A       api.proyek.ikuhub.com   <Backend IP/CNAME>          Auto
```

Atau jika menggunakan CDN:
```
Type    Name                    Value                       TTL
CNAME   proyek.ikuhub.com       xxx.netlify.app            Auto
CNAME   api.proyek.ikuhub.com   xxx.railway.app            Auto
```

---

## 🧪 Post-Deployment Testing

### Backend API Tests

```bash
# Health check
curl https://api.proyek.ikuhub.com/

# Test login
curl -X POST https://api.proyek.ikuhub.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ikuhub.com","password":"Ikuhub@2025"}'

# Should return token
```

### Frontend Tests

1. Buka https://proyek.ikuhub.com
2. Login dengan admin@ikuhub.com / Ikuhub@2025
3. Create new project
4. Add task
5. Refresh page → data harus persist
6. Logout & login kembali → data masih ada

---

## 🐛 Common Issues & Solutions

### Issue: "Network Error" saat login

**Solution:**
- Check CORS settings di backend
- Verify `VITE_API_BASE_URL` correct
- Check browser console for detailed error

### Issue: Data tidak persist

**Solution:**
- Pastikan `VITE_APP_MODE=production`
- Verify backend API responding
- Check localStorage/sessionStorage tidak di-clear

### Issue: 401 Unauthorized

**Solution:**
- Token expired, logout & login kembali
- Check JWT_SECRET sama di backend
- Verify token storage in localStorage

### Issue: CORS Error

**Solution:**
```javascript
// backend-api/server.js
app.use(cors({
  origin: 'https://proyek.ikuhub.com', // Exact domain
  credentials: true
}));
```

---

## 📊 Monitoring

### PM2 (if using VPS)

```bash
pm2 status                # Check status
pm2 logs ikuhub-api      # View logs
pm2 restart ikuhub-api   # Restart
pm2 monit                # Real-time monitoring
```

### Database Backup

```bash
# MySQL backup
mysqldump -u ikuhub -p ikuhub_proyeksi > backup.sql

# Restore
mysql -u ikuhub -p ikuhub_proyeksi < backup.sql
```

---

## ✅ Final Checklist

- [ ] Frontend accessible via HTTPS
- [ ] Backend API accessible via HTTPS
- [ ] Login works with real user from database
- [ ] Data persists after refresh
- [ ] All CRUD operations work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificates valid
- [ ] Database backups configured
- [ ] Monitoring setup

---

## 📞 Need Help?

- Check `DEPLOYMENT.md` for detailed guides
- Check `PRODUCTION_SETUP.md` for API documentation
- Check `SOLUTION.md` for architecture overview
- Open GitHub issue for bugs

**🎉 Selamat! Aplikasi Anda sudah production-ready!**
