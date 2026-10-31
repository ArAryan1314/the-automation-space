import * as React from "react";
import { CheckCircle2, ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertBannerVariants = cva(
  "p-4 rounded-xl border text-sm flex items-start gap-3 transition-all",
  {
    variants: {
      variant: {
        success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
        error: "bg-red-500/10 border-red-500/30 text-red-200",
        warning: "bg-energy-soft border-energy/40 text-foreground",
        info: "bg-accent-soft border-accent/40 text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertBannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
  VariantProps<typeof alertBannerVariants> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

export function AlertBanner({
  className,
  variant = "info",
  title,
  icon,
  children,
  ...props
}: AlertBannerProps) {
  const defaultIcons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />,
    error: <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-energy flex-shrink-0" />,
    info: <Info className="h-5 w-5 text-primary flex-shrink-0" />,
  };

  return (
    <div className={cn(alertBannerVariants({ variant, className }))} {...props}>
      {icon || defaultIcons[variant || "info"]}
      <div className="space-y-0.5 flex-1 leading-relaxed">
        {title && <div className="font-semibold">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
