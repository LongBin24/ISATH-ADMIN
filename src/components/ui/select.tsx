import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({
  placeholder,
  value,
}: {
  placeholder?: string;
  value?: string;
}) {
  return (
    <span className="block truncate text-sm">
      {value !== undefined && value !== "" ? value : placeholder}
    </span>
  );
}

export function SelectContent({
  children,
  value,
  onValueChange,
  className,
}: React.HTMLAttributes<HTMLSelectElement> & {
  value?: string;
  onValueChange?: (val: string) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
        className
      )}
    >
      {children}
    </select>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}
