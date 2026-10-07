import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: "MEMBER" | "EVENT" | "PAYMENT" | "PROPOSAL";
  timestamp: string;
}

interface ActivityTableProps {
  activities: ActivityItem[];
}

const categoryVariant: Record<string, "default" | "success" | "destructive" | "secondary"> = {
  MEMBER: "default",
  EVENT: "success",
  PAYMENT: "secondary",
  PROPOSAL: "secondary",
};

export function ActivityTable({ activities }: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-xs text-muted-foreground">No recent activity</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="text-left px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">Actor</th>
            <th className="text-left px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">Action</th>
            <th className="text-left px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground hidden sm:table-cell">Type</th>
            <th className="text-right px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">When</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
              <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">{a.actor}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{a.action}</td>
              <td className="px-3 py-2.5 hidden sm:table-cell">
                <Badge variant={categoryVariant[a.category] ?? "default"}>{a.category}</Badge>
              </td>
              <td className="px-3 py-2.5 text-right text-muted-foreground whitespace-nowrap">{a.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
