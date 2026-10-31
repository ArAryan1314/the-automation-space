import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Soft rounded tile that frames a lucide icon. */
const iconBoxVariants = cva(
  "inline-flex flex-shrink-0 items-center justify-center rounded-xl border",
  {
    variants: {
      tone: {
        primary: "bg-primary-soft border-primary-muted text-primary",
        accent: "bg-accent-soft border-accent/30 text-accent",
        sky: "bg-sky-500/10 border-sky-500/30 text-sky-400",
        amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        rose: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        neutral: "bg-surface border-border text-muted-foreground",
      },
      size: {
        sm: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
        default: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
        lg: "h-14 w-14 rounded-2xl [&_svg]:h-6 [&_svg]:w-6",
      },
    },
    defaultVariants: {
      tone: "primary",
      size: "default",
    },
  }
);

export interface IconBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconBoxVariants> {}

export function IconBox({ className, tone, size, ...props }: IconBoxProps) {
  return <div className={cn(iconBoxVariants({ tone, size }), className)} {...props} />;
}
