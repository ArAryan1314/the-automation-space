"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string | number;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string | number | null;
  className?: string;
}

export function Accordion({ items, defaultOpenId = null, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | number | null>(defaultOpenId);

  const toggle = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border bg-card transition-all",
              isOpen ? "border-primary/30 shadow-lift" : "border-border shadow-soft hover:border-border-strong"
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-foreground font-semibold text-[15px] cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span>{item.trigger}</span>
              <span
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-surface text-muted-foreground"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-up">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
