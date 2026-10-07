# CampusHub - University Campus & Club Management Platform

CampusHub is an enterprise-grade full-stack university management portal engineered with a **Java Spring Boot 3** REST API backend and a high-performance **Next.js 15 & React 19** frontend.

---

## 🏗️ Architecture Overview

CampusHub adopts a decoupled client-server architecture:

```text
┌─────────────────────────────────────────────────────────┐
│              Next.js 15 Frontend (Port 3000)            │
│  React 19 • Tailwind CSS • Framer Motion • Lucide Icons │
└──────────────────────────┬──────────────────────────────┘
                           │ REST / JSON (JWT Bearer Auth)
                           ▼
┌─────────────────────────────────────────────────────────┐
│          Java Spring Boot 3 Backend (Port 8080)         │
│  Spring Security • JPA / Hibernate • H2 / PostgreSQL    │
│  OpenAPI 3 / Swagger UI Documentation                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Features & Portals

- **🎓 Student Portal**: Browse campus events & clubs, submit multi-step registrations, upload student verification IDs and payment screenshots, and access digital tickets.
- **👑 Club Officers & Presidents**: Propose new events, manage club member rosters, publish announcements, and track club participation.
- **⚡ Event Head Dashboard**: Create detailed event proposals, customize dynamic registration form schemas, configure ticket pricing, upload payment QR codes, and monitor attendees.
- **📋 Faculty Coordinator Portal**: Review and approve/reject event proposals with feedback, track club activity, and supervise campus operations.
- **🛡️ System Admin Portal**: Verify student payment transactions, review uploaded receipts, manage user directory roles, and monitor system analytics.

---

## 🛠️ Tech Stack

### Java Backend (`/backend`)
- **Language**: Java 17+ (supports Java 21 & Java 24)
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6 with JJWT (JSON Web Token) authentication
- **ORM & Data**: Spring Data JPA, Hibernate
- **Database**: H2 in-memory (zero setup needed) & PostgreSQL ready
- **API Docs**: Springdoc OpenAPI 3.0 / Swagger UI
- **Build Tool**: Maven (with included `mvnw` wrapper)

### Frontend (`/frontend`)
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion
- **Form Validation**: React Hook Form, Zod

---

## 🏁 Quick Start Guide

### 1. Prerequisites
- **Java**: JDK 17 or higher (`java -version`)
- **Node.js**: v18.18+ or v20+ (`node -v`)
- **Git**

---

### 2. Running the Java Spring Boot Backend

```bash
cd backend

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```

Once started:
- 🌐 **REST API Base URL**: `http://localhost:8080/api`
- 📑 **Interactive Swagger UI Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- 🗄️ **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
  *(JDBC URL: `jdbc:h2:mem:campushub`, Username: `sa`, Password: `password`)*

---

### 3. Running the Next.js Frontend

In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo & Test Accounts

The Java backend automatically seeds the database with predefined role accounts on startup:

| Role | University Email | Password | Access & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@university.edu` | `Password123!` | Event registration, tickets & certificates |
| **Club President** | `president@university.edu` | `Password123!` | Proposals, rosters & announcements |
| **Head of Event** | `eventhead@university.edu` | `Password123!` | Event drafting, form builder & payment QRs |
| **Faculty Coordinator** | `faculty@university.edu` | `Password123!` | Proposal approval & academic oversight |
| **System Admin** | `admin@university.edu` | `Password123!` | Payment verification & user management |

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `POST` | `/api/auth/signup` | Register new university user | Public |
| `GET` | `/api/events` | List all campus events | Public |
| `GET` | `/api/events/{id}` | Get event details & registration form schema | Public |
| `POST` | `/api/events` | Create/publish new event | Event Head / Officer |
| `GET` | `/api/clubs` | List all clubs and societies | Public |
| `POST` | `/api/clubs/{id}/join` | Submit club membership application | Student |
| `POST` | `/api/registrations` | Register for event with document uploads | Student |
| `GET` | `/api/proposals` | List event proposals | Officer / Faculty |
| `PUT` | `/api/proposals/{id}/review` | Approve/reject proposal with feedback | Faculty |
| `GET` | `/api/payments` | List registration payments | Admin |
| `PUT` | `/api/payments/{id}/verify` | Verify or reject payment transaction | Admin |
| `GET` | `/api/admin/stats` | System analytics and metrics | Admin |

---

## 📦 Production Deployment

### Build Java Backend JAR
```bash
cd backend
.\mvnw.cmd clean package -DskipTests
# Run JAR:
java -jar target/campushub-backend-1.0.0.jar
```

### Build Next.js Production Bundle
```bash
cd frontend
npm run build
npm start
```
