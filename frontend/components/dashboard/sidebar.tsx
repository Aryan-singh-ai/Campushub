"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, FileText, Users, LogOut,
  Ticket, Award, CheckSquare, CreditCard, UserCog, Bell, BarChart3, ClipboardList,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: React.FC<any> };

const NAV: Record<string, NavItem[]> = {
  STUDENT: [
    { href: "/dashboard/student",               label: "Overview",          icon: LayoutDashboard },
    { href: "/dashboard/student/my-club",        label: "My Club",           icon: Users },
    { href: "/dashboard/student/registrations",  label: "My Registrations",  icon: ClipboardList },
    { href: "/dashboard/student/tickets",        label: "My Tickets",        icon: Ticket },
    { href: "/dashboard/student/certificates",   label: "Certificates",      icon: Award },
    { href: "/events",                           label: "Browse Events",     icon: Calendar },
  ],
  GUEST: [
    { href: "/dashboard/student",               label: "Overview",          icon: LayoutDashboard },
    { href: "/dashboard/student/registrations",  label: "My Registrations",  icon: ClipboardList },
    { href: "/dashboard/student/tickets",        label: "My Tickets",        icon: Ticket },
    { href: "/events",                           label: "Browse Events",     icon: Calendar },
  ],
  PRESIDENT: [
    { href: "/dashboard/officers",               label: "Overview",          icon: LayoutDashboard },
    { href: "/dashboard/officers/events",        label: "Events Portfolio",  icon: Calendar },
    { href: "/dashboard/officers/proposals",     label: "Event Proposals",   icon: FileText },
    { href: "/dashboard/officers/members",       label: "Member Requests",   icon: Users },
    { href: "/dashboard/officers/announcements", label: "Announcements",     icon: Bell },
  ],
  FACULTY: [
    { href: "/dashboard/faculty",                label: "Overview",          icon: LayoutDashboard },
    { href: "/dashboard/faculty/approvals",      label: "Pending Approvals", icon: CheckSquare },
    { href: "/dashboard/faculty/events",         label: "Approved Events",   icon: Calendar },
    { href: "/dashboard/faculty/reports",        label: "Reports",           icon: BarChart3 },
  ],
  ADMIN: [
    { href: "/dashboard/admin",                  label: "Overview",          icon: LayoutDashboard },
    { href: "/dashboard/admin/users",            label: "User Management",   icon: UserCog },
    { href: "/dashboard/admin/payments",         label: "Payment Verify",    icon: CreditCard },
    { href: "/dashboard/admin/events",           label: "All Events",        icon: Calendar },
    { href: "/dashboard/admin/reports",          label: "Analytics",         icon: BarChart3 },
    { href: "/dashboard/admin/announcements",    label: "Make an Announcement", icon: Bell },
  ],
  EVENT_HEAD: [
    { href: "/dashboard/event-head",             label: "Overview",          icon: LayoutDashboard },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  STUDENT:        "Student Portal",
  GUEST:          "External Student Portal",
  PRESIDENT:      "Presidents/Vice Presidents",
  FACULTY:        "Faculty Portal",
  ADMIN:          "Admin Portal",
  EVENT_HEAD:     "Event Head Portal",
};

const ROLE_COLORS: Record<string, string> = {
  STUDENT:        "bg-blue-500/10 text-blue-500",
  GUEST:          "bg-indigo-500/10 text-indigo-500",
  PRESIDENT:      "bg-violet-500/10 text-violet-500",
  FACULTY:        "bg-green-500/10 text-green-500",
  ADMIN:          "bg-pink-500/10 text-pink-500",
  EVENT_HEAD:     "bg-amber-500/10 text-amber-500",
};

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedClub, setSelectedClub] = React.useState<{ id: string; name: string } | null>(null);

  const loadSelectedClub = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("campushub_selected_club");
      if (stored) {
        try {
          setSelectedClub(JSON.parse(stored));
        } catch {}
      } else {
        setSelectedClub(null);
      }
    }
  };

  React.useEffect(() => {
    loadSelectedClub();
    window.addEventListener("campushub_selected_club_updated", loadSelectedClub);
    window.addEventListener("focus", loadSelectedClub);
    return () => {
      window.removeEventListener("campushub_selected_club_updated", loadSelectedClub);
      window.removeEventListener("focus", loadSelectedClub);
    };
  }, []);

  if (!user) return null;
  const links = NAV[user.role] ?? [];
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r bg-card h-[calc(100vh-3.5rem)] sticky top-14">
      {/* Role label */}
      <div className="px-4 pt-5 pb-3 border-b flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate flex-1">
          {user.role === "PRESIDENT" && selectedClub 
            ? `${selectedClub.name}` 
            : ROLE_LABELS[user.role]}
        </p>
        {user.role === "PRESIDENT" && (
          <Link href="/dashboard/officers/select-club" className="text-[9px] font-semibold text-primary hover:underline shrink-0 ml-1">
            Switch
          </Link>
        )}
      </div>

      {/* User pill */}
      <div className="px-3 py-3 border-b">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50">
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0", ROLE_COLORS[user.role])}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground capitalize truncate">
              {user.role.replace("_", " ").toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
