"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FileText, CheckCircle, XCircle, Clock, Calendar, MapPin, DollarSign, MessageSquare, RefreshCw } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const ALL_PROPOSALS = [
  { id: "p-001", title: "Robotics Workshop Series", club: "Coding Club", officer: "Arjun Mehta", date: "Jul 15, 2025", venue: "Lab 3, Block B", budget: "₹4,500", risk: "LOW", desc: "A 3-session workshop on robotics fundamentals, sensors, and Arduino programming." },
  { id: "p-002", title: "Cultural Night – Monsoon Edition", club: "Cultural Committee", officer: "Sneha Iyer", date: "Aug 1, 2025", venue: "Open Air Theatre", budget: "₹12,000", risk: "MEDIUM", desc: "Annual cultural night with dance, music performances, and food stalls for 500+ students." },
  { id: "p-003", title: "Career Guidance Workshop", club: "Career Cell", officer: "Rohan Das", date: "Aug 20, 2025", venue: "Seminar Hall 2", budget: "₹2,000", risk: "LOW", desc: "Interactive session with industry experts on resume building and interview skills." },
  { id: "p-004", title: "Open Mic Night", club: "Arts & Culture Club", officer: "Divya Menon", date: "Sep 3, 2025", venue: "Amphitheatre", budget: "₹1,500", risk: "LOW", desc: "Student-led open mic for poetry, stand-up, and spoken word performances." },
];

const riskColor: Record<string, "success" | "secondary" | "destructive"> = { LOW: "success", MEDIUM: "secondary", HIGH: "destructive" };

export default function FacultyApprovalsPage() {
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

  const handle = (id: string, title: string, action: "APPROVED" | "REJECTED") => {
    const isEH = id.startsWith("ehp-");
    if (isEH) {
      const ehStored = localStorage.getItem("campushub_event_head_proposals");
      const ehList = ehStored ? JSON.parse(ehStored) : [];
      const nextStatus = action === "APPROVED" ? "PENDING_ADMIN" : "REJECTED_FACULTY";
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

      if (action === "APPROVED") {
        toast.success("Approved", `"${title}" approved by Faculty Coordinator. Sent to System Admin.`);
      } else {
        toast.error("Declined", `"${title}" was declined.`);
      }
    } else {
      const clubStored = localStorage.getItem("campushub_proposals");
      const clubList = clubStored ? JSON.parse(clubStored) : [];
      const updated = clubList.map((p: any) => p.id === id ? { ...p, status: action } : p);
      localStorage.setItem("campushub_proposals", JSON.stringify(updated));
      loadAll();
      window.dispatchEvent(new Event("campushub_storage_updated"));

      if (action === "APPROVED") {
        toast.success("Approved", `"${title}" approved successfully.`);
      } else {
        toast.error("Rejected", `"${title}" has been rejected.`);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and action all club event proposal submissions.</p>
      </div>
      <div className="space-y-5">
        {proposals.map((p, i) => {
          const status = p.status ?? "PENDING";
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-xl border bg-card shadow-sm p-5 space-y-4 transition-opacity ${status !== "PENDING" && status !== "RESUBMITTED" ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-foreground">{p.title}</p>
                      {status === "RESUBMITTED" && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px] py-0 px-1.5 h-4 flex items-center gap-0.5">
                          <RefreshCw className="h-2.5 w-2.5" /> Revised
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{p.club} · by {p.officer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={riskColor[p.risk]}>Risk: {p.risk}</Badge>
                  {status === "APPROVED" && <Badge variant="success"><CheckCircle className="h-3 w-3" />Approved</Badge>}
                  {status === "REJECTED" && <Badge variant="destructive"><XCircle className="h-3 w-3" />Rejected</Badge>}
                  {status === "REVISION_REQUESTED" && <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3" />Revision Requested</Badge>}
                  {(status === "PENDING" || status === "RESUBMITTED") && <Badge variant="secondary"><Clock className="h-3 w-3" />Pending</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border leading-relaxed">{p.desc}</p>
              
              {status === "RESUBMITTED" && p.officerResponse && (
                <div className="text-xs p-3 rounded-lg border border-blue-100 bg-blue-50/20 dark:border-blue-950/20 dark:bg-blue-950/10 leading-relaxed space-y-1">
                  <p className="font-bold text-[9px] uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 shrink-0" /> Resubmission Note from {p.officer}
                  </p>
                  <p className="italic text-foreground">"{p.officerResponse}"</p>
                </div>
              )}

              {status === "REVISION_REQUESTED" && p.suggestions && (
                <div className="text-xs p-3 rounded-lg border border-amber-100 bg-amber-50/20 dark:border-amber-950/20 dark:bg-amber-950/10 leading-relaxed space-y-1">
                  <p className="font-bold text-[9px] uppercase text-amber-600 dark:text-amber-400">Suggestions sent by {p.revisedBy} ({p.revisedAt})</p>
                  <p className="italic text-foreground">"{p.suggestions}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[[Calendar, "Date", p.date], [MapPin, "Venue", p.venue], [DollarSign, "Budget", p.budget]].map(([Icon, l, v]: any) => (
                  <div key={l} className="bg-muted/30 rounded-lg p-2.5 border flex items-start gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                    <div><p className="text-[10px] font-bold uppercase text-muted-foreground">{l}</p><p className="font-semibold text-foreground">{v}</p></div>
                  </div>
                ))}
              </div>
              {(status === "PENDING" || status === "RESUBMITTED") && (
                <div className="flex gap-2 border-t pt-3">
                  <Button size="sm" variant="outline" onClick={() => handle(p.id, p.title, "REJECTED")}
                    className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer">Decline</Button>
                  {!p.isEventHeadProposal && (
                    <Button size="sm" variant="secondary" onClick={() => setRevisingId(p.id)}
                      className="h-7 text-xs border bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 cursor-pointer">Revise</Button>
                  )}
                  <Button size="sm" onClick={() => handle(p.id, p.title, "APPROVED")} className="h-7 text-xs cursor-pointer">Approve</Button>
                </div>
              )}

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
          );
        })}
      </div>
    </div>
  );
}
