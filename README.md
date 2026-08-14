# 🚀 iStash Admin Dashboard

> **"Your documentation is a direct reflection of your software, so hold it to the same standards."**

iStash Admin is a high-performance, professional-grade control center designed to give administrators full oversight of the iStash ecosystem. It bridges advanced AI technology with secure financial management, all tailored specifically for the Khmer language and Cambodian financial landscape.

🌟 **[View Live Demo](https://isath-admin-v2pg-five.vercel.app/dashboard)** | 📖 **[API Documentation](https://ite-api.istashkh.com/v3/api-docs/admin-api)**

---

### 🌟 Highlights
Here are the main selling points of iStash Admin:

*   **🤖 AI-Powered Oversight:** Monitor and fine-tune Claude-powered AI models. Manage features like Khmer OCR (Optical Character Recognition) and Voice-to-Text transcription.
*   **💱 Real-time Currency Sync:** Direct integration with financial providers for automated exchange rate synchronization.
*   **🔔 Smart Alert Engine:** A robust rule-based notification system that keeps users informed via automated triggers and budget warnings.
*   **🔐 Enterprise-Grade Security:** Seamless identity and access management powered by Keycloak.
*   **📱 Ultra-Modern UI/UX:** A clean, minimalist interface built with **Tailwind CSS v4** and **Google Sans** typography.
*   **📂 Scalable Architecture:** Built on a feature-based structure for independent module scaling and easy maintenance.

---

### ℹ️ Overview
iStash Admin Dashboard is the backbone of the iStash financial suite. Built using **Next.js 16 (Turbopack)** and **Redux Toolkit (RTK Query)**, ensuring that data is always fresh and the interface remains responsive.

---

## 📂 Folder Overview

| Folder | Responsibility |
|---------|----------------|
| `src/app/` | Routes, layouts, pages |
| `src/api/` | RTK Query configuration |
| `src/features/` | Business logic |
| `src/components/` | Reusable UI |
| `src/hooks/` | Shared React hooks |
| `src/lib/` | Utilities & Auth |
| `src/redux/` | Store configuration |

---

## 🚀 Getting Started

Step 1: Install dependencies
```bash
npm install
```

Step 2: Configure your environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://ite-api.istashkh.com/api/v1
```

Step 3: Run the project
```bash
npm run dev
```
Navigate to `http://localhost:3000` to begin.

## Deploy to Vercel

1. Import `https://github.com/LongBin24/ISATH-ADMIN` in the Vercel dashboard.
2. Keep the detected framework preset as **Next.js** and the build command as
   `npm run build`.
3. Add every variable from `.env.example` under **Project Settings → Environment
   Variables**. Use real secret values and set these URLs to the production domain:

   ```env
   BETTER_AUTH_URL=https://your-project.vercel.app
   NEXT_PUBLIC_BETTER_AUTH_URL=https://your-project.vercel.app
   ```

4. Add this callback URL to the Keycloak client's allowed redirect URIs:

   ```text
   https://your-project.vercel.app/api/auth/callback/keycloak
   ```

5. Deploy. When adding a custom domain later, update both auth URL variables and
   the Keycloak redirect URI to that domain, then redeploy.

Never commit `.env` files or real secrets. `NEXT_PUBLIC_*` values are included in
the browser bundle and must not contain credentials.
