# 🔧 Troubleshooting Guide - CloudPanel MySQL Deployment

Panduan mengatasi masalah umum saat deploy ke CloudPanel dengan MySQL.

---

## 🗄️ Database Issues

### ❌ "Access denied for user"

**Problem:** Backend tidak bisa connect ke MySQL

**Solutions:**

```bash
# 1. Test koneksi manual
mysql -u ikuhub_user -p ikuhub_proyeksi

# 2. Check user privileges
mysql -u root -p
```

```sql
SHOW GRANTS FOR 'ikuhub_user'@'localhost';

-- Jika tidak ada privileges, grant lagi:
GRANT ALL PRIVILEGES ON ikuhub_proyeksi.* TO 'ikuhub_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 3. Check DATABASE_URL di .env
cat backend-api/.env | grep DATABASE_URL

# Format yang benar:
# DATABASE_URL=mysql://ikuhub_user:password@localhost:3306/ikuhub_proyeksi
```

---

### ❌ "Unknown database 'ikuhub_proyeksi'"

**Problem:** Database belum dibuat

**Solution:**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ikuhub_proyeksi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;  -- Pastikan ada ikuhub_proyeksi
EXIT;
```

---

### ❌ "Table doesn't exist"

**Problem:** Migrations belum dijalankan

**Solution:**

```bash
cd backend-api
npm run migrate

# Check tables
mysql -u ikuhub_user -p ikuhub_proyeksi -e "SHOW TABLES;"
```

---

### ❌ "Too many connections"

**Problem:** Connection pool habis

**Solution:**

```bash
# Check connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Restart backend
pm2 restart ikuhub-api

# Jika masih error, restart MySQL
systemctl restart mysql
```

---

## 🚀 Backend API Issues

### ❌ "Cannot find module"

**Problem:** Dependencies tidak terinstall

**Solution:**

```bash
cd backend-api
rm -rf node_modules package-lock.json
npm install --production
pm2 restart ikuhub-api
```

---

### ❌ "Port 3000 already in use"

**Problem:** Port sudah dipakai proses lain

**Solution:**

```bash
# Check apa yang pakai port 3000
lsof -i :3000

# Kill process
kill -9 [PID]

# Atau ubah port di .env
nano backend-api/.env
# PORT=3001

# Jangan lupa update nginx config juga!
```

---

### ❌ Backend tidak running setelah reboot

**Problem:** PM2 startup tidak configured

**Solution:**

```bash
# Setup PM2 startup
pm2 startup systemd

# Jalankan command yang diberikan PM2

# Save PM2 process list
pm2 save

# Test reboot
reboot

# Setelah reboot, check
pm2 list
```

---

### ❌ "JWT malformed" atau "Invalid token"

**Problem:** JWT_SECRET tidak match atau tidak set

**Solution:**

```bash
# Generate JWT secret baru
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update di .env
nano backend-api/.env
# JWT_SECRET=hasil-generate-di-atas

# Restart backend
pm2 restart ikuhub-api

# NOTE: Semua user harus login ulang!
```

---

## 🌐 Nginx & SSL Issues

### ❌ "502 Bad Gateway"

**Problem:** Nginx tidak bisa connect ke backend

**Solution:**

```bash
# 1. Check backend running
pm2 status
curl http://localhost:3000

# 2. Check nginx config
nginx -t

# 3. Check nginx error log
tail -f /var/log/nginx/error.log

# 4. Restart services
pm2 restart ikuhub-api
systemctl restart nginx
```

---

### ❌ "SSL certificate problem"

**Problem:** SSL tidak valid atau expired

**Solution:**

```bash
# Renew certificate
clpctl lets-encrypt:renew:certificate --domainName=apiproyek.ikuhub.com
clpctl lets-encrypt:renew:certificate --domainName=proyek.ikuhub.com

# Atau via Certbot
certbot renew

# Reload nginx
systemctl reload nginx
```

---

### ❌ "413 Request Entity Too Large"

**Problem:** Upload file terlalu besar

**Solution:**

```bash
# Edit nginx config
nano /etc/nginx/nginx.conf

# Tambahkan di http block:
# client_max_body_size 10M;

# Test dan reload
nginx -t
systemctl reload nginx
```

---

## 🎨 Frontend Issues

### ❌ "CORS Error" di browser

**Problem:** Backend tidak allow request dari frontend domain

**Solution:**

```bash
# Update CORS_ORIGIN di backend .env
nano backend-api/.env

# Pastikan sesuai domain frontend
# CORS_ORIGIN=https://proyek.ikuhub.com

# Restart backend
pm2 restart ikuhub-api

# Test di browser:
# F12 → Console → Reload page
```

---

### ❌ "Failed to fetch" atau API errors

**Problem:** Frontend tidak bisa connect ke backend API

**Solution:**

1. **Check API URL di frontend code:**
```bash
# Check api.ts
grep -n "apiproyek.ikuhub.com" src/lib/api.ts

