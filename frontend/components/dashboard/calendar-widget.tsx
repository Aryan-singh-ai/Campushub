import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarEvent {
  day: number;
  title: string;
  type: "event" | "meeting";
}

interface CalendarWidgetProps {
  events?: CalendarEvent[];
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarWidget({ events = [] }: CalendarWidgetProps) {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-xs font-bold text-foreground">{MONTHS[month]} {year}</p>
        <button onClick={nextMonth} className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasEvent = events.some((e) => e.day === day);
          const eventType = events.find((e) => e.day === day)?.type;
          return (
            <div
              key={idx}
              className={cn(
                "relative aspect-square flex items-center justify-center rounded-lg text-[11px] font-medium transition-colors",
                isToday && "bg-primary text-primary-foreground font-bold",
                !isToday && "text-foreground hover:bg-muted"
              )}
            >
              {day}
              {hasEvent && !isToday && (
                <span className={cn(
                  "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                  eventType === "event" ? "bg-primary" : "bg-amber-500"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Event legend */}
      {events.length > 0 && (
        <div className="border-t pt-3 space-y-1.5">
          {events.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full shrink-0",
                e.type === "event" ? "bg-primary" : "bg-amber-500"
              )} />
              <span><span className="font-bold text-foreground">{e.day}th</span> — {e.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
