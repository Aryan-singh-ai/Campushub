"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ALL_EVENTS = [
  {
    id: "evt-001",
    title: "CSE Tech Fest 2025",
    club: "Coding Club",
    date: "2025-07-28",
    venue: "Main Auditorium, Block A",
    isPaid: true,
    regFee: 299,
    status: "APPROVED",
  },
  {
    id: "evt-002",
    title: "Annual Photography Showcase",
    club: "Fine Arts Club",
    date: "2025-08-15",
    venue: "Gallery Hall, Block C",
    isPaid: false,
    regFee: 0,
    status: "APPROVED",
  },
  {
    id: "evt-003",
    title: "Inter-College Quiz Bowl",
    club: "Quiz Club",
    date: "2025-09-05",
    venue: "Seminar Hall 2, Block B",
    isPaid: true,
    regFee: 100,
    status: "PENDING",
  },
  {
    id: "evt-004",
    title: "Sports Meet 2025",
    club: "Sports Club",
    date: "2025-09-20",
    venue: "University Sports Ground",
    isPaid: false,
    regFee: 0,
    status: "APPROVED",
  },
];

export default function AdminEventsPage() {
  const [q, setQ] = React.useState("");

  const filtered = ALL_EVENTS.filter((e) =>
    e.title.toLowerCase().includes(q.toLowerCase()) ||
    e.club.toLowerCase().includes(q.toLowerCase()) ||
    e.venue.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Events</h1>
          <p className="text-muted-foreground text-sm mt-1">
            System-wide overview of all campus events and their status.
          </p>
        </div>
        <div className="relative w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8 h-8 text-xs"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-4 flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1">
              <div>
                <p className="font-bold text-sm text-foreground truncate">{e.title}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Organized by {e.club}</p>
              </div>
              <div className="flex flex-col text-xs text-muted-foreground justify-center">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.venue}</span>
                <span className="mt-0.5 font-semibold text-[10px]">{e.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={e.isPaid ? "secondary" : "success"}>
                  {e.isPaid ? `₹${e.regFee}` : "Free"}
                </Badge>
                <Badge variant={e.status === "APPROVED" ? "success" : "secondary"}>
                  {e.status}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
