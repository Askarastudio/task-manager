# Backend API untuk IkuHub Proyeksi

Backend API server untuk aplikasi IkuHub Proyeksi dengan database MySQL/PostgreSQL.

## Quick Start

```bash
cd backend-api
npm install
cp .env.example .env
# Edit .env dengan database credentials Anda
npm run dev
```

## Tech Stack

- Node.js + Express
- MySQL atau PostgreSQL
- JWT Authentication
- bcrypt untuk password hashing

## Environment Variables

```env
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/ikuhub_proyeksi
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=https://proyek.ikuhub.com
```

## API Documentation

Lihat PRODUCTION_SETUP.md untuk detail semua endpoints.

## Database Setup

```bash
# Jalankan migration
npm run migrate

# Seed data awal (optional)
npm run seed
```

## Deploy

Backend ini bisa di-deploy ke:
- VPS (dengan PM2)
- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2
- dll

Pastikan environment variables sudah di-set di production environment.
