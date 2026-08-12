
"use client";

import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function safeReturnPath(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const providerError = searchParams.get("authError")
    ? `Keycloak could not complete your sign-in${searchParams.get("status") ? ` (error ${searchParams.get("status")})` : ""}. Please contact your administrator if this continues.`
    : "";
  const returnPath = safeReturnPath(searchParams.get("next"));

  function handleSignIn() {
    setError("");
    const params = new URLSearchParams({ next: returnPath });
    window.location.assign(`/api/keycloak/login?${params.toString()}`);
  }

  return (
    <div className="mt-7 space-y-5">
      <div className="rounded-2xl border border-[#003377]/10 bg-[#003377]/[0.035] p-4">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FFC83D] text-[#003377]"><ShieldCheck className="size-5" /></span>
          <p className="text-sm leading-5 text-slate-600"><span className="block font-bold text-[#003377]">Protected administrator access</span>Authentication is handled securely by Keycloak.</p>
        </div>
      </div>

      {(error || providerError) && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error || providerError}</p>}

      <button type="button" onClick={handleSignIn} className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFC83D] px-5 text-sm font-bold text-[#003377] transition hover:-translate-y-0.5 hover:bg-[#f5b91f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC83D]/35">
        <LockKeyhole className="size-4" />
        Sign in with Keycloak
        <ArrowRight className="size-4" />
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">Use your administrator email and password on the secure Keycloak page. Only authorized iStash administrators can access this portal.</p>
    </div>
  );
}

