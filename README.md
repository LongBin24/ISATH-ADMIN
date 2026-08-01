# 💰 IStash - Personal Finance Management System

A modern personal finance management platform built with **Next.js**, **TypeScript**, **Redux Toolkit Query**, and **Spring Boot**.

Manage your finances smarter with budgeting, analytics, OCR, and an AI-powered assistant.

---

## ✨ Features

- 💵 Income Management
- 💸 Expense Tracking
- 👛 Wallet Management
- 📊 Budget Planning
- 🎯 Saving Goals
- 📈 Financial Reports
- 🤖 AI Chatbot Assistant
- ⚙️ User Preferences & Settings

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Redux Toolkit + RTK Query
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Better Auth

### Backend
- Spring Boot REST API
- PostgreSQL
- JWT / Session Authentication

---

## 📁 Project Structure

```text
istash/
├── public/
├── src/
│   ├── app/
│   ├── api/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── redux/
│   ├── constants/
│   ├── types/
│   ├── config/
│   └── styles/
```

---

## 🏗 Architecture

Feature-based architecture.

Each feature contains its own:

- API
- Redux State
- Types
- Validation
- Hooks
- Components

Example:

```text
features/income/
├── api.ts
├── slice.ts
├── types.ts
├── schema.ts
├── hooks.ts
└── components/
```

---

## 📂 Folder Overview

| Folder | Responsibility |
|---------|----------------|
| `app/` | Routes, layouts, pages |
| `api/` | RTK Query configuration |
| `features/` | Business logic |
| `components/` | Reusable UI |
| `hooks/` | Shared React hooks |
| `lib/` | Utilities & Auth |
| `redux/` | Store configuration |
| `constants/` | Static values |
| `types/` | Global TypeScript types |
| `config/` | App & environment settings |

---

## ⚙️ Environment

Create `.env.local`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080/api
BETTER_AUTH_SECRET=your-secret
```

---

## 🚀 Getting Started

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production

```bash
npm run build
npm run start
```

---

## 🌿 Git Workflow

Create a feature branch

```bash
git checkout -b feature/feature-name
```

Commit format

```text
feat:
fix:
refactor:
docs:
style:
test:
```

Example

```text
feat: add chatbot feature
fix: wallet balance calculation
docs: update README
```

---

## 👥 Team Rules

- Keep feature logic inside its own module.
- Share reusable code through `components`, `hooks`, `lib`, and `types`.
- All API requests must use **RTK Query** via `api/baseApi.ts`.

---

## 🔐 Authentication

```text
User
   │
 Login
   │
Better Auth
   │
 Session
   │
Middleware
   │
Dashboard
```

---

## 🤖 AI Chatbot

IStash includes an AI-powered chatbot to help users:

- 💬 Answer finance-related questions
- 📊 Explain spending insights
- 💡 Provide budgeting tips
- 🎯 Recommend saving strategies
- 🔍 Assist with navigating the application

---

## 📄 License

Private Project © IStash"# istash-admin" 
