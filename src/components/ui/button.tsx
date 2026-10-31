import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/45",
        secondary:
          "bg-card text-foreground border border-border shadow-sm hover:border-border-strong hover:bg-surface",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-card hover:border-primary/40",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-surface",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-red-700",
        accent:
          "bg-ink text-white border border-border-strong shadow-sm hover:bg-ink-soft",
        soft:
          "bg-primary-soft text-primary-hover border border-primary-muted hover:bg-primary-muted",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 rounded-lg px-3 text-[13px]",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
