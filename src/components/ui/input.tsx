import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-subtle-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("flex h-11 px-3.5", fieldBase, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn("flex min-h-[96px] p-3.5 leading-relaxed", fieldBase, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("block mb-1.5 text-[13px] font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export { Input, Textarea, Label };
