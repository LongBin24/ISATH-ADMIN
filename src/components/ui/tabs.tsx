"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useOptionalAdminI18n } from "@/i18n/admin-i18n";

type TabsContextValue = { value: string; onValueChange: (value: string) => void };
const TabsContext = React.createContext<TabsContextValue | null>(null);

function Tabs({ value, defaultValue, onValueChange, className, children }: { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; className?: string; children: React.ReactNode }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const current = value ?? internalValue;
  const update = (next: string) => { setInternalValue(next); onValueChange?.(next); };
  return <TabsContext.Provider value={{ value: current, onValueChange: update }}><div className={className}>{children}</div></TabsContext.Provider>;
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role="tablist" className={cn("inline-flex h-10 items-center rounded-xl bg-muted p-1 text-muted-foreground", className)} {...props} />; }
function TabsTrigger({ value, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) { const context = React.useContext(TabsContext); const i18n = useOptionalAdminI18n(); const active = context?.value === value; return <button type="button" role="tab" aria-selected={active} onClick={() => context?.onValueChange(value)} className={cn("rounded-lg px-4 py-1.5 text-sm font-medium transition", active && "bg-card text-foreground shadow-sm", className)} {...props}>{typeof children === "string" ? i18n?.t(children) ?? children : children}</button>; }
function TabsContent({ value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) { const context = React.useContext(TabsContext); if (context?.value !== value) return null; return <div role="tabpanel" className={cn("mt-4", className)} {...props} />; }

export { Tabs, TabsList, TabsTrigger, TabsContent };
