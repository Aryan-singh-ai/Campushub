import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

const variantClasses: Record<string, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  outline: "bg-transparent text-foreground border-border",
  success: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
