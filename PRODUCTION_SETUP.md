# IkuHub Proyeksi - Sistem Manajemen Proyek

Aplikasi manajemen proyek lengkap dengan fitur tracking task, user management, expense tracking, dan reporting.

## 🚀 Fitur Utama

- ✅ **Autentikasi & Otorisasi**: Login dengan password terenkripsi
- 📊 **Dashboard**: Overview proyek dengan grafik dan statistik
- 🏗️ **Manajemen Proyek**: Kelola proyek dengan tracking nilai, customer, dan progress
- ✓ **Manajemen Task**: Assign task ke user dengan progress tracking otomatis
- 👥 **Manajemen User**: CRUD user dengan custom password
- 💰 **Expense Tracking**: Catat pengeluaran per proyek (Petty Cash, Operational, dll)
- 🏢 **Company Settings**: Upload logo, kop surat, dan info perusahaan

## 📦 Mode Deployment

Aplikasi ini mendukung 2 mode:

### 1. Demo Mode (Local Storage)
Untuk development dan demo, data disimpan di browser localStorage.

```bash
# Tidak perlu setup .env atau gunakan:
VITE_APP_MODE=demo
```

### 2. Production Mode (API Backend)
Untuk production dengan database server yang persisten.

```bash
# Buat file .env
VITE_API_BASE_URL=https://api.proyek.ikuhub.com
VITE_APP_MODE=production
```

## 🔧 Setup Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

## 🌐 Setup Production

### Prerequisites
Anda memerlukan backend API server dengan endpoint berikut:

#### Auth Endpoints
- `POST /auth/login` - Login user
  ```json
  Request: { "email": "user@example.com", "password": "password123" }
  Response: { "success": true, "data": { "token": "jwt-token", "user": {...} } }
  ```
- `POST /auth/logout` - Logout user

#### User Endpoints
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Project Endpoints
- `GET /projects` - Get all projects
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Task Endpoints
- `GET /tasks?projectId={id}` - Get tasks (optional filter by project)
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

#### Expense Endpoints
- `GET /expenses?projectId={id}` - Get expenses (optional filter by project)
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

#### Company Settings Endpoints
- `GET /company/settings` - Get company settings
- `PUT /company/settings` - Update company settings

### Response Format
Semua endpoint harus mengembalikan format:
```json
{
  "success": true,
  "data": { ... }
}
```

Atau untuk error:
```json
{
  "success": false,
  "error": "Error message"
}
```

### Authentication
- Setelah login, API client akan menyimpan token JWT
- Setiap request berikutnya akan menyertakan header:
  ```
  Authorization: Bearer {token}
  ```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed password
  created_at BIGINT NOT NULL
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  customer VARCHAR(255) NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_user_ids JSON, -- Array of user IDs
  completed BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category ENUM('petty-cash', 'operational', 'material', 'labor', 'other') NOT NULL,
  date BIGINT NOT NULL,
  created_at BIGINT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Company Settings Table
```sql
CREATE TABLE company_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  letterhead TEXT
);
```

## 🔐 Password Default

Password default untuk akun demo: **`Ikuhub@2025`**

Di production mode, password akan di-hash menggunakan bcrypt atau algoritma hashing yang aman di backend.

## 📱 Custom Domain

Aplikasi sudah dikonfigurasi untuk deploy di:
- **Frontend**: proyek.ikuhub.com
- **Backend API**: api.proyek.ikuhub.com

Pastikan DNS CNAME sudah diatur dengan benar.

## 🚀 Deploy

```bash
# Build untuk production
npm run build

# Output akan ada di folder dist/
# Upload ke hosting atau setup CI/CD
```

## 📝 Catatan Penting

1. **Keamanan Password**: 
   - Di demo mode, password hardcoded untuk testing
   - Di production, backend HARUS meng-hash password dengan bcrypt
   - Jangan pernah kirim password plain text

2. **CORS Configuration**:
   - Backend API harus mengizinkan requests dari proyek.ikuhub.com
   - Set CORS headers yang sesuai

3. **Environment Variables**:
   - Jangan commit file `.env` ke repository
   - Gunakan `.env.example` sebagai template
   - Set environment variables di hosting platform

4. **Data Migration**:
   - Data dari demo mode (localStorage) tidak akan otomatis pindah ke production
   - Lakukan export/import manual jika diperlukan

## 🆘 Troubleshooting

### Login tidak berfungsi
- Pastikan `VITE_API_BASE_URL` sudah benar di `.env`
- Check network tab di browser untuk melihat API response
- Pastikan backend API sudah running dan accessible

### Data tidak persist
- Demo mode: Data akan hilang jika localStorage dibersihkan
- Production mode: Pastikan database connection sudah benar

### CORS Error
- Tambahkan frontend domain ke whitelist CORS di backend
- Set headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, dll

## 📄 License

MIT License - Copyright IkuHub 2025
