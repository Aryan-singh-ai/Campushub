"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Megaphone, Trash2, Calendar, AlertCircle } from "lucide-react";

export default function MakeAnnouncementPage() {
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem("campushub_admin_announcements");
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    }
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Error", "Announcement content cannot be empty.");
      return;
    }

    const newAnn = {
      id: `ann-${Math.random().toString(36).substring(7)}`,
      content: content.trim(),
      date: new Date().toLocaleString(),
      postedBy: "System Administrator",
    };

    const updated = [...announcements, newAnn];
    setAnnouncements(updated);
    localStorage.setItem("campushub_admin_announcements", JSON.stringify(updated));
    setContent("");
    
    // Dispatch custom event to notify layout top-bar in real time
    window.dispatchEvent(new Event("campushub_announcements_updated"));
    
    toast.success("Success", "Announcement published successfully to all portals.");
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter((ann) => ann.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("campushub_admin_announcements", JSON.stringify(updated));
    
    // Dispatch custom event to notify layout top-bar in real time
    window.dispatchEvent(new Event("campushub_announcements_updated"));
    
    toast.error("Removed", "Announcement deleted.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">
          Make an Announcement
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Publish notices, updates, or alerts to be displayed at the top of all user portals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm space-y-4 text-foreground">
          <h3 className="font-bold text-sm">Write Announcement</h3>
          <form onSubmit={handlePublish} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Announcement Text</label>
              <textarea
                className="w-full text-xs p-3 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px] text-foreground"
                placeholder="Type your notice here (e.g. 'All presidents meet in my office' or 'Today no practices due to rain')...."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs py-2 px-4 rounded-lg">
              <Megaphone className="h-3.5 w-3.5 mr-1.5" /> Publish Announcement
            </Button>
          </form>
        </div>

        {/* Help box */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-3">
          <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-blue-500" /> Notice Board Info
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            Announcements published here will immediately trigger a red notification dot at the top bar of:
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1 pl-1">
            <li>Student Portal</li>
            <li>Club Officers Portal</li>
            <li>Faculty Portal</li>
            <li>Admin Dashboard</li>
          </ul>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-foreground">Published Announcements ({announcements.length})</h3>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-10 rounded-xl border bg-card text-muted-foreground text-xs">
              No active announcements.
            </div>
          ) : (
            [...announcements].reverse().map((ann) => (
              <div key={ann.id} className="rounded-xl border bg-card p-5 shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {ann.date}
                    </span>
                    <span>·</span>
                    <span>Posted by {ann.postedBy}</span>
                  </div>
                  <p className="text-xs text-foreground font-medium leading-relaxed">{ann.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="h-7 w-7 rounded-lg border border-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