# Pastikan URL benar:
# const API_BASE_URL = 'https://apiproyek.ikuhub.com';
```

2. **Test API dari browser:**
```
Buka: https://apiproyek.ikuhub.com
Harusnya return JSON
```

3. **Rebuild frontend:**
```bash
npm run build
scp -r dist/* root@vps:/home/cloudpanel/htdocs/proyek.ikuhub.com/
```

---

### ❌ 404 Not Found saat refresh page (SPA issue)

**Problem:** Nginx tidak configured untuk SPA

**Solution:**

```bash
# Edit nginx config
nano /etc/nginx/sites-enabled/proyek.ikuhub.com.conf

# Pastikan ada:
location / {
    try_files $uri $uri/ /index.html;
}

# Test dan reload
nginx -t
systemctl reload nginx
```

---

## 📊 Performance Issues

### ❌ Backend lambat/hang

**Problem:** Server overload atau memory leak

**Solution:**

```bash
# Check resources
pm2 monit

# Check memory
free -h
top

# Restart backend
pm2 restart ikuhub-api

# Check logs untuk error
pm2 logs ikuhub-api --lines 100

# Jika memory leak, restart berkala dengan cron:
crontab -e
# 0 4 * * * pm2 restart ikuhub-api
```

---

### ❌ MySQL lambat

**Problem:** Database butuh optimization

**Solution:**

```bash
# Check slow queries
mysql -u root -p
```

```sql
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;

-- Check table size
SELECT 
    table_name, 
    round(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES 
WHERE table_schema = 'ikuhub_proyeksi';

-- Optimize tables
OPTIMIZE TABLE users, projects, tasks, expenses;
```

---

## 🔐 Security Issues

### ❌ File permissions error

**Problem:** Nginx/PM2 tidak bisa akses files

**Solution:**

```bash
# Set permissions untuk backend
chown -R cloudpanel:cloudpanel /home/cloudpanel/htdocs/apiproyek.ikuhub.com
chmod -R 755 /home/cloudpanel/htdocs/apiproyek.ikuhub.com

# .env harus 600
chmod 600 /home/cloudpanel/htdocs/apiproyek.ikuhub.com/backend-api/.env

# Set permissions untuk frontend
chown -R cloudpanel:cloudpanel /home/cloudpanel/htdocs/proyek.ikuhub.com
chmod -R 755 /home/cloudpanel/htdocs/proyek.ikuhub.com
```

---

### ❌ Firewall blocking connections

**Problem:** UFW atau firewall block ports

**Solution:**

```bash
# Check firewall status
ufw status

# Allow necessary ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 8443/tcp # CloudPanel
ufw enable

# Check connections
netstat -tulpn | grep :3000
```

---

## 🔄 Update/Deployment Issues

### ❌ Update script gagal

**Problem:** `./update.sh` error

**Solution:**

```bash
# Manual update
cd backend-api

# Pull latest
git pull origin main

# Install dependencies
npm install --production

# Run migrations
npm run migrate

# Restart
pm2 restart ikuhub-api

# Check logs
pm2 logs ikuhub-api
```

---

### ❌ Git pull gagal (Permission denied)

**Problem:** SSH key tidak setup untuk git

**Solution:**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add ke GitHub: Settings → SSH Keys → Add SSH key

# Test connection
ssh -T git@github.com
```

---

## 💾 Backup/Restore Issues

### ❌ Backup script error

**Problem:** `./backup-db.sh` gagal

**Solution:**

```bash
# Manual backup
mysqldump -u ikuhub_user -p ikuhub_proyeksi > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_*.sql

# Check backup
ls -lh backup_*.sql.gz
```

---

### ❌ Restore error

**Problem:** Data tidak ter-restore

**Solution:**

```bash
# Stop backend dulu
pm2 stop ikuhub-api

# Manual restore
gunzip -c backup_file.sql.gz | mysql -u ikuhub_user -p ikuhub_proyeksi

# Restart backend
pm2 restart ikuhub-api

# Test aplikasi
curl http://localhost:3000
```

---

## 📝 Debugging Commands

Gunakan commands ini untuk troubleshooting:

```bash
# Backend logs
pm2 logs ikuhub-api
pm2 logs ikuhub-api --lines 100
pm2 logs ikuhub-api --err  # Error logs only

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MySQL logs
tail -f /var/log/mysql/error.log

# System logs
journalctl -xe
journalctl -u nginx
journalctl -u mysql

# Check services
systemctl status nginx
systemctl status mysql
pm2 status

# Check ports
netstat -tulpn
lsof -i :3000
lsof -i :3306

# Check processes
ps aux | grep node
ps aux | grep nginx
ps aux | grep mysql

# Check disk space
df -h

# Check memory
free -h
top
htop
```

---

## 🆘 Emergency Recovery

Jika semua gagal, restart services:

```bash
# 1. Stop semua
pm2 stop all
systemctl stop nginx
systemctl stop mysql

# 2. Start services
systemctl start mysql
systemctl start nginx
pm2 restart all

# 3. Check status
systemctl status mysql
systemctl status nginx
pm2 status

# 4. Check logs
pm2 logs ikuhub-api
tail -f /var/log/nginx/error.log
```

Jika masih error, **reboot VPS:**

```bash
# Reboot
reboot

# Setelah reboot, check semua services
pm2 list
systemctl status nginx
systemctl status mysql
```

---

## 📞 Need More Help?

1. **Check logs first:** `pm2 logs ikuhub-api`
2. **Check error details:** Browser DevTools (F12) → Console
3. **Check nginx errors:** `tail -f /var/log/nginx/error.log`
4. **Search error message** di Google/Stack Overflow
5. **Contact support** jika masih stuck

---

**Dokumentasi terkait:**
- [DEPLOY_CLOUDPANEL.md](DEPLOY_CLOUDPANEL.md) - Panduan deploy lengkap
- [QUICKSTART_CLOUDPANEL.md](QUICKSTART_CLOUDPANEL.md) - Quick reference
- [CHECKLIST_DEPLOY.md](CHECKLIST_DEPLOY.md) - Deployment checklist
