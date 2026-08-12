// export default function LoginPage() {
//   return (
//     <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
//       <div className="mx-auto max-w-xl rounded-4xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//         <h1 className="text-3xl font-bold text-[#003377]">Login</h1>
//         <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
//           This page is currently a placeholder.
//         </p>
//       </div>
//     </main>
//   );
// }


// "use client"
// import { authClient } from "../../../lib/auth/auth-client";

// export default function AdminLoginPage() {
//     const loginWithSSO = async () => {
//         await authClient.signIn.social({
//             provider: "keycloak",
//             callbackURL: "/dashboard",
//         });
//     };

//     return (
//         <div className="flex h-screen items-center justify-center bg-gray-100">
//             <div className="p-8 bg-white shadow-lg rounded-xl text-center">
//                 <h1 className="text-2xl font-bold mb-4">iStash Admin Panel</h1>
//                 <button 
//                     onClick={loginWithSSO}
//                     className="bg-[#003377] text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
//                 >
//                     Login with iStash SSO
//                 </button>
//             </div>
//         </div>
//     );
// }  

import { Suspense } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { AdminLoginForm } from '@/features/auth/components/login-form';

export default function AdminLoginPage() {
  return (
    <AuthShell>
      <AuthCard
        title="Admin Dashboard"
        description="សូមស្វាគមន៍អ្នករដ្ឋបាល! សូមផ្ទៀងផ្ទាត់អត្តសញ្ញាណរបស់អ្នកដើម្បីបន្តទៅកាន់ផ្ទាំងគ្រប់គ្រង iStash API & AI Configuration។"
      >
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC83D] border-t-transparent"></div>
             <p className="text-sm text-slate-500 animate-pulse">កំពុងរៀបចំប្រព័ន្ធសុវត្ថិភាព Admin...</p>
          </div>
        }>
          <AdminLoginForm />
        </Suspense>
      </AuthCard>
    </AuthShell>
  );
}