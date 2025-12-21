# API Reference - IkuHub Proyeksi

Base URL: `https://api.proyek.ikuhub.com` (production) atau `http://localhost:3000` (development)

## Authentication

Semua endpoint (kecuali `/auth/login`) membutuhkan header:
```
Authorization: Bearer <jwt-token>
```

---

## Auth Endpoints

### POST /auth/login
Login user dan mendapatkan JWT token.

**Request:**
```json
{
  "email": "admin@ikuhub.com",
  "password": "Ikuhub@2025"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "admin-default",
      "email": "admin@ikuhub.com",
      "name": "Administrator",
      "loginAt": 1704067200000
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Email atau password salah"
}
```

### POST /auth/logout
Logout user (invalidate token di client side).

**Response:**
```json
{
  "success": true
}
```

---

## User Endpoints

### GET /users
Get all users.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-1234",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Developer",
      "created_at": 1704067200000
    }
  ]
}
```

### POST /users
Create new user.

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "Designer",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-5678",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "Designer",
    "createdAt": 1704067200000
  }
}
```

### PUT /users/:id
Update user.

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "Senior Designer",
  "password": "NewPassword456"
}
```

Note: `password` is optional. Hanya include jika ingin ganti password.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-5678",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "Senior Designer"
  }
}
```

### DELETE /users/:id
Delete user.

**Response:**
```json
{
  "success": true
}
```

---

## Project Endpoints

### GET /projects
Get all projects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-1234",
      "name": "Website Redesign",
      "customer": "PT ABC Indonesia",
      "value": 50000000,
      "description": "Redesign company website",
      "created_at": 1704067200000
    }
  ]
}
```

### POST /projects
Create new project.

**Request:**
```json
{
  "name": "Mobile App Development",
  "customer": "PT XYZ Corp",
  "value": 150000000,
  "description": "Build mobile app for e-commerce"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-5678",
    "name": "Mobile App Development",
    "customer": "PT XYZ Corp",
    "value": 150000000,
    "description": "Build mobile app for e-commerce",
    "createdAt": 1704067200000
  }
}
```

### PUT /projects/:id
Update project.

**Request:**
```json
{
  "name": "Mobile App Development - Updated",
  "customer": "PT XYZ Corporation",
  "value": 175000000,
  "description": "Build mobile app for e-commerce with payment gateway"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-5678",
    "name": "Mobile App Development - Updated",
    "customer": "PT XYZ Corporation",
    "value": 175000000,
    "description": "Build mobile app for e-commerce with payment gateway"
  }
}
```

### DELETE /projects/:id
Delete project (cascade delete all tasks and expenses).

**Response:**
```json
{
  "success": true
}
```

---

## Task Endpoints

### GET /tasks
Get all tasks, optionally filter by project.

**Query Parameters:**
- `projectId` (optional): Filter tasks by project ID

**Examples:**
- `/tasks` - Get all tasks
- `/tasks?projectId=project-1234` - Get tasks for specific project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-1234",
      "projectId": "project-1234",
      "title": "Design Homepage",
      "description": "Create mockup for homepage",
      "assignedUserIds": ["user-1234", "user-5678"],
      "completed": false,
      "createdAt": 1704067200000
    }
  ]
}
```

### POST /tasks
Create new task.

**Request:**
```json
{
  "projectId": "project-1234",
  "title": "Implement Login Feature",
  "description": "Build authentication system",
  "assignedUserIds": ["user-1234"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-5678",
    "projectId": "project-1234",
    "title": "Implement Login Feature",
    "description": "Build authentication system",
    "assignedUserIds": ["user-1234"],
    "completed": false,
    "createdAt": 1704067200000
  }
}
```

### PUT /tasks/:id
Update task.

**Request:**
```json
{
  "title": "Implement Login & Registration",
  "description": "Build authentication system with email verification",
  "assignedUserIds": ["user-1234", "user-5678"],
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-5678",
    "title": "Implement Login & Registration",
    "description": "Build authentication system with email verification",
    "assignedUserIds": ["user-1234", "user-5678"],
    "completed": true
  }
}
```

