import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  description?: string;
  trend?: { value: string; isPositive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm space-y-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-semibold",
          trend.isPositive ? "text-green-500" : "text-destructive"
        )}>
          {trend.isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
