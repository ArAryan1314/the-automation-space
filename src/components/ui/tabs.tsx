import * as React from "react";
import { cn } from "@/lib/utils";

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;
export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl bg-surface p-1.5 border border-border",
        className
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}
export function TabsTrigger({
  className,
  active,
  ...props
}: TabsTriggerProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-card text-primary-hover shadow-soft"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
