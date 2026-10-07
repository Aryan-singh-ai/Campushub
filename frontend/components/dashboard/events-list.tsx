"use client";

import React from "react";
import { apiFetch } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export function EventsList() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch("/events").then((data) => {
      if (data.success) setEvents(data.events);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge>{event.category?.name || "General"}</Badge>
                {event.isPaid && <Badge variant="secondary">Paid · ₹{event.regFee}</Badge>}
              </div>
              <h3 className="font-bold text-foreground text-sm">{event.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.venue}</span>
              </div>
            </div>
            <Link
              href={`/events/${event.id}/register`}
              className="shrink-0 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
