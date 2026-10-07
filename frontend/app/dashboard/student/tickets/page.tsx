"use client";

import React from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Calendar, MapPin, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const TICKETS = [
  {
    id: "TKT-2025-7821",
    event: "CSE Tech Fest 2025",
    date: "Monday, July 28, 2025",
    time: "9:00 AM – 6:00 PM",
    venue: "Main Auditorium, Block A",
    attendee: "Karthik Rajan",
    enrollment: "EN2022CS0421",
    track: "Hackathon – ByteStormers",
    seat: "H-42",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    accent: "text-blue-500",
    bg: "bg-blue-500",
  },
  {
    id: "TKT-2025-9034",
    event: "Annual Photography Showcase",
    date: "Friday, August 15, 2025",
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall, Block C",
    attendee: "Karthik Rajan",
    enrollment: "EN2022CS0421",
    track: "Nature & Wildlife Category",
    seat: "P-07",
    color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    accent: "text-amber-500",
    bg: "bg-amber-500",
  },
];

export default function StudentTicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-muted-foreground text-sm mt-1">Digital tickets for your confirmed event registrations.</p>
      </div>

      <div className="space-y-6">
        {TICKETS.map((ticket, i) => (
          <motion.div key={ticket.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            {/* Ticket card */}
            <div className={`rounded-2xl border-2 bg-gradient-to-br ${ticket.color} overflow-hidden shadow-lg`}>
              {/* Top strip */}
              <div className={`h-2 ${ticket.bg} w-full`} />

              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Left: Event info */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <Badge variant="default" className="mb-2">Confirmed ✓</Badge>
                    <h2 className="text-xl font-extrabold text-foreground tracking-tight">{ticket.event}</h2>
                    <p className={`text-xs font-bold mt-1 ${ticket.accent}`}>{ticket.track}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { icon: Calendar, label: "Date & Time", value: `${ticket.date}\n${ticket.time}` },
                      { icon: MapPin, label: "Venue", value: ticket.venue },
                      { icon: User, label: "Attendee", value: ticket.attendee },
                      { icon: Hash, label: "Enrollment No.", value: ticket.enrollment },
                    ].map((d) => (
                      <div key={d.label} className="bg-background/60 rounded-xl p-3 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <d.icon className={`h-3 w-3 ${ticket.accent}`} />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">{d.label}</span>
                        </div>
                        <p className="font-semibold text-foreground whitespace-pre-line">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: QR + Ticket ID */}
                <div className="flex flex-col items-center justify-center gap-3 border-l border-dashed border-border/60 pl-6">
                  <div className="h-28 w-28 rounded-xl border-2 border-dashed border-border bg-background/70 flex flex-col items-center justify-center gap-1">
                    <QrCode className={`h-12 w-12 ${ticket.accent}`} />
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Scan at Gate</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground font-semibold">Ticket ID</p>
                    <p className="font-mono font-bold text-xs text-foreground">{ticket.id}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Seat / Slot: <span className="font-bold text-foreground">{ticket.seat}</span></p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/40 bg-background/40 px-6 py-3 flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">Present this ticket at the venue entry gate.</p>
                <Button size="sm" variant="outline" onClick={() => toast.success("Ticket Downloaded", `${ticket.event} ticket saved as PDF.`)}
                  className="h-7 text-xs flex items-center gap-1.5">
                  <Download className="h-3 w-3" /> Download PDF
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
