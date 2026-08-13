"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOptionalAdminI18n } from "@/i18n/admin-i18n";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

interface SelectContextValue {
  value: string;
  open: boolean;
  listboxId: string;
  setOpen: (open: boolean) => void;
  select: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Select components must be used within <Select>");
  return context;
}

export function Select({ value = "", onValueChange, children, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const select = React.useCallback((nextValue: string) => {
    onValueChange?.(nextValue);
    setOpen(false);
  }, [onValueChange]);

  return (
    <SelectContext.Provider value={{ value, open, listboxId, setOpen, select }}>
      <div ref={rootRef} className={cn("relative inline-block w-full sm:w-auto", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const { open, listboxId, setOpen } = useSelectContext();
  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-controls={listboxId}
      aria-expanded={open}
      aria-haspopup="listbox"
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors hover:border-primary/40 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={(event) => {
        setOpen(!open);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
      <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder, value }: { placeholder?: string; value?: string }) {
  const i18n = useOptionalAdminI18n();
  const display = value !== undefined && value !== "" ? value : placeholder;
  return (
    <span className={cn("block truncate text-left", !display && "text-muted-foreground")}>
      {typeof display === "string" ? i18n?.t(display) ?? display : display}
    </span>
  );
}

export function SelectContent({ children, className }: React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const { open, listboxId } = useSelectContext();
  if (!open) return null;
  return (
    <div
      id={listboxId}
      role="listbox"
      className={cn(
        "absolute left-0 top-full z-50 mt-1.5 max-h-72 min-w-full overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const i18n = useOptionalAdminI18n();
  const context = useSelectContext();
  const selected = context.value === value;
  const label = typeof children === "string" ? i18n?.t(children) ?? children : children;
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
        selected && "bg-accent font-medium text-accent-foreground"
      )}
      onClick={() => context.select(value)}
    >
      <span className="min-w-0 truncate">{label}</span>
      <Check className={cn("size-4 shrink-0", selected ? "opacity-100" : "opacity-0")} />
    </button>
  );
}
