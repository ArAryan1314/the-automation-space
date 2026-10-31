import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full transition-all relative overflow-hidden", {
  variants: {
    variant: {
      default: "bg-transparent",
      glass: "bg-card border-y border-border",
      glow: "bg-primary-soft border-y border-primary-muted/70",
      hero: "hero-wash",
      muted: "bg-surface/70 border-y border-border",
      ink: "bg-ink text-white",
    },
    spacing: {
      none: "py-0",
      sm: "py-10",
      default: "py-16 sm:py-20",
      lg: "py-20 sm:py-28",
    },
  },
  defaultVariants: {
    variant: "default",
    spacing: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof sectionVariants> {
  container?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, spacing, container = true, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ variant, spacing, className }))}
        {...props}
      >
        {container ? (
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);
Section.displayName = "Section";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  badge?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, badge, title, description, align = "center", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mb-12 space-y-4",
          align === "center" && "text-center max-w-3xl mx-auto",
          align === "left" && "text-left max-w-3xl",
          align === "right" && "text-right ml-auto max-w-3xl",
          className
        )}
        {...props}
      >
        {badge && <div className="inline-block">{badge}</div>}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-base text-muted-foreground leading-relaxed max-w-2xl",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

/** Page-level hero header shared by every inner page. */
export interface PageHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  badge?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
}

function PageHero({
  badge,
  title,
  description,
  actions,
  align = "center",
  className,
  children,
  ...props
}: PageHeroProps) {
  return (
    <Section
      variant="hero"
      spacing="none"
      className={cn("pt-16 pb-14 sm:pt-20 sm:pb-16 border-b border-border", className)}
      {...props}
    >
      <div className={cn("space-y-5", align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-3xl")}>
        {badge && <div className="inline-flex">{badge}</div>}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground">
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
        {actions && (
          <div className={cn("flex flex-wrap gap-3 pt-2", align === "center" && "justify-center")}>
            {actions}
          </div>
        )}
      </div>
      {children}
    </Section>
  );
}

export { Section, SectionHeader, PageHero, sectionVariants };
