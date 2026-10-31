import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          "relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8 animate-fade-up",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div>
            {title && (
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
          >
            <span className="sr-only">Close modal</span>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
