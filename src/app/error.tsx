"use client";

import { useEffect } from "react";
import SystemStatePage from "@/components/system/SystemStatePage";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return <SystemStatePage kind="network" onRetry={unstable_retry} />;
}
