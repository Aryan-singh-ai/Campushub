"use client";
import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { motion } from "framer-motion";
import { CheckSquare, Clock, Calendar, AlertCircle, FileText, ArrowRight, MessageSquare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ALL_PROPOSALS = [
  { id: "p-001", title: "Robotics Workshop Series", club: "Coding Club", officer: "Arjun Mehta", date: "Jul 15, 2025", venue: "Lab 3, Block B", budget: "₹4,500", risk: "LOW", desc: "A 3-session workshop on robotics fundamentals, sensors, and Arduino programming." },
  { id: "p-002", title: "Cultural Night – Monsoon Edition", club: "Cultural Committee", officer: "Sneha Iyer", date: "Aug 1, 2025", venue: "Open Air Theatre", budget: "₹12,000", risk: "MEDIUM", desc: "Annual cultural night with dance, music performances, and food stalls for 500+ students." },
  { id: "p-003", title: "Career Guidance Workshop", club: "Career Cell", officer: "Rohan Das", date: "Aug 20, 2025", venue: "Seminar Hall 2", budget: "₹2,000", risk: "LOW", desc: "Interactive session with industry experts on resume building and interview skills." },
  { id: "p-004", title: "Open Mic Night", club: "Arts & Culture Club", officer: "Divya Menon", date: "Sep 3, 2025", venue: "Amphitheatre", budget: "₹1,500", risk: "LOW", desc: "Student-led open mic for poetry, stand-up, and spoken word performances." },
];

const riskColor: Record<string, "success" | "secondary" | "destructive"> = {
  LOW: "success", MEDIUM: "secondary", HIGH: "destructive",
};

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = React.useState<any[]>([]);
  const [revisingId, setRevisingId] = React.useState<string | null>(null);
  const [suggestionText, setSuggestionText] = React.useState("");

  const loadAll = React.useCallback(() => {
    const clubStored = localStorage.getItem("campushub_proposals");
    const ehStored = localStorage.getItem("campushub_event_head_proposals");
    
    let clubList = [];
    if (clubStored) {
      clubList = JSON.parse(clubStored);
    } else {
      clubList = ALL_PROPOSALS.map((p) => ({ ...p, status: "PENDING" }));
      localStorage.setItem("campushub_proposals", JSON.stringify(clubList));
    }

    const ehList = ehStored ? JSON.parse(ehStored) : [];
    
    // Format Event Head proposals for layout matching
    const ehFormatted = ehList.map((p: any) => ({
      ...p,
      isEventHeadProposal: true,
      club: "Event Head Proposal",
      officer: p.eventHead || "Event Head",
      risk: "LOW",
      desc: p.description,
      status: p.status === "PENDING_FACULTY" ? "PENDING" : 
              p.status === "PENDING_ADMIN" ? "APPROVED" :
              p.status === "REJECTED_FACULTY" ? "REJECTED" :
              p.status
    }));

    setProposals([...clubList, ...ehFormatted]);
  }, []);

  React.useEffect(() => {
    loadAll();
    window.addEventListener("storage", loadAll);
    window.addEventListener("campushub_storage_updated", loadAll);
    window.addEventListener("focus", loadAll);
    return () => {
      window.removeEventListener("storage", loadAll);
      window.removeEventListener("campushub_storage_updated", loadAll);
      window.removeEventListener("focus", loadAll);
    };
  }, [loadAll]);

  const handle = (id: string, title: string, action: "approve" | "reject") => {
    const isEH = id.startsWith("ehp-");
    if (isEH) {
      const ehStored = localStorage.getItem("campushub_event_head_proposals");
      const ehList = ehStored ? JSON.parse(ehStored) : [];
      const nextStatus = action === "approve" ? "PENDING_ADMIN" : "REJECTED_FACULTY";
      const updated = ehList.map((p: any) => 
        p.id === id 
          ? { 
              ...p, 
              status: nextStatus, 
              approvedByFaculty: user?.name ?? "Dr. Priya Nair" 
            } 
          : p
      );
      localStorage.setItem("campushub_event_head_proposals", JSON.stringify(updated));
      loadAll();
      window.dispatchEvent(new Event("campushub_storage_updated"));

      if (action === "approve") {
        toast.success("Approved", `"${title}" approved by Faculty Coordinator. Sent to System Admin.`);
      } else {
        toast.error("Declined", `"${title}" was declined.`);
      }
    } else {
      const clubStored = localStorage.getItem("campushub_proposals");
      const clubList = clubStored ? JSON.parse(clubStored) : [];
      const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const updated = clubList.map((p: any) => p.id === id ? { ...p, status: nextStatus } : p);
      localStorage.setItem("campushub_proposals", JSON.stringify(updated));
      loadAll();
      window.dispatchEvent(new Event("campushub_storage_updated"));

      if (action === "approve") {
        toast.success("Proposal Approved", `"${title}" approved and notified to club officer.`);
      } else {
        toast.error("Proposal Rejected", `"${title}" rejected. Club officer has been notified.`);
      }
    }
  };

  const submitRevision = (id: string, title: string) => {
    if (!suggestionText.trim()) {
      toast.error("Error", "Please enter suggestions or improvements.");
      return;
    }
    const clubStored = localStorage.getItem("campushub_proposals");
    const clubList = clubStored ? JSON.parse(clubStored) : [];
    const updated = clubList.map((p: any) => 
      p.id === id 
        ? { 
            ...p, 
            status: "REVISION_REQUESTED", 
            suggestions: suggestionText, 
            revisedBy: user?.name ?? "Dr. Priya Nair", 
            revisedAt: new Date().toLocaleDateString() 
          } 
        : p
    );
    localStorage.setItem("campushub_proposals", JSON.stringify(updated));
    loadAll();
    window.dispatchEvent(new Event("campushub_storage_updated"));
    setRevisingId(null);
    setSuggestionText("");
    toast.success("Revision Requested", `Suggestions sent for "${title}".`);
  };

  const pending = proposals.filter((p) => p.status === "PENDING" || p.status === "RESUBMITTED");
  const underRevision = proposals.filter((p) => p.status === "REVISION_REQUESTED");
  const approved = proposals.filter((p) => p.status === "APPROVED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
          Faculty Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome, {user?.name}. Review proposals and monitor approved events.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Pending Approvals" value={String(pending.length)} icon={Clock} description="proposals to review" trend={{ value: "Action required", isPositive: false }} />
        <StatCard title="Approved Events" value={String(approved.length + 2)} icon={CheckSquare} description="this semester" trend={{ value: "+2 this week", isPositive: true }} />
        <StatCard title="Upcoming Events" value="5" icon={Calendar} description="in next 30 days" />
      </div>

      {/* Pending Proposals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" /> Pending Approvals
          </h2>
          <Link href="/dashboard/faculty/approvals" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
            Full list <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-4">
          {pending.slice(0, 2).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl border bg-card shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-foreground">{p.title}</p>
                      {p.status === "RESUBMITTED" && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px] py-0 px-1.5 h-4 flex items-center gap-0.5">
                          <RefreshCw className="h-2 w-2" /> Revised
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{p.club} · Submitted by {p.officer}</p>
                  </div>
                </div>
                <Badge variant={riskColor[p.risk]}>Risk: {p.risk}</Badge>
              </div>

              {p.status === "RESUBMITTED" && p.officerResponse && (
                <div className="text-xs p-3 rounded-lg border border-blue-100 bg-blue-50/20 dark:border-blue-950/20 dark:bg-blue-950/10 leading-relaxed space-y-1">
                  <p className="font-bold text-[9px] uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 shrink-0" /> Resubmission Note from {p.officer}
                  </p>
                  <p className="italic text-foreground">"{p.officerResponse}"</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-xs">
                {[["Date", p.date], ["Venue", p.venue], ["Budget", p.budget]].map(([l, v]) => (
                  <div key={l} className="bg-muted/30 rounded-lg p-2.5 border">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{l}</p>
                    <p className="font-semibold text-foreground mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t pt-3">
                <Button size="sm" variant="outline" onClick={() => handle(p.id, p.title, "reject")}
                  className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer">Decline</Button>
                {!p.isEventHeadProposal && (
                  <Button size="sm" variant="secondary" onClick={() => setRevisingId(p.id)}
                    className="h-7 text-xs border bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 cursor-pointer">Revise</Button>
                )}
                <Button size="sm" onClick={() => handle(p.id, p.title, "approve")} className="h-7 text-xs cursor-pointer">Approve</Button>
              </div>

              {revisingId === p.id && (
                <div className="border-t pt-3 space-y-2 animate-in slide-in-from-top-1 duration-150">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-amber-600">Suggestions & Improvements</label>
                    <textarea
                      className="w-full text-xs p-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[60px] text-foreground"
                      placeholder="Enter suggestions (e.g. reduce budget, change venue)..."
                      value={suggestionText}
                      onChange={(e) => setSuggestionText(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setRevisingId(null)} className="h-7 text-xs">Cancel</Button>
                    <Button size="sm" onClick={() => submitRevision(p.id, p.title)} className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold">Submit Revision</Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {pending.length === 0 && (
            <div className="text-center py-12 rounded-xl border bg-card text-muted-foreground text-sm">
              ✅ All proposals reviewed. No pending approvals.
            </div>
          )}
        </div>
      </div>

      {/* Revisions In Progress */}
      {underRevision.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500 animate-pulse" /> Under Revision
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {underRevision.map((p) => (
              <div key={p.id} className="rounded-xl border bg-card p-5 space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-sm text-foreground">{p.title}</p>
                    <p className="text-[11px] text-muted-foreground">{p.club} · Awaiting response from {p.officer}</p>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] py-0 px-2 h-5">
                    Awaiting Revision
                  </Badge>
                </div>
                <div className="text-xs p-3 rounded-lg border border-amber-100 bg-amber-50/20 dark:border-amber-950/20 dark:bg-amber-950/10">
                  <p className="font-bold text-[9px] uppercase text-amber-600 dark:text-amber-400">Suggestions sent by {p.revisedBy} ({p.revisedAt})</p>
                  <p className="italic text-foreground mt-0.5">"{p.suggestions}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
