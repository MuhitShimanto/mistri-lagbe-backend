# Mistri-Lagbe Backend API 🔧

A production-ready RESTful backend API for **Mistri-Lagbe**, an on-demand home service marketplace that connects customers with skilled technicians for various household services such as pest control, electrical work, plumbing, cleaning, painting, and more.

The API provides secure authentication, role-based authorization, booking management, technician services, online payment integration, reviews, and administrative controls.

---

## ✨ Features

### 🌍 Public Features
- Browse available services
- View technician profiles
- Search technicians and services
- Register and authenticate users

### 👤 Customer Features
- Register and login
- Browse and book services
- Cancel pending bookings
- Make online payments
- View payment history
- Leave reviews after completed services
- Manage profile

### 🛠 Technician Features
- Complete technician profile
- Manage professional information
- Create and update services
- View incoming booking requests
- Accept bookings
- Update booking progress
- Complete service requests

### 👑 Admin Features
- Manage users
- Ban / Unban users
- Manage service categories
- View all bookings
- Monitor platform activities

---

# Role Based Access

| Role | Permissions |
|------|-------------|
| Public | Browse services, technicians, register, login |
| Customer | Booking, payments, reviews |
| Technician | Service management, booking management |
| Admin | User management, category management, platform administration |

---

# Booking Workflow

```text
Customer
    │
    ▼
Create Booking
    │
    ▼
REQUESTED
    │
    ├──────────────► Cancel
    │
Technician Accepts
    │
    ▼
ACCEPTED
    │
Customer Pays
    │
    ▼
PAID
    │
Technician Starts Work
    │
    ▼
IN_PROGRESS
    │
Technician Completes
    │
    ▼
COMPLETED
    │
Customer Reviews Technician
```

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT Access Token
- Refresh Token
- Role-Based Access Control (RBAC)

## Validation

- Zod

## Payment Gateway

- SSLCommerz

## Other Technologies

- Cookie Parser
- CORS
- bcrypt
- UUID
- dotenv


---

# Core Modules

- Authentication
- User Management
- Technician Profiles
- Service Management
- Service Categories
- Booking Management
- Payment Management
- Review System

---

# Security Features

- JWT Authentication
- Refresh Token Rotation
- Password Hashing
- Protected Routes
- Role-Based Authorization
- Request Validation
- Structured Error Responses
- Secure HTTP Cookies

---

# API Documentation

The project includes complete [API documentation](https://mistri-lagbe-backend.vercel.app/api/v1/docs) covering every available endpoint.

You can access the documentation through:

- [OpenCollection Documentation](https://mistri-lagbe-backend.vercel.app/api/v1/docs)

> Individual endpoints are intentionally not listed here to keep this README concise.

---

# Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=
PORT=
APP_URL= important_for_payment_verification

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd mistri-lagbe-backend
```

Install dependencies

```bash
npm install
```

Configure environment variables

```bash
cp .env.example .env
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

(Optional) Seed the database

```bash
npm run seed
```

Start development server

```bash
npm run dev
```

---

# Available Scripts

```bash
npm run dev

npm run build

npm start
```

---

# Business Rules

- Only customers can create bookings.
- Only technicians can create services.
- Admin accounts cannot be created through public registration.
- Customers can cancel only pending bookings.
- Payments are created only after booking acceptance.
- Reviews can only be submitted for eligible completed/paid bookings.
- Only the assigned technician can update booking progress.
- Only administrators can manage users and service categories.

---

# Error Handling

The API follows a consistent error response format.

```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": {}
}
```

---

# Authentication

Most protected endpoints require a JWT Bearer Token.

```
Authorization: Bearer <access_token>
```

Refresh tokens are managed securely through HTTP-only cookies.

---

# Database

Main entities include:

- Users
- Technician Profiles
- Categories
- Services
- Bookings
- Payments
- Reviews

---

# Future Improvements

- Email verification
- Password reset
- Push notifications
- Real-time booking updates
- File uploads
- Advanced search
- Analytics dashboard
- Rate limiting
- Logging & monitoring

---

# Author

**Muhitul Islam Shimanto**

---

# License

This project was developed for educational purposes as part of a backend development assignment.