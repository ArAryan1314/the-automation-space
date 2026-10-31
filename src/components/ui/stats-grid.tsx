import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatItem {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  columns?: 2 | 3 | 4 | 5;
}

export function StatsGrid({ stats, columns = 3, className, ...props }: StatsGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  }[columns];

  return (
    <div className={cn("grid gap-4", colClass, className)} {...props}>
      {stats.map((s, idx) => (
        <div
          key={idx}
          className={cn(
            "rounded-2xl border p-5 flex flex-col justify-between transition-all",
            s.highlight
              ? "border-primary-muted bg-primary-soft"
              : "border-border bg-card shadow-soft"
          )}
        >
          <div className="flex items-center justify-between text-[13px] text-muted-foreground font-medium mb-2">
            <span>{s.label}</span>
            {s.icon && <div className="text-primary">{s.icon}</div>}
          </div>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold tracking-tight",
              s.highlight ? "text-primary-hover" : "text-foreground"
            )}
          >
            {s.value}
          </div>
          {s.description && (
            <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
