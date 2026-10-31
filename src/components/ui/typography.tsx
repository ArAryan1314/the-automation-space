import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("tracking-tight text-foreground transition-colors", {
  variants: {
    variant: {
      default: "text-foreground",
      gradient: "gradient-text",
      muted: "text-muted-foreground",
      accent: "text-primary",
      blue: "text-accent",
    },
    size: {
      h1: "text-4xl sm:text-6xl font-extrabold leading-[1.08]",
      h2: "text-3xl sm:text-4xl font-extrabold leading-tight",
      h3: "text-xl sm:text-2xl font-bold leading-snug",
      h4: "text-lg font-bold leading-snug",
      h5: "text-base font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "h2",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Tag = "h2", variant, size, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          headingVariants({ variant, size: size || (Tag === "h6" ? "h5" : Tag), className })
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";

const textVariants = cva("leading-relaxed", {
  variants: {
    variant: {
      default: "text-body",
      muted: "text-muted-foreground",
      subtle: "text-subtle-foreground",
      highlight: "text-primary-hover font-semibold",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-[15px]",
      lg: "text-base sm:text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Tag = "p", variant, size, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement & HTMLDivElement>}
        className={cn(textVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Text.displayName = "Text";

export { Heading, Text, headingVariants, textVariants };
