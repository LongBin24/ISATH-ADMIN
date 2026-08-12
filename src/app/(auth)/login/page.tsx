import Image from "next/image";
import { Suspense } from "react";
import { ShieldCheck, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";

const highlights = [
  { icon: ShieldCheck, label: "Secure access" },
  { icon: TrendingUp, label: "Smart reporting" },
  { icon: Wallet, label: "Simple management" },
];

export default function LoginPage() {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#f2f6fb_48%,#f8fafc_100%)] text-slate-900">
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
      </div>
    </main>
  );
}