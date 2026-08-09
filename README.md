# 🚀 iStash Admin Dashboard

> **The professional control center for Cambodia's smartest financial management platform.**

iStash Admin is a high-performance dashboard designed to give administrators full oversight of the iStash ecosystem. It bridges advanced AI technology with secure financial management, all tailored for the Khmer language.

🌟 **[View Demo](https://isath-admin-v2pg-five.vercel.app/dashboard)** | 📖 **[API Documentation](https://ite-api.istashkh.com/v3/api-docs/admin-api)**

---

### 🌟 Highlights
- **🤖 AI-Powered Oversight:** Monitor and configure Claude-powered AI features including Khmer OCR and Voice-to-Text.
- **💱 Live Currency Sync:** Real-time exchange rate management with direct synchronization from official providers (NBC).
- **🔔 Smart Alert Engine:** Rule-based notification system to keep users informed via automated triggers.
- **🔐 Enterprise Security:** Seamless identity management powered by **Keycloak** and **Better Auth**.
- **📱 Ultra-Modern UI:** Clean, minimalist interface built with **Tailwind CSS v4** and **Google Sans** typography.

---

### ℹ️ Overview
iStash Admin Dashboard is the backbone of the iStash financial suite. Built with **Next.js 15/16** and **RTK Query**, the dashboard is optimized for speed and reliability. It follows a feature-based architecture, making it easy for developers to scale individual modules.

---

### 🛠 Tech Stack
| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15/16 (App Router) |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit (RTK Query) |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui |
| **Auth** | Better Auth & Keycloak |

---

### 📂 Project Structure
```text
src/
├── app/               # Next.js Pages & Routing
├── features/          # Core Business Logic (api, types, components)
│   ├── dashboard/
│   ├── currencies/
│   └── notifications/
├── components/        # Shared UI (Sidebar, Navbar)
└── redux/             # Store Configuration
🚀 Getting Started
1. Clone the project
code
Bash
git clone https://github.com/your-username/istash-admin.git
cd istash-admin
2. Install dependencies
code
Bash
npm install
3. Set up environment variables
Create a .env.local file:
code
Env
NEXT_PUBLIC_API_URL=https://ite-api.istashkh.com/api/v1
4. Run the app
code
Bash
npm run dev
✍️ Authors
Created with ❤️ by the iStash Development Team.
