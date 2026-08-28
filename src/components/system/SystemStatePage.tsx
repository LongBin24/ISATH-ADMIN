"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileQuestion, House, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminI18n } from "@/i18n/admin-i18n";

type SystemStatePageProps = {
  kind: "not-found" | "network";
  onRetry?: () => void;
};

export default function SystemStatePage({ kind, onRetry }: SystemStatePageProps) {
  const router = useRouter();
  const { t } = useAdminI18n();
  const notFound = kind === "not-found";
  const Icon = notFound ? FileQuestion : WifiOff;

  function handleGoBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 font-google-sans">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(254,219,85,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(0,51,119,0.12),transparent_38%)]"
      />
      <Card className="relative w-full max-w-xl rounded-3xl border-border bg-card/95 shadow-xl dark:shadow-black/30">
        <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="grid size-16 place-items-center rounded-2xl bg-[#FEDB55]/25 text-[#003377] dark:text-[#FEDB55]">
            <Icon className="size-8" />
          </div>

          {notFound && (
            <p className="mt-6 text-5xl font-semibold tracking-tight text-[#003377] dark:text-[#FEDB55]">
              404
            </p>
          )}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {notFound ? t("Page not found") : t("Network connection problem")}
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            {notFound
              ? t("The page may have moved, been removed, or the address may be incorrect.")
              : t("Check your internet connection, then try loading this page again.")}
          </p>

          <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={handleGoBack}
            >
              <ArrowLeft className="mr-2 size-4" />
              {t("Go back")}
            </Button>
            {!notFound && (
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => (onRetry ? onRetry() : window.location.reload())}
              >
                <RefreshCw className="mr-2 size-4" />
                {t("Try again")}
              </Button>
            )}
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FEDB55] px-5 text-sm font-semibold text-[#003377] transition hover:bg-[#f0ca43]"
            >
              <House className="mr-2 size-4" />
              {t("Dashboard")}
            </Link>
          </div>

          {!notFound && (
            <Link
              href="/"
              className="mt-6 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("Return to the home page")}
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
