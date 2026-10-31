import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  year?: string;
  title: string;
  desc: string;
  date?: string;
  active?: boolean;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  columns?: 1 | 2 | 3 | 4;
}

export function Timeline({
  items,
  columns = 4,
  className,
  ...props
}: TimelineProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-6", colClasses[columns], className)}
      {...props}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative rounded-2xl border border-border bg-card p-5 pl-6 shadow-soft space-y-2 overflow-hidden"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-sky-400" />
          {item.year && (
            <span className="inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary-hover">
              {item.year}
            </span>
          )}
          {item.date && (
            <span className="block text-xs font-semibold text-muted-foreground">
              {item.date}
            </span>
          )}
          <h4 className="text-base font-bold text-foreground tracking-tight">
            {item.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
