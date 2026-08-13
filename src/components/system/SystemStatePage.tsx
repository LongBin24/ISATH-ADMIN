"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileQuestion, House, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SystemStatePageProps = {
  kind: "not-found" | "network";
  onRetry?: () => void;
};

export default function SystemStatePage({ kind, onRetry }: SystemStatePageProps) {
  const router = useRouter();
  const notFound = kind === "not-found";
  const Icon = notFound ? FileQuestion : WifiOff;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(254,219,85,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(0,51,119,0.12),transparent_38%)]" />
      <Card className="relative w-full max-w-xl rounded-3xl border-border bg-card/95 shadow-xl dark:shadow-black/30">
        <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="grid size-16 place-items-center rounded-2xl bg-[#FEDB55]/25 text-[#003377] dark:text-[#FEDB55]">
            <Icon className="size-8" />
          </div>

          {notFound && <p className="mt-6 text-5xl font-semibold tracking-tight text-[#003377] dark:text-[#FEDB55]">404</p>}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {notFound ? "Page not found" : "Network connection problem"}
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground">
            {notFound ? "រកមិនឃើញទំព័រ" : "មានបញ្ហាក្នុងការតភ្ជាប់បណ្ដាញ"}
          </p>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            {notFound
              ? "The page may have moved, been removed, or the address may be incorrect."
              : "Check your internet connection, then try loading this page again."}
          </p>

          <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
            <Button variant="outline" className="h-11 rounded-xl" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 size-4" />
              Go back
            </Button>
            {!notFound && (
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => onRetry ? onRetry() : window.location.reload()}>
                <RefreshCw className="mr-2 size-4" />
                Try again
              </Button>
            )}
            <Button className="h-11 rounded-xl bg-[#FEDB55] text-[#003377] hover:bg-[#f0ca43]" onClick={() => router.push("/dashboard")}>
              <House className="mr-2 size-4" />
              Dashboard
            </Button>
          </div>

          {!notFound && (
            <Link href="/" className="mt-6 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Return to the home page
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
