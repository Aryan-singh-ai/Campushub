"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityTable, ActivityItem } from "@/components/dashboard/activity-table";
import { motion } from "framer-motion";
import { Users, Calendar, CreditCard, ShieldCheck, AlertTriangle, ArrowRight, Check, X, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const RECENT_PAYMENTS = [
  { id: "pay-001", student: "Divya Menon", event: "CSE Tech Fest 2025", amount: 299, utr: "UTR2025062800123", status: "PENDING" },
  { id: "pay-002", student: "Rahul Verma", event: "Inter-College Quiz Bowl", amount: 100, utr: "UTR2025062500456", status: "VERIFIED" },
  { id: "pay-003", student: "Ananya Singh", event: "CSE Tech Fest 2025", amount: 299, utr: "UTR2025062601789", status: "PENDING" },
];

const activities: ActivityItem[] = [
  { id: "1", actor: "student@university.edu", action: "registered for CSE Tech Fest 2025", target: "Events", category: "EVENT", timestamp: "5 mins ago" },
  { id: "2", actor: "president@university.edu", action: "posted club announcement", target: "Coding Club", category: "MEMBER", timestamp: "20 mins ago" },
  { id: "3", actor: "faculty@university.edu", action: "approved Robotics Workshop proposal", target: "Proposals", category: "PROPOSAL", timestamp: "2 hours ago" },
  { id: "4", actor: "Divya Menon", action: "submitted payment proof ₹299", target: "Payments", category: "PAYMENT", timestamp: "3 hours ago" },
  { id: "5", actor: "Rohan Das", action: "submitted join request to Coding Club", target: "Roster", category: "MEMBER", timestamp: "Yesterday" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = React.useState<any[]>([]);

  const loadProposals = () => {
    const stored = localStorage.getItem("campushub_event_head_proposals");
    if (stored) {
      setProposals(JSON.parse(stored));
    }
  };

  React.useEffect(() => {
    loadProposals();
    window.addEventListener("storage", loadProposals);
    window.addEventListener("campushub_storage_updated", loadProposals);
    window.addEventListener("focus", loadProposals);
    return () => {
      window.removeEventListener("storage", loadProposals);
      window.removeEventListener("campushub_storage_updated", loadProposals);
      window.removeEventListener("focus", loadProposals);
    };
  }, []);

  const pendingProposals = proposals.filter((p) => p.status === "PENDING_ADMIN");

  const handleAction = (id: string, title: string, action: "APPROVED" | "REJECTED") => {
    const updated = proposals.map((p) => p.id === id ? { ...p, status: action } : p);
    setProposals(updated);
    localStorage.setItem("campushub_event_head_proposals", JSON.stringify(updated));

    if (action === "APPROVED") {
      toast.success("Proposal Approved", `"${title}" has been approved. The Event Head has been notified.`);
    } else {
      toast.error("Proposal Rejected", `"${title}" has been rejected.`);
    }
  };

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">
          Admin Control Panel
        </h1>
        <p className="text-muted-foreground text-sm mt-1">System-wide overview — users, payments, events, and platform health.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="874" icon={Users} description="registered accounts" trend={{ value: "+12 this week", isPositive: true }} />
        <StatCard title="Total Events" value="4" icon={Calendar} description="active this semester" />
        <StatCard title="Payments Pending" value="2" icon={CreditCard} description="awaiting verification" trend={{ value: "Action needed", isPositive: false }} />
        <StatCard title="System Health" value="99.8%" icon={ShieldCheck} description="uptime last 30d" trend={{ value: "Optimal", isPositive: true }} />
      </div>

      {/* Pending Payments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Pending Payment Verifications
          </h2>
          <Link href="/dashboard/admin/payments" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b bg-muted/30">
              {["Student", "Event", "Amount", "UTR Number", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase text-muted-foreground">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {RECENT_PAYMENTS.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{p.student}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.event}</td>
                  <td className="px-4 py-3 font-bold text-foreground">₹{p.amount}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{p.utr}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "VERIFIED" ? "success" : "secondary"}>{p.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Event Head Proposals */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-pink-500" /> Pending Event Head Proposals
          </h2>
        </div>
        <div className="space-y-4">
          {pendingProposals.length === 0 ? (
            <div className="text-center py-8 rounded-xl border bg-card text-muted-foreground text-xs">
              No pending event head proposals.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingProposals.map((p) => (
                <div key={p.id} className="rounded-xl border bg-card p-5 space-y-3 shadow-sm text-xs">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
                    {p.approvedByFaculty && (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-500/20 text-[10px] font-semibold">
                        approved by faculty coordinator — {p.approvedByFaculty}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1.5">Proposed by Head of Event: {p.eventHead}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic bg-muted/20 p-2 rounded border">"{p.description}"</p>
                  <div className="grid grid-cols-3 gap-2 font-semibold">
                    <div className="bg-muted/40 p-2 rounded border"><p className="text-[8px] uppercase text-muted-foreground">Date</p><p className="truncate text-foreground">{p.date}</p></div>
                    <div className="bg-muted/40 p-2 rounded border"><p className="text-[8px] uppercase text-muted-foreground">Venue</p><p className="truncate text-foreground">{p.venue}</p></div>
                    <div className="bg-muted/40 p-2 rounded border"><p className="text-[8px] uppercase text-muted-foreground">Budget</p><p className="truncate text-foreground">{p.budget}</p></div>
                  </div>
                  <div className="flex justify-end gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(p.id, p.title, "REJECTED")}
                      className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(p.id, p.title, "APPROVED")}
                      className="h-7 text-xs bg-primary hover:bg-primary/95 text-white font-semibold cursor-pointer"
                    >
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="space-y-3 border-t pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">System Activity Log</h2>
        <div className="border rounded-xl bg-card p-2 shadow-sm">
          <ActivityTable activities={activities} />
        </div>
      </div>
    </div>
  );
}
