"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, CheckCircle } from "lucide-react";

const APPROVED_EVENTS = [
  {
    id: "evt-001",
    title: "CSE Tech Fest 2025",
    club: "Coding Club",
    date: "Jul 28, 2025",
    venue: "Main Auditorium",
    budget: "₹8,500",
    registrations: 142,
    category: "Technical",
  },
  {
    id: "evt-002",
    title: "Annual Photography Showcase",
    club: "Fine Arts Club",
    date: "Aug 15, 2025",
    venue: "Gallery Hall",
    budget: "₹3,200",
    registrations: 68,
    category: "Cultural",
  },
];

export default function FacultyEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approved Events</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor active, approved events scheduled for this semester.
        </p>
      </div>

      <div className="space-y-4">
        {APPROVED_EVENTS.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge>{event.category}</Badge>
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Approved
                  </Badge>
                </div>
                <h3 className="font-bold text-foreground text-base mt-1.5">{event.title}</h3>
                <p className="text-xs text-muted-foreground">Organized by <span className="font-semibold text-foreground">{event.club}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-muted/30 rounded-lg p-2.5 border flex items-start gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground mt-0.5">{event.date}</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-2.5 border flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Venue</p>
                  <p className="font-semibold text-foreground mt-0.5">{event.venue}</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-2.5 border flex items-start gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Approved Budget</p>
                  <p className="font-semibold text-foreground mt-0.5">{event.budget}</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-2.5 border flex items-start gap-1.5">
                <Users className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Registrations</p>
                  <p className="font-semibold text-foreground mt-0.5">{event.registrations} students</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
