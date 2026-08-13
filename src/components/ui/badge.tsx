import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", children, title, ...props }: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900",
    secondary:
      "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
    destructive:
      "border-transparent bg-red-500 text-white dark:bg-red-900 dark:text-slate-50",
    outline:
      "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
  };

  return (
    <span
      data-slot="badge"
      title={title ?? (React.Children.toArray(children).filter((child) => typeof child === "string" || typeof child === "number").join(" ") || undefined)}
      className={cn(
        "inline-flex min-w-0 items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) =>
        typeof child === "string" || typeof child === "number"
          ? <span className="min-w-0 truncate">{child}</span>
          : child
      )}
    </span>
  );
}

export { Badge };
