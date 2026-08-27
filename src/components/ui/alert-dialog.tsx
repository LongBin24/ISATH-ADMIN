"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  useBodyScrollLock(Boolean(open));

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50 w-full max-w-md my-auto animate-in fade-in-90 zoom-in-95 duration-200">
        {children}
      </div>
    </div>,
    document.body
  );
}

export function AlertDialogContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl font-google-sans",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 text-left", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-bold text-foreground", className)} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-base leading-relaxed text-muted-foreground", className)} {...props} />;
}

export function AlertDialogAction({ className, variant = "default", ...props }: ButtonProps) {
  return <Button className={cn("w-full sm:w-auto", className)} variant={variant} {...props} />;
}

export function AlertDialogCancel({ className, ...props }: ButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full sm:w-auto", className)}
      {...props}
    />
  );
}
