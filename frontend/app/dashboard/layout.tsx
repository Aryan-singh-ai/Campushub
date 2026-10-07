"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Bell, X, Megaphone } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showAnnouncements, setShowAnnouncements] = React.useState(false);
  const [announcements, setAnnouncements] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("campushub_admin_announcements");
      if (stored) {
        setAnnouncements(JSON.parse(stored));
      } else {
        setAnnouncements([]);
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener("campushub_storage_updated", load);
    window.addEventListener("focus", load);
    window.addEventListener("campushub_announcements_updated", load);
    
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("campushub_storage_updated", load);
      window.removeEventListener("focus", load);
      window.removeEventListener("campushub_announcements_updated", load);
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-0">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col min-h-0 bg-background text-foreground">
        {/* Top Header inside the dashboard portals */}
        <header className="h-12 border-b bg-card/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <p className="text-xs font-semibold text-muted-foreground">GD Goenka Campus Hub</p>
          <button
            onClick={() => setShowAnnouncements(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 relative cursor-pointer"
          >
            <Megaphone className="h-3.5 w-3.5" />
            Announcements
            {announcements.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-1 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center border border-background">
                {announcements.length}
              </span>
            )}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </div>

        {/* Announcements Modal Drawer Overlay */}
        {showAnnouncements && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-md h-full border-l bg-card shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-foreground">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base">Notice Board</h3>
                </div>
                <button
                  onClick={() => setShowAnnouncements(false)}
                  className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground space-y-2">
                    <Megaphone className="h-10 w-10 mx-auto opacity-30" />
                    <p className="text-sm font-semibold">No Announcements Yet</p>
                    <p className="text-xs">Notices posted by the administrator will appear here.</p>
                  </div>
                ) : (
                  [...announcements].reverse().map((ann) => (
                    <div key={ann.id} className="p-4 rounded-xl border bg-muted/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] uppercase text-primary tracking-wider">
                          Broadcast
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {ann.date || "Just now"}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed font-medium">
                        {ann.content}
                      </p>
                      <p className="text-[10px] text-muted-foreground text-right">
                        — Posted by {ann.postedBy || "Administrator"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
