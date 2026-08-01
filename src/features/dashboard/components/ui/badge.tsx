import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "outline"
          ? "border-slate-200 text-slate-700"
          : "bg-slate-900 text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export { Badge };
export default Badge;
