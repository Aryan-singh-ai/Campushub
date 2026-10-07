"use client";

import React from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch("/events")
      .then((d) => { if (d.success) setEvents(d.events); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent py-14 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Campus Events
          </motion.h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Discover and register for events hosted by university clubs. Free and paid events listed below.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge>{event.category?.name || "General"}</Badge>
                    {event.isPaid ? (
                      <Badge variant="secondary">
                        <DollarSign className="h-3 w-3" />₹{event.regFee}
                      </Badge>
                    ) : (
                      <Badge variant="success">Free</Badge>
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-base">{event.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{event.description}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {event.venue}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-5">
                  <Link
                    href={`/events/${event.id}/register`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
                  >
                    Register Now
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