### DELETE /tasks/:id
Delete task.

**Response:**
```json
{
  "success": true
}
```

---

## Expense Endpoints

### GET /expenses
Get all expenses, optionally filter by project.

**Query Parameters:**
- `projectId` (optional): Filter expenses by project ID

**Examples:**
- `/expenses` - Get all expenses
- `/expenses?projectId=project-1234` - Get expenses for specific project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "expense-1234",
      "projectId": "project-1234",
      "description": "Domain & Hosting",
      "amount": 500000,
      "category": "operational",
      "date": 1704067200000,
      "createdAt": 1704067200000
    }
  ]
}
```

**Categories:**
- `petty-cash` - Petty Cash
- `operational` - Operational
- `material` - Material
- `labor` - Labor/Tenaga Kerja
- `other` - Lainnya

### POST /expenses
Create new expense.

**Request:**
```json
{
  "projectId": "project-1234",
  "description": "Software License",
  "amount": 2000000,
  "category": "operational",
  "date": 1704067200000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "expense-5678",
    "projectId": "project-1234",
    "description": "Software License",
    "amount": 2000000,
    "category": "operational",
    "date": 1704067200000,
    "createdAt": 1704067200000
  }
}
```

### PUT /expenses/:id
Update expense.

**Request:**
```json
{
  "description": "Software License (Annual)",
  "amount": 2500000,
  "category": "operational",
  "date": 1704067200000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "expense-5678",
    "description": "Software License (Annual)",
    "amount": 2500000,
    "category": "operational",
    "date": 1704067200000
  }
}
```

### DELETE /expenses/:id
Delete expense.

**Response:**
```json
{
  "success": true
}
```

---

## Company Settings Endpoints

### GET /company/settings
Get company settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "IkuHub Proyeksi",
    "logo": "data:image/png;base64,...",
    "address": "Jl. Example No. 123, Jakarta",
    "phone": "+62-21-1234567",
    "email": "info@ikuhub.com",
    "letterhead": "data:image/png;base64,..."
  }
}
```

### PUT /company/settings
Update company settings.

**Request:**
```json
{
  "name": "IkuHub Proyeksi Indonesia",
  "logo": "data:image/png;base64,...",
  "address": "Jl. Example No. 456, Jakarta Selatan",
  "phone": "+62-21-7654321",
  "email": "contact@ikuhub.com",
  "letterhead": "data:image/png;base64,..."
}
```

Note: `logo` dan `letterhead` adalah base64 encoded images.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "IkuHub Proyeksi Indonesia",
    "logo": "data:image/png;base64,...",
    "address": "Jl. Example No. 456, Jakarta Selatan",
    "phone": "+62-21-7654321",
    "email": "contact@ikuhub.com",
    "letterhead": "data:image/png;base64,..."
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (token expired)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing dengan cURL

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ikuhub.com","password":"Ikuhub@2025"}'
```

### Get Projects (dengan token)
```bash
TOKEN="your-jwt-token-here"

curl http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN"
```

### Create Project
```bash
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "customer": "Test Customer",
    "value": 10000000,
    "description": "Test description"
  }'
```

---

## Testing dengan Postman

1. Import collection dari dokumentasi ini
2. Set environment variable:
   - `base_url`: `http://localhost:3000` or `https://api.proyek.ikuhub.com`
   - `token`: JWT token dari login response

3. Login dulu untuk mendapatkan token
4. Copy token ke environment variable
5. Test endpoints lainnya

---

## Rate Limiting (Optional - untuk production)

Untuk production, pertimbangkan implementasi rate limiting:
- Login: 5 attempts per 15 menit
- API calls: 100 requests per menit per user

---

## Versioning

Current API version: `v1`

Future versions akan menggunakan URL prefix:
- `https://api.proyek.ikuhub.com/v1/...`
- `https://api.proyek.ikuhub.com/v2/...`

---

**Last Updated:** 2025-01-11
**Maintained by:** IkuHub Team
