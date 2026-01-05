# IkuHub Proyeksi - Backend API 🚀

Backend API untuk aplikasi IkuHub Proyeksi dengan Node.js, Express, dan MySQL.

## 🚀 Quick Start

### Development (Local)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit dengan konfigurasi lokal

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Production (CloudPanel VPS)

**Lihat panduan lengkap:** [DEPLOY_CLOUDPANEL.md](../DEPLOY_CLOUDPANEL.md)

**Quick deploy:**
```bash
# Di VPS, setelah upload code
cd backend-api
chmod +x deploy.sh
./deploy.sh
```

## 📁 Struktur Folder

```
backend-api/
├── server.js           # Entry point
├── db.js              # Database connection
├── package.json       # Dependencies
├── .env.example       # Environment template
├── deploy.sh          # Script deployment otomatis ⭐
├── update.sh          # Script update aplikasi ⭐
├── backup-db.sh       # Script backup database ⭐
├── restore-db.sh      # Script restore database ⭐
├── middleware/
│   └── auth.js        # JWT authentication
├── migrations/
│   └── run.js         # Database migrations
└── routes/
    ├── auth.js        # Authentication routes
    ├── users.js       # Users management
    ├── projects.js    # Projects management
    ├── tasks.js       # Tasks management
    ├── expenses.js    # Expenses management
    └── company.js     # Company settings
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-secret-key-64-chars

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🗄️ Database

### Setup Database di CloudPanel/MySQL

```sql
CREATE DATABASE ikuhub_proyeksi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ikuhub_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON ikuhub_proyeksi.* TO 'ikuhub_user'@'localhost';
FLUSH PRIVILEGES;
```

### Run Migrations

```bash
npm run migrate
```

### Backup & Restore

```bash
# Backup database
chmod +x backup-db.sh
./backup-db.sh

# Setup auto backup (cron)
crontab -e
# Tambahkan: 0 2 * * * /path/to/backup-db.sh

# Restore database
chmod +x restore-db.sh
./restore-db.sh
```

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register user baru

### Users
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/project/:projectId` - Get tasks by project
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Expenses
- `GET /expenses` - Get all expenses
- `GET /expenses/project/:projectId` - Get expenses by project
- `POST /expenses` - Create expense
- `DELETE /expenses/:id` - Delete expense

### Company
- `GET /company` - Get company settings
- `PUT /company` - Update company settings

## 🛠️ Scripts

```bash
# Development
npm run dev          # Start dengan nodemon (auto-reload)

# Production
npm start            # Start server
npm run migrate      # Run database migrations

# Deployment ⭐
./deploy.sh          # Deploy aplikasi (first time)
./update.sh          # Update aplikasi (after changes)

# Database Management ⭐
./backup-db.sh       # Backup database
./restore-db.sh      # Restore database
```

## 📊 Monitoring (PM2)

```bash
pm2 status               # Status aplikasi
pm2 logs ikuhub-api      # Lihat logs
pm2 monit                # Monitor resources
pm2 restart ikuhub-api   # Restart aplikasi
pm2 stop ikuhub-api      # Stop aplikasi
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Test koneksi
mysql -u ikuhub_user -p ikuhub_proyeksi

# Check service
systemctl status mysql

# Check logs
pm2 logs ikuhub-api
```

### Port Already in Use

```bash
# Check port 3000
lsof -i :3000

# Atau ubah PORT di .env
```

## 🔄 Update Workflow

```bash
# 1. Push changes
git push origin main

# 2. Update di production
ssh root@your-vps-ip
cd /path/to/backend-api
./update.sh
```

## 📞 Dokumentasi Lengkap

- [DEPLOY_CLOUDPANEL.md](../DEPLOY_CLOUDPANEL.md) - Panduan deploy lengkap
- [QUICKSTART_CLOUDPANEL.md](../QUICKSTART_CLOUDPANEL.md) - Quick reference

## 📄 License

MIT
