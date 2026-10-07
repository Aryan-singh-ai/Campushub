"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, MapPin, CheckCircle, Clock, XCircle, Megaphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_REGISTRATIONS = [
  { id: "reg-001", event: "CSE Tech Fest 2025", eventId: "evt-001", date: "Jul 28, 2025", venue: "Main Auditorium, Block A", status: "CONFIRMED", track: "Hackathon", team: "ByteStormers", isPaid: true, amount: 299, regId: "EN2022CS0421" },
  { id: "reg-002", event: "Annual Photography Showcase", eventId: "evt-002", date: "Aug 15, 2025", venue: "Gallery Hall, Block C", status: "CONFIRMED", track: "Nature & Wildlife", team: null, isPaid: false, amount: 0, regId: "EN2022CS0421" },
  { id: "reg-003", event: "Sports Meet 2025", eventId: "evt-004", date: "Sep 20, 2025", venue: "Sports Ground", status: "PENDING", track: "Badminton Singles", team: null, isPaid: false, amount: 0, regId: "EN2022CS0421" },
];

const statusConfig: Record<string, { variant: "success" | "secondary" | "destructive"; icon: React.FC<any> }> = {
  CONFIRMED: { variant: "success", icon: CheckCircle },
  VERIFIED: { variant: "success", icon: CheckCircle },
  PENDING: { variant: "secondary", icon: Clock },
  REJECTED: { variant: "destructive", icon: XCircle },
  CANCELLED: { variant: "destructive", icon: XCircle },
};

export default function StudentRegistrationsPage() {
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [announcements, setAnnouncements] = React.useState<any[]>([]);

  const loadRegistrations = () => {
    const stored = localStorage.getItem("campushub_registrations");
    if (stored) {
      setRegistrations(JSON.parse(stored));
    } else {
      localStorage.setItem("campushub_registrations", JSON.stringify(MOCK_REGISTRATIONS));
      setRegistrations(MOCK_REGISTRATIONS);
    }
  };

  const loadAnnouncements = () => {
    const storedAnn = localStorage.getItem("campushub_event_announcements");
    if (storedAnn) {
      setAnnouncements(JSON.parse(storedAnn));
    }
  };

  React.useEffect(() => {
    loadRegistrations();
    loadAnnouncements();
    window.addEventListener("storage", () => {
      loadRegistrations();
      loadAnnouncements();
    });
    window.addEventListener("focus", () => {
      loadRegistrations();
      loadAnnouncements();
    });
    return () => {
      window.removeEventListener("storage", loadRegistrations);
    };
  }, []);

  const studentEventIds = registrations.map(r => r.eventId);
  const myAnnouncements = announcements.filter(a => studentEventIds.includes(a.eventId));

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          My Registrations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">All events you have registered for this semester.</p>
      </div>

      {/* Announcements Board */}
      {myAnnouncements.length > 0 && (
        <div className="space-y-3">
          {myAnnouncements.map((ann) => (
            <div key={ann.id} className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex gap-3 shadow-sm items-start relative overflow-hidden">
              <div className="absolute right-0 top-0 h-16 w-16 bg-indigo-500/5 rounded-full -mr-4 -mt-4 shrink-0" />
              <Megaphone className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1 relative">
                <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-400">GD Goenka Bulletin: {ann.eventTitle}</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-semibold">{ann.content}</p>
                <p className="text-[9px] text-indigo-500 font-semibold">{ann.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {registrations.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card text-muted-foreground text-sm">
            No registrations found.
          </div>
        ) : (
          registrations.map((reg, i) => {
            const config = statusConfig[reg.status] || statusConfig.PENDING;
            const { variant, icon: Icon } = config;
            return (
              <motion.div key={reg.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-xl border bg-card shadow-sm p-5 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-bold text-base text-foreground">{reg.event || reg.eventTitle}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-primary" />{reg.date || reg.submittedAt}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" />{reg.venue || "Campus Auditorium"}</span>
                    </div>
                  </div>
                  <Badge variant={variant}><Icon className="h-3 w-3 mr-1 inline" />{reg.status}</Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: "Enrollment No.", value: reg.regId || reg.enrollment },
                    { label: "Track / Sport", value: reg.track || "Solo" },
                    { label: "Team Name", value: reg.team ?? "Solo" },
                    { label: "Payment Status", value: reg.isPaid ? (reg.status === "CONFIRMED" || reg.status === "VERIFIED" ? `₹${reg.regFee || reg.amount} Verified ✓` : `₹${reg.regFee || reg.amount} Pending Verification`) : "Free Event" },
                  ].map((d) => (
                    <div key={d.label} className="bg-muted/30 rounded-lg p-2.5 border">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">{d.label}</p>
                      <p className="font-semibold text-foreground mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 border-t pt-3">
                  <Link href={`/events/${reg.eventId}`}>
                    <Button variant="outline" size="sm" className="cursor-pointer">View Event</Button>
                  </Link>
                  {(reg.status === "CONFIRMED" || reg.status === "VERIFIED") && (
                    <Link href="/dashboard/student/tickets">
                      <Button size="sm" className="cursor-pointer">View Ticket</Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
