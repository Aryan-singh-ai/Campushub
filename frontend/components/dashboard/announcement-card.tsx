import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Bell } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  priority: "HIGH" | "LOW" | "MEDIUM";
}

interface AnnouncementCardProps {
  announcement: AnnouncementItem;
}

const priorityStyles = {
  HIGH: "border-l-destructive bg-destructive/5",
  MEDIUM: "border-l-amber-500 bg-amber-500/5",
  LOW: "border-l-primary bg-primary/5",
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-l-4 bg-card shadow-sm space-y-2",
        priorityStyles[announcement.priority]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {announcement.priority === "HIGH" ? (
            <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
          ) : (
            <Bell className="h-3.5 w-3.5 text-primary shrink-0" />
          )}
          <p className="text-xs font-bold text-foreground leading-tight">{announcement.title}</p>
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">{announcement.timestamp}</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{announcement.content}</p>
      <p className="text-[10px] text-muted-foreground font-semibold">— {announcement.author}</p>
    </div>
  );
}
