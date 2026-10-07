import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function QuickActionCard({ title, description, icon: Icon, onClick, disabled, className }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group w-full text-left p-4 rounded-xl border bg-card shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 space-y-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">{description}</p>
      </div>
    </button>
  );
}
