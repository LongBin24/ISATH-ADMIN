export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-white font-google-sans">
      <div className="mx-auto max-w-xl rounded-4xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-[#003377]">Register</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          User registration is managed via Keycloak SSO.
        </p>
      </div>
    </main>
  );
}
