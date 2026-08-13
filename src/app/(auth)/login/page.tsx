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

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[linear-gradient(135deg,#f8fafc_0%,#f2f6fb_48%,#f8fafc_100%)] px-4 text-slate-900">
      <div className="w-full max-w-sm rounded-[1.5rem] border border-[#003377]/10 bg-white/95 p-6 text-center shadow-[0_24px_64px_-32px_rgba(0,51,119,.42)]">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-[#003377]">Sign-in failed</h1>
        <p className="mt-2 text-sm leading-5 text-slate-500">
          Keycloak could not complete your sign-in{status ? ` (error ${status})` : ""}. Please try again or contact your administrator if this continues.
        </p>
        <a
          href={`/api/keycloak/login?${new URLSearchParams({ next }).toString()}`}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFC83D] px-5 text-sm font-bold text-[#003377] transition hover:-translate-y-0.5 hover:bg-[#f5b91f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC83D]/35"
        >
          <LockKeyhole className="size-4" />
          Try signing in again
          <ArrowRight className="size-4" />
        </a>
      </div>
    </main>
  );
}