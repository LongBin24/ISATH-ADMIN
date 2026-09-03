# iStash Admin

<p align="center">
  <img
    src="./public/istash-logo.png"
    alt="iStash Logo"
    width="150"
  />
</p>

<p align="center">
  <strong>Smart financial administration, from one powerful dashboard.</strong>
</p>

<p align="center">
  <a href="#-what-is-istash-admin">What is iStash?</a> •
  <a href="#-features">Features</a> •
  <a href="#-platform-preview">Preview</a> •
  <a href="#-getting-started-developers">Getting Started</a> •
  <a href="#-project-structure">Structure</a>
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=flat-square&logo=redux)
![Keycloak](https://img.shields.io/badge/Keycloak-OIDC-4D4D4D?style=flat-square&logo=keycloak)

</p>

---

## What is iStash Admin?

iStash Admin is a centralized administration platform built for the
**iStash financial ecosystem**.

It provides administrators with a secure and intelligent workspace to
manage users, monitor system activity, configure AI-powered services,
manage currencies, control notifications, review audit logs, and
analyze financial information.

The platform brings essential financial administration tools together
in one modern dashboard — helping teams **manage operations, understand
data, and make better decisions**.

### Core principles

- **Visibility** — understand what is happening across the platform.
- **Control** — manage users, services, and system configuration.
- **Intelligence** — use data and AI to support better decisions.

---

## Live Application

🔗 **Admin Portal:**  
[Open iStash Admin](https://isath-admin.vercel.app/)

> Access may require administrator authentication through the
> configured identity provider.

---

# Features

### 📊 Dashboard & Analytics

A centralized overview of the iStash ecosystem.

- User statistics
- System activity
- Financial overview
- User distribution
- System health monitoring
- Currency provider status
- Operational metrics
- Visual data analysis

---

### 👥 User Management

Manage and monitor users from a centralized administration interface.

- View users
- Search and filter users
- User profile information
- Account status
- Account activation / deactivation
- User lifecycle management
- Administrative actions

---

### 🤖 AI Configuration

Configure intelligent financial assistance from the administration
dashboard.

- AI service configuration
- Prompt management
- AI settings
- OCR-related configuration
- AI metrics
- Intelligent financial assistance

---

### 💱 Currency Management

Manage currencies and synchronize exchange-rate information.

- View supported currencies
- Activate / deactivate currencies
- Exchange-rate synchronization
- Provider status
- Synchronization status
- Currency configuration

---

### 🔔 Smart Notifications

Manage communication between the platform and users.

- Notification management
- Broadcast notifications
- Notification activity
- Delivery status
- Mark as seen
- Delivery retry
- Activity summaries

---

### 🧾 Audit Logs

Track important administrative actions across the platform.

- User activity
- Entity changes
- Administrative operations
- Resource-level actions
- Audit history
- System accountability

> **Who did what, when, and to which resource?**

---

### 📈 Reports

Analyze financial and operational information.

- Income reports
- Expense reports
- Budget reports
- Financial summaries
- Data export

---

### 🏷️ Categories

Manage financial categories used throughout the iStash ecosystem.

- Category management
- Category configuration
- Category organization
- Financial classification

---

### 💬 Feedback & Contact Management

Manage communication received from users.

- User feedback
- Contact requests
- Submission management
- Review and response workflows

---

### ⚙️ Settings & Profile

Personalize and configure the administration experience.

- Administrator profile
- Profile editing
- Avatar management
- Appearance settings
- Currency preferences
- Notification preferences
- Password management

---

### 🔐 Secure Authentication

Enterprise-oriented authentication and identity management.

- Keycloak integration
- Better Auth
- OpenID Connect (OIDC)
- OAuth authentication
- Protected routes
- Secure sessions
- Identity provider integration

---

### 🌐 Khmer & English

Designed for a localized Cambodian financial ecosystem.

- 🇰🇭 Khmer
- 🇬🇧 English
- Internationalization-ready architecture

---

# Platform Preview

The iStash Admin interface is designed around a clean,
modern **Fintech / Enterprise SaaS** experience.

### Dashboard

<p align="center">
  <img
    src="./public/readme/dashboard.png"
    alt="iStash Admin Dashboard"
    width="100%"
  />
</p>

The dashboard provides administrators with an at-a-glance view of
users, alerts, reviews, notifications, and overall system health.

### User Management

<p align="center">
  <img
    src="./public/readme/user-management.png"
    alt="iStash User Management"
    width="100%"
  />
</p>

### AI Configuration

<p align="center">
  <img
    src="./public/readme/ai-config.png"
    alt="iStash AI Configuration"
    width="100%"
  />
</p>

### Currency Management

<p align="center">
  <img
    src="./public/readme/currencies.png"
    alt="iStash Currency Management"
    width="100%"
  />
</p>

> Add the corresponding screenshots to
> `public/readme/` before publishing the README.

---

# Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| Frontend | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State Management | Redux Toolkit |
| API Client | Axios |
| Authentication | Better Auth + Keycloak |
| Validation | Zod |
| Forms | React Hook Form |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React + Iconify |
| Notifications | Sonner + React Hot Toast |
| Theme | next-themes |
| Date Utilities | date-fns |
| Code Quality | ESLint |

---

# Architecture

iStash Admin uses a **feature-based architecture** with the
**Next.js App Router**.

```text
                        iStash Admin
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          UI Layer      Feature Layer    API Layer
              │              │              │
              │              │              │
        Components       Business Logic     Axios
        Layouts          State Management   API Routes
        UI Elements      Validation         Auth
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                     iStash Backend
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           Users         Financial       Notification
          Services        Services          Services

          Project Structure

          .
├── public/
│   ├── categories/              # Category assets
│   ├── fonts/                   # Font assets
│   ├── icons/                   # Application icons
│   └── readme/                  # README screenshots
│
├── src/
│   │
│   ├── api/                     # API clients and integrations
│   │
│   ├── app/                     # Next.js App Router
│   │   │
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/         # Protected admin application
│   │   │   ├── dashboard/
│   │   │   ├── user-manager/
│   │   │   ├── notifications/
│   │   │   ├── currencies/
│   │   │   ├── categories/
│   │   │   ├── audit-logs/
│   │   │   ├── reports/
│   │   │   ├── ai-config/
│   │   │   ├── alert/
│   │   │   ├── feedback/
│   │   │   ├── contact-us/
│   │   │   ├── profile/
│   │   │   ├── search/
│   │   │   └── settings/
│   │   │
│   │   └── api/                 # API route handlers
│   │       ├── auth/
│   │       ├── keycloak/
│   │       └── v1/
│   │
│   ├── components/
│   │   ├── common/              # Shared components
│   │   ├── layout/              # Layout components
│   │   ├── pwa/                 # PWA components
│   │   ├── system/              # System components
│   │   └── ui/                  # Reusable UI components
│   │
│   ├── config/                  # Application configuration
│   ├── constants/               # Shared constants
│   │
│   ├── features/                # Feature-based modules
│   │   ├── ai-config/
│   │   ├── alert/
│   │   ├── audit-logs/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── contact-us/
│   │   ├── currencies/
│   │   ├── dashboard/
│   │   ├── feedback/
│   │   ├── notifications/
│   │   ├── profile/
│   │   ├── reports/
│   │   ├── search/
│   │   ├── settings/
│   │   └── user-manager/
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # Internationalization
│   │
│   ├── lib/                     # Shared utilities
│   │   └── auth/
│   │
│   ├── redux/                   # Redux store and state
│   ├── styles/                  # Global styles
│   └── types/                   # Shared TypeScript types
│
├── .env.example                 # Environment template
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md

Getting Started (Developers)
Prerequisites
Node.js
npm
Git

Check your installed versions:

node --version
npm --version
git --version

Installation
1. Clone the repository
git clone <repository-url>
cd istash
2. Install dependencies
npm install
3. Configure environment variables

Create a local environment file:

cp .env.example .env.local

Configure the required variables.

4. Start the development server
npm run dev

Open:

http://localhost:3000
Environment Variables

Create a .env.local file with the following configuration.

Never commit real credentials, API keys, OAuth secrets, or
authentication secrets to GitHub.

Variable	Description
NEXT_PUBLIC_API_URL	Frontend API base path
BACKEND_URL	Backend API URL
NEXT_PUBLIC_KEYCLOAK_ISSUER	Keycloak realm issuer
KEYCLOAK_CLIENT_ID	Keycloak client ID
KEYCLOAK_CLIENT_SECRET	Keycloak client secret
KEYCLOAK_FRONTEND_CALLBACK_URL	Authentication callback URL
BETTER_AUTH_URL	Better Auth application URL
NEXT_PUBLIC_BETTER_AUTH_URL	Public Better Auth URL
BETTER_AUTH_SECRET	Better Auth session secret
GOOGLE_CLIENT_ID	Google OAuth client ID
GOOGLE_CLIENT_SECRET	Google OAuth client secret
FACEBOOK_CLIENT_ID	Facebook OAuth client ID
FACEBOOK_CLIENT_SECRET	Facebook OAuth client secret
KEYCLOAK_GOOGLE_IDP_ALIAS	Keycloak Google provider alias
KEYCLOAK_FACEBOOK_IDP_ALIAS	Keycloak Facebook provider alias

Example:

NEXT_PUBLIC_API_URL=/api
BACKEND_URL=<backend-api-url>

NEXT_PUBLIC_KEYCLOAK_ISSUER=<keycloak-issuer>

KEYCLOAK_CLIENT_ID=<client-id>
KEYCLOAK_CLIENT_SECRET=<client-secret>

KEYCLOAK_FRONTEND_CALLBACK_URL=<callback-url>

BETTER_AUTH_URL=<application-url>
NEXT_PUBLIC_BETTER_AUTH_URL=<application-url>

BETTER_AUTH_SECRET=<secret>

GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

FACEBOOK_CLIENT_ID=<facebook-client-id>
FACEBOOK_CLIENT_SECRET=<facebook-client-secret>

KEYCLOAK_GOOGLE_IDP_ALIAS=google
KEYCLOAK_FACEBOOK_IDP_ALIAS=facebook
Available Scripts
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Clean Next.js cache
npm run clean
Command	Description
npm run dev	Start development server
npm run build	Create production build
npm run start	Start production server
npm run lint	Run ESLint
npm run clean	Remove .next cache
Authentication

iStash Admin uses a centralized authentication architecture.

                         User
                           │
                           ▼
                    ┌──────────────┐
                    │ iStash Admin │
                    └──────┬───────┘
                           │
                           ▼
                     ┌───────────┐
                     │ Keycloak  │
                     └─────┬─────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Google       Facebook     Keycloak
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                       OIDC / OAuth
                           │
                           ▼
                    ┌─────────────┐
                    │ Better Auth │
                    └──────┬──────┘
                           │
                           ▼
                    Secure Session
                           │
                           ▼
                  Protected Dashboard
API Architecture

The frontend communicates with backend services through a structured
API layer.

UI Components
      │
      ▼
Feature Modules
      │
      ▼
API Layer
      │
      ▼
Axios
      │
      ▼
Next.js API Routes
      │
      ▼
Backend API

This approach keeps UI components separated from backend
implementation details.

Design System

iStash Admin follows a modern Fintech / Enterprise SaaS design
language.

Visual Direction
Clean
Minimal
Professional
Data-focused
Responsive
Accessible
Modern
Enterprise-ready
Brand Colors
Role	Color
Primary	#FFC83D
Secondary	#003377
Background	#F8F9FA
Design Philosophy

Trust + Intelligence + Financial Precision

Security

Security is a fundamental part of iStash Admin.

Security practices
Protected administrative routes
Keycloak-based identity management
Better Auth session management
OAuth / OIDC authentication
Input validation
Server-side authorization
Environment-based secrets
No credentials stored in source code

Important: If a real secret has ever been exposed in a public
repository, revoke and regenerate it immediately.

Troubleshooting
Authentication problems

Check:

Keycloak issuer URL
Client ID
Client secret
Redirect / callback URL
Better Auth configuration
Identity provider configuration
API errors

Check:

BACKEND_URL
API availability
Authentication token
Backend response
Network connection
Build errors

Try:

npm run clean
npm install
npm run build
Lint errors

Run:

npm run lint

and fix the reported ESLint issues.

Development Workflow

The project uses a feature-based Git workflow.

develop
   │
   ├── feature/dashboard
   ├── feature/user-management
   ├── feature/notification
   ├── feature/currency
   └── feature/ai-config

Create a feature branch:

git switch develop
git pull origin develop
git switch -c feature/<feature-name>

Commit changes:

git add .
git commit -m "feat: add <feature-name>"

Push your branch:

git push origin feature/<feature-name>

Then create a Pull Request targeting develop.

Roadmap
 Advanced analytics
 AI-powered financial insights
 Advanced role and permission management
 Real-time system monitoring
 Advanced notification automation
 Expanded financial reporting
 Additional localization
 Automated testing
 Performance monitoring
 System health monitoring
Contributing

Contributions are welcome.

Fork the repository
Create a feature branch
Make your changes
Run lint and build checks
Commit your changes
Push your branch
Open a Pull Request

Please follow the existing project architecture and coding conventions.

Project Information
	
Project	iStash Admin
Type	Financial Administration Platform
Framework	Next.js
Language	TypeScript
Architecture	Feature-Based Architecture
Authentication	Keycloak + Better Auth
UI	React + Tailwind CSS
State	Redux Toolkit
Status	Private Project
License

This project is currently private and intended for authorized
development and administration purposes.

<p align="center"> <img src="./public/istash-logo.png" alt="iStash Logo" width="100" /> </p> <h3 align="center">iStash Admin</h3> <p align="center"> <strong>Manage Better. Understand Faster. Decide Smarter.</strong> </p> <p align="center"> Built with Next.js · TypeScript · Tailwind CSS · Redux Toolkit · Keycloak </p> <p align="center"> © iStash. All rights reserved. </p> ```
Recommended GitHub layout

To make it look close to the FluxiBiz README you showed, I recommend adding these files:

istash/
│
├── public/
│   ├── istash-logo.png
│   │
│   └── readme/
│       ├── dashboard.png
│       ├── user-management.png
│       ├── ai-config.png
│       └── currencies.png
│
├── src/
├── .env.example
├── package.json
└── README.md
