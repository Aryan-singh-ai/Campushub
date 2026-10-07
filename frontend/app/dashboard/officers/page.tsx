"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { AnnouncementCard, AnnouncementItem } from "@/components/dashboard/announcement-card";
import { CalendarWidget, CalendarEvent } from "@/components/dashboard/calendar-widget";
import { ActivityTable, ActivityItem } from "@/components/dashboard/activity-table";
import { Users, Calendar, AlertCircle, PlusCircle, MessageSquare, Clock, Sparkles, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const calendarEvents: CalendarEvent[] = [
  { day: 28, title: "CSE Tech Fest", type: "event" },
  { day: 29, title: "Officer Sync Meeting", type: "meeting" },
  { day: 5, title: "Quiz Bowl", type: "event" },
];

const announcements: AnnouncementItem[] = [
  { id: "1", title: "Officer Sync Meeting Tomorrow", content: "All club officers must join the planning sync meeting tomorrow at 5:00 PM in Seminar Hall 1.", author: "Arjun Mehta (President)", timestamp: "10 mins ago", priority: "HIGH" },
  { id: "2", title: "CSE Tech Fest Registration Open", content: "Student registrations are now open. Please promote the event across all club channels.", author: "Sneha Iyer (VP)", timestamp: "2 hours ago", priority: "MEDIUM" },
  { id: "3", title: "Recruitment Drive Complete", content: "30 new members approved for Coding Club. Welcome them to the roster!", author: "Arjun Mehta", timestamp: "1 day ago", priority: "LOW" },
];

const activities: ActivityItem[] = [
  { id: "1", actor: "Abhishek Sharma", action: "submitted a join request for Coding Club", target: "Rosters Directory", category: "MEMBER", timestamp: "30 mins ago" },
  { id: "2", actor: "CSE Tech Fest proposal", action: "was approved by Faculty Dr. Priya Nair", target: "Events Portal", category: "EVENT", timestamp: "2 hours ago" },
  { id: "3", actor: "Photography Showcase", action: "registration form submitted for review", target: "Proposals", category: "PROPOSAL", timestamp: "5 hours ago" },
  { id: "4", actor: "Divya Menon", action: "paid registration fee for Tech Fest", target: "Payments", category: "PAYMENT", timestamp: "Yesterday" },
];

export default function OfficersDashboard() {
  const { user } = useAuth();
  const [selectedClub, setSelectedClub] = React.useState<{ id: string; name: string } | null>(null);
  const [proposals, setProposals] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("campushub_selected_club");
      if (stored) {
        try {
          setSelectedClub(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);
  const [editingProposal, setEditingProposal] = React.useState<any | null>(null);
  const [editForm, setEditForm] = React.useState({
    title: "",
    date: "",
    venue: "",
    budget: "",
    desc: "",
    response: ""
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("campushub_proposals");
    if (stored) {
      setProposals(JSON.parse(stored));
    }
  }, []);

  const revisionRequests = proposals.filter(
    (p) => p.status === "REVISION_REQUESTED" && p.officer === user?.name
  );

  const activeEventsCount = proposals.filter(
    (p) => p.officer === user?.name && p.status !== "REJECTED"
  ).length;

  const handleStartEdit = (prop: any) => {
    setEditingProposal(prop);
    setEditForm({
      title: prop.title,
      date: prop.date,
      venue: prop.venue,
      budget: prop.budget,
      desc: prop.desc || "",
      response: ""
    });
  };

  const handleResubmit = () => {
    if (!editForm.title.trim() || !editForm.date.trim() || !editForm.venue.trim() || !editForm.budget.trim()) {
      toast.error("Error", "Please fill out all fields.");
      return;
    }

    const updated = proposals.map((p) =>
      p.id === editingProposal.id
        ? {
            ...p,
            title: editForm.title,
            date: editForm.date,
            venue: editForm.venue,
            budget: editForm.budget,
            desc: editForm.desc,
            status: "RESUBMITTED",
            officerResponse: editForm.response,
          }
        : p
    );

    setProposals(updated);
    localStorage.setItem("campushub_proposals", JSON.stringify(updated));
    setEditingProposal(null);
    toast.success("Proposal Resubmitted", `"${editForm.title}" has been updated and sent back to faculty for review.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-600">
          {selectedClub ? `${selectedClub.name} President Panel` : "Club President Panel"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, President {user?.name.split(" ")[0]}. Manage your club's events, rosters, and proposals.
        </p>
      </div>

      {/* Revision Alerts */}
      {revisionRequests.map((req) => (
        <div key={req.id} className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              Revision Required: "{req.title}"
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">{req.revisedBy}</span> suggested: <span className="italic font-medium">"{req.suggestions}"</span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => handleStartEdit(req)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shrink-0 self-start sm:self-center"
          >
            Update Event Details
          </Button>
        </div>
      ))}

      {/* Edit Proposal Modal */}
      {editingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-150 text-foreground">
            <h3 className="font-bold text-lg">Update Event Details</h3>
            <p className="text-xs text-muted-foreground">Modify the fields below to address the suggestions: <span className="italic text-amber-600 font-medium">"{editingProposal.suggestions}"</span></p>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[10px] uppercase text-muted-foreground">Event Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[10px] uppercase text-muted-foreground">Date</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={editForm.date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[10px] uppercase text-muted-foreground">Venue</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={editForm.venue}
                    onChange={(e) => setEditForm(prev => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[10px] uppercase text-muted-foreground">Budget</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={editForm.budget}
                  onChange={(e) => setEditForm(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[10px] uppercase text-muted-foreground">Event Description</label>
                <textarea
                  className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                  value={editForm.desc}
                  onChange={(e) => setEditForm(prev => ({ ...prev, desc: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[10px] uppercase text-muted-foreground">Resubmission Comments / Notes</label>
                <textarea
                  className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                  placeholder="Explain your changes to the faculty reviewer..."
                  value={editForm.response}
                  onChange={(e) => setEditForm(prev => ({ ...prev, response: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingProposal(null)}>Cancel</Button>
              <Button size="sm" onClick={handleResubmit} className="bg-primary hover:bg-primary/90 text-white font-semibold">Resubmit Proposal</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Members" value="142" icon={Users} description="in club roster" trend={{ value: "+8 this month", isPositive: true }} />
        <StatCard title="Active Events" value={String(activeEventsCount || 3)} icon={Calendar} description="proposals in pipeline" />
        <StatCard title="Join Requests" value="7" icon={AlertCircle} description="awaiting approval" trend={{ value: "+3 new", isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickActionCard title="Manage Club Members" description="Approve join requests, audit rosters, and appoint leaders." icon={Users} onClick={() => toast.info("Member Management", "7 new join requests pending your approval.")} />
            <QuickActionCard title="Create Announcement" description="Broadcast notifications and updates to all members." icon={MessageSquare} onClick={() => toast.success("Announcement Posted", "Your announcement was sent to all 142 members.")} />
            <QuickActionCard title="Schedule Club Meeting" description="Coordinate calendar slots and draft agendas." icon={Clock} onClick={() => toast.success("Meeting Scheduled", "Club meeting added: Jul 29 at 5:00 PM.")} />
            <QuickActionCard title="Create Event Proposal" description="Draft requirements and submit for faculty approval." icon={PlusCircle} onClick={() => toast.info("Coming Soon", "Proposal builder launching in Phase 3.")} />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Club Schedule</h3>
          <CalendarWidget events={calendarEvents} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-8">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity Log</h3>
          <div className="border rounded-xl bg-card p-2 shadow-sm">
            <ActivityTable activities={activities} />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Announcements</h3>
          <div className="space-y-3">
            {announcements.map((ann) => <AnnouncementCard key={ann.id} announcement={ann} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
