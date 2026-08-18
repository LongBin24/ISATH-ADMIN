"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useBodyScrollLock(Boolean(open));

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      {/* Centered Modal Container */}
      <div className="relative z-50 my-auto flex w-full justify-center animate-in fade-in-90 zoom-in-95 duration-200">
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogContent({
  className,
  children,
  onClose,
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div
      className={cn(
        "admin-readable relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl dark:shadow-black/40 font-google-sans",
        className
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left border-b border-slate-100 dark:border-slate-800 pb-3 mb-4",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white font-google-sans", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-base text-muted-foreground font-normal font-google-sans", className)}
      {...props}
    />
  );
}

export function DialogClose({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
