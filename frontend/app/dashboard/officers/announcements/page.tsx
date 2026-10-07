"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, AlertCircle, Info, Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const INITIAL = [
  { id: "a-1", title: "Tech Fest Registration Now Open!", content: "Student registrations for CSE Tech Fest 2025 are now live. Share the link widely!", priority: "HIGH", time: "10 mins ago" },
  { id: "a-2", title: "Officer Sync Meeting Tomorrow", content: "All club officers please join the planning sync at 5:00 PM in Seminar Hall 1.", priority: "HIGH", time: "2 hours ago" },
  { id: "a-3", title: "New Members Onboarded", content: "30 new members have been added to the Coding Club roster. Please welcome them.", priority: "LOW", time: "1 day ago" },
];

const priorityBadge: Record<string, "destructive" | "secondary" | "default"> = {
  HIGH: "destructive", MEDIUM: "secondary", LOW: "default",
};

const priorityIcon: Record<string, React.FC<any>> = {
  HIGH: AlertCircle, MEDIUM: Bell, LOW: Info,
};

export default function OfficersAnnouncementsPage() {
  const [items, setItems] = React.useState(INITIAL);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [priority, setPriority] = React.useState("LOW");

  const post = () => {
    if (!title.trim() || !content.trim()) { toast.error("Missing fields", "Title and content are required."); return; }
    const newAnn = { id: `a-${Date.now()}`, title, content, priority, time: "Just now" };
    setItems((prev) => [newAnn, ...prev]);
    setTitle(""); setContent("");
    toast.success("Announcement Posted", `Broadcast sent to all 142 members.`);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    toast.info("Deleted", "Announcement removed.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground text-sm mt-1">Post club-wide announcements to all members and officers.</p>
      </div>

      {/* Compose */}
      <div className="rounded-xl border bg-card shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Megaphone className="h-4 w-4 text-primary" /> Post New Announcement
        </h2>
        <Input placeholder="Announcement title..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your announcement content..."
          className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Priority:</span>
            {["LOW", "MEDIUM", "HIGH"].map((p) => (
              <button key={p} onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${priority === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                {p}
              </button>
            ))}
          </div>
          <Button onClick={post} className="flex items-center gap-2"><Plus className="h-4 w-4" />Post Announcement</Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Posted Announcements</h2>
        {items.map((ann, i) => {
          const Icon = priorityIcon[ann.priority] ?? Bell;
          return (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card p-4 shadow-sm flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-foreground">{ann.title}</p>
                  <Badge variant={priorityBadge[ann.priority]}>{ann.priority}</Badge>
                </div>
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{ann.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{ann.time}</p>
              </div>
              <button onClick={() => remove(ann.id)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors cursor-pointer p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
