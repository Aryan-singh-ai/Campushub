"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { motion } from "framer-motion";
import { Calendar, Ticket, Award, Clock, ArrowRight, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const MY_REGISTRATIONS = [
  { id: "reg-001", event: "CSE Tech Fest 2025", date: "Jul 28, 2025", venue: "Main Auditorium", status: "CONFIRMED", track: "Hackathon", isPaid: true, amount: 299 },
  { id: "reg-002", event: "Annual Photography Showcase", date: "Aug 15, 2025", venue: "Gallery Hall", status: "CONFIRMED", track: "Nature & Wildlife", isPaid: false, amount: 0 },
  { id: "reg-003", event: "Sports Meet 2025", date: "Sep 20, 2025", venue: "Sports Ground", status: "PENDING", track: "Badminton Singles", isPaid: false, amount: 0 },
];

const UPCOMING = [
  { id: "evt-003", title: "Inter-College Quiz Bowl", date: "Sep 5, 2025", category: "Academic" },
  { id: "evt-004", title: "Music Night", date: "Oct 10, 2025", category: "Cultural" },
];

const statusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  CONFIRMED: "success", PENDING: "secondary", CANCELLED: "destructive",
};

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
          Welcome back, {user?.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your campus activity at a glance.</p>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-1 ${user?.role === "GUEST" ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-5`}>
        <StatCard title="Events Registered" value="3" icon={Calendar} description="this semester" trend={{ value: "+2 this month", isPositive: true }} />
        <StatCard title="Tickets Issued" value="2" icon={Ticket} description="confirmed bookings" />
        {user?.role !== "GUEST" && (
          <StatCard title="Certificates Earned" value="1" icon={Award} description="downloadable" trend={{ value: "1 new", isPositive: true }} />
        )}
      </div>

      {/* My Registrations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">My Registrations</h2>
          <Link href="/dashboard/student/registrations" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {MY_REGISTRATIONS.map((reg, i) => (
            <motion.div key={reg.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{reg.event}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{reg.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{reg.venue}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Track: <span className="font-semibold text-foreground">{reg.track}</span></p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge variant={statusVariant[reg.status]}>{reg.status}</Badge>
                {reg.isPaid && <span className="text-[10px] font-semibold text-green-500">₹{reg.amount} Paid</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming events you haven't registered for */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Discover More Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UPCOMING.map((ev) => (
            <div key={ev.id} className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-all">
              <div>
                <Badge className="mb-1.5">{ev.category}</Badge>
                <p className="font-bold text-sm text-foreground">{ev.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" />{ev.date}</p>
              </div>
              <Link href={`/events/${ev.id}/register`}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                Register
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
