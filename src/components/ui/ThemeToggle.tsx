"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "solid" | "pill";
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  size = "md",
  variant = "ghost",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    toggleTheme(e);
  };

  const isDark = mounted ? theme === "dark" : false;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl font-google-sans cursor-pointer transition-colors duration-150 active:scale-95 focus:outline-none focus-visible:outline-none focus:ring-0 select-none",
        size === "sm" && "h-8 px-2.5 text-xs gap-1.5",
        size === "md" && "size-9 p-0",
        size === "lg" && "h-11 px-4 text-sm gap-2",
        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100 hover:text-[#003377] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]",
        variant === "outline" &&
          "border border-slate-200/80 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-[#003377] dark:border-slate-800 dark:bg-[#0b1120] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]",
        variant === "solid" &&
          "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-[#111d35] dark:text-[#FFC83D] dark:hover:bg-[#172554]",
        variant === "pill" &&
          "rounded-full border border-slate-200/80 bg-white/90 px-3.5 py-1.5 shadow-sm hover:bg-slate-100 hover:text-[#003377] dark:border-slate-800 dark:bg-[#0b1120] dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]",
        className
      )}
    >
      <div className="relative flex items-center justify-center pointer-events-none">
        {isDark ? (
          <Sun
            className={cn(
              "shrink-0 transition-colors duration-150",
              size === "sm" ? "size-4" : size === "lg" ? "size-5" : "size-[18px]"
            )}
          />
        ) : (
          <Moon
            className={cn(
              "shrink-0 transition-colors duration-150",
              size === "sm" ? "size-4" : size === "lg" ? "size-5" : "size-[18px]"
            )}
          />
        )}
      </div>

      {showLabel && mounted && (
        <span className="text-xs font-semibold select-none pointer-events-none">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
