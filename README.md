# CampusHub - University Campus & Club Management Portal

CampusHub is a modern, comprehensive university campus management web application built with **Next.js 15**, **React 19**, **Tailwind CSS**, and **TypeScript**. It provides role-based portals for students, club officers, faculty coordinators, event heads, and administrators.

---

## 🚀 Features & Role Portals

- **🎓 Student Portal**: Browse campus events & clubs, register for events with dynamic multi-step forms, upload verification documents (College ID, UPI payment screenshots), and access digital tickets/certificates.
- **👑 Club Officers & Presidents**: Propose new events, manage club member rosters, broadcast club announcements, and track participation.
- **⚡ Event Head Dashboard**: Create and manage detailed event proposals, configure dynamic form fields and ticket pricing, upload payment QR codes, and monitor registrations.
- **📋 Faculty Coordinator Portal**: Review, approve, or reject event proposals, monitor club activities, and coordinate event attendance.
- **🛡️ System Admin Portal**: Verify registration payments, review student document uploads, manage user accounts, and view campus-wide analytics.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), `clsx`, `tailwind-merge`
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)

---

## 🏁 Getting Started

Follow these steps to clone and run the project locally:

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm** (comes with Node.js) or **yarn** / **pnpm** / **bun**

### 2. Clone the Repository
```bash
git clone https://github.com/Aryan-singh-ai/Campushub.git
cd Campushub
```

### 3. Install Dependencies
```bash
cd frontend
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore CampusHub.

---

## 🔑 Demo & Test Accounts

You can log in instantly by clicking any profile on the login screen, or use the test credentials below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@university.edu` | `Password123!` |
| **Club President / Officer** | `president@university.edu` | `Password123!` |
| **Head of Event** | `eventhead@university.edu` | `Password123!` |
| **Faculty Coordinator** | `faculty@university.edu` | `Password123!` |
| **System Admin** | `admin@university.edu` | `Password123!` |

*(Note: In custom login, any `@university.edu` email with a password ≥ 6 characters is accepted for local demoing)*

---

## 📂 Project Structure

```text
Campushub/
├── README.md
├── frontend/
│   ├── app/                     # Next.js App Router (pages & layouts)
│   │   ├── (auth)/              # Login and Signup pages
│   │   ├── clubs/               # Club listings & join forms
│   │   ├── dashboard/           # Role-based dashboards
│   │   │   ├── admin/           # Admin portal
│   │   │   ├── event-head/      # Event Head portal
│   │   │   ├── faculty/         # Faculty Coordinator portal
│   │   │   ├── officers/        # Club Officers portal
│   │   │   └── student/         # Student portal
│   │   ├── events/              # Event browse & registration pages
│   │   ├── layout.tsx           # Global app layout
│   │   └── page.tsx             # Landing / Home page
│   ├── components/              # Modular UI & Dashboard components
│   ├── lib/                     # API client, utility functions, mock data
│   ├── providers/               # Authentication & state providers
│   ├── public/                  # Static assets & illustrations
│   └── package.json             # Frontend dependencies & scripts
└── .gitignore
```

---

## 📦 Production Build

To create an optimized production build:

```bash
cd frontend
npm run build
npm start
```
