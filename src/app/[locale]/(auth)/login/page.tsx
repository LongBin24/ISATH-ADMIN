import { AlertTriangle, ArrowRight, LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";

function safeReturnPath(value: string | string[] | undefined): string {
  const path = Array.isArray(value) ? value[0] : value;
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/welcome";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);

  // No custom sign-in screen: go straight to Keycloak's hosted login page.
  // Only stop here if Keycloak just sent the user back with an error, so
  // they aren't bounced through a silent redirect loop.
  if (!params.authError) {
    redirect(`/api/keycloak/login?${new URLSearchParams({ next }).toString()}`);
  }

  const status = Array.isArray(params.status) ? params.status[0] : params.status;
  const authError = Array.isArray(params.authError) ? params.authError[0] : params.authError;

  let title = "Sign-in failed";
  let message = "Could not complete your sign-in. Please try again or contact your administrator.";

  if (authError === "unauthorized" || status === "403") {
    title = "Access Denied";
    message = "Invalid email or account does not have Administrator privileges. Please sign in with an authorized Admin account.";
  } else if (authError === "keycloak" || status === "401") {
    title = "Invalid Email or Password";
    message = "Invalid email or password. Please verify your credentials and try signing in again.";
  } else if (authError === "configuration") {
    title = "Configuration Error";
    message = "Authentication service configuration is missing. Please contact your administrator.";
  }

  return (
<<<<<<< HEAD:src/app/(auth)/login/page.tsx
    <main className="grid min-h-[100dvh] place-items-center bg-[linear-gradient(135deg,#f8fafc_0%,#f2f6fb_48%,#f8fafc_100%)] px-4 text-slate-900 font-['Google_Sans',ui-sans-serif,system-ui]">
      <div className="w-full max-w-sm rounded-[1.5rem] border border-[#003377]/10 bg-white/95 p-6 text-center shadow-[0_24px_64px_-32px_rgba(0,51,119,.42)]">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-[#003377]">{title}</h1>
        <p className="mt-2 text-sm leading-5 text-slate-500">
          {message}
        </p>
        <a
          href={`/api/keycloak/logout?${new URLSearchParams({ next }).toString()}`}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFC83D] px-5 text-sm font-bold text-[#003377] transition hover:-translate-y-0.5 hover:bg-[#f5b91f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC83D]/35"
        >
          <LockKeyhole className="size-4" />
          Try signing in again
          <ArrowRight className="size-4" />
        </a>
=======
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#f2f6fb_48%,#f8fafc_100%)] text-slate-900 font-google-sans">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 opacity-70 [background-image:linear-gradient(to_right,#0033770d_1px,transparent_1px),linear-gradient(to_bottom,#0033770d_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-52 -top-48 -z-10 size-[42rem] rounded-full bg-[#FFC83D]/18 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-64 right-[18%] -z-10 size-[46rem] rounded-full bg-[#2769ad]/12 blur-[140px]" />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden overflow-hidden border-r border-[#9eb7d0] bg-[linear-gradient(145deg,#cbdced_0%,#d9e6f3_52%,#c7daec_100%)] px-10 py-7 text-[#003377] lg:flex lg:flex-col xl:px-14">
          <div aria-hidden="true" className="absolute inset-0 opacity-35 [background-image:radial-gradient(#003377_0.8px,transparent_0.9px)] [background-size:24px_24px] [mask-image:radial-gradient(circle_at_50%_37%,black,transparent_72%)]" />
          <div aria-hidden="true" className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-[#FFC83D]/25 blur-[110px]" />
          <div aria-hidden="true" className="absolute -bottom-52 -right-36 size-[38rem] rounded-full bg-[#2b72bb]/15 blur-[120px]" />

          <div className="relative z-10 flex items-center gap-3 text-lg font-bold">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#FFC83D] text-[#003377] shadow-[0_8px_22px_-10px_rgba(255,200,61,.8)]">iS</span>
            iStash Admin
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center text-center">
            <div className="relative grid size-[20rem] place-items-center">
              <div aria-hidden="true" className="absolute inset-0 animate-[spin_22s_linear_infinite] rounded-full border border-[#003377]/20"><span className="absolute left-1/2 top-0 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#003377] text-[#FFC83D]"><ShieldCheck className="size-5" /></span></div>
              <div aria-hidden="true" className="absolute inset-8 animate-[spin_17s_linear_infinite_reverse] rounded-full border border-[#FFC83D]/60"><span className="absolute right-0 top-1/2 grid size-11 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#FFC83D] text-[#003377]"><TrendingUp className="size-5" /></span></div>
              <div aria-hidden="true" className="absolute inset-16 animate-[spin_12s_linear_infinite] rounded-full border border-[#003377]/15"><span className="absolute bottom-[8%] left-[8%] grid size-9 place-items-center rounded-full bg-white text-[#003377] shadow-lg"><Wallet className="size-4" /></span></div>
              <div aria-hidden="true" className="absolute size-48 animate-pulse rounded-full bg-[#FFC83D]/60 blur-2xl" />
              <div className="relative z-10 grid size-28 place-items-center rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_28px_70px_-20px_rgba(0,51,119,.35)]">
                <Image src="/logo.png" alt="iStash" width={80} height={80} priority className="size-full object-contain" />
                <span className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-[#FFC83D] text-[#003377] shadow-lg"><Sparkles className="size-4" /></span>
              </div>
            </div>

            <p className="mt-7 text-sm font-bold text-[#b57900]">ADMINISTRATOR PORTAL</p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.24] tracking-[-0.035em]">Manage iStash<br /><span className="relative inline-block">with confidence<span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#FFC83D]" /></span></h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-slate-600">Securely manage users, reporting, platform settings, and your iStash workspace.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {highlights.map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-2 rounded-full border border-[#003377]/10 bg-white/65 px-3 py-2 text-[10px] font-bold shadow-sm backdrop-blur"><span className="grid size-6 place-items-center rounded-full bg-[#FFC83D]"><Icon className="size-3.5" /></span>{label}</div>)}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-600"><p>Copyright {new Date().getFullYear()} iStash</p><p className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,.8)]" />System operational</p></div>
        </aside>

        <section className="relative flex min-h-[100dvh] items-center justify-center overflow-y-auto px-4 py-5 sm:px-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,#0033770d_1px,transparent_1px),linear-gradient(to_bottom,#0033770d_1px,transparent_1px)] [background-size:48px_48px]" />
          <div aria-hidden="true" className="pointer-events-none absolute size-[28rem] rounded-full bg-[#003377]/[.055] blur-[90px]" />
          <div className="relative z-10 w-full max-w-[27rem] rounded-[1.5rem] border border-[#003377]/10 bg-white/[.9] p-5 shadow-[0_24px_64px_-32px_rgba(0,51,119,.42)] ring-1 ring-white/70 backdrop-blur-xl sm:p-6">
            <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFC83D] to-transparent" />
            <div className="mb-5 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-2xl bg-[#FFC83D] font-black text-[#003377]">iS</span><span className="text-lg font-bold text-[#003377]">iStash Admin</span></div>
            <p className="text-sm font-bold tracking-[.14em] text-[#b57900]">ADMIN SIGN IN</p>
            <h2 className="mt-2 text-[1.8rem] font-bold tracking-[-.025em] text-[#003377]">Welcome back</h2>
            <p className="mt-1.5 text-sm leading-5 text-slate-500">Sign in securely through Keycloak to continue to the administrator portal.</p>
            <Suspense fallback={<p className="mt-8 text-center text-sm text-slate-500">Preparing secure sign in...</p>}><LoginForm /></Suspense>
          </div>
        </section>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f:src/app/[locale]/(auth)/login/page.tsx
      </div>
    </main>
  );
}
