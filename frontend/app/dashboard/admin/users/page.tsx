"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Users, Mail, Hash, ShieldCheck, ShieldOff, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const USERS = [
  { id: "usr-001", name: "Karthik Rajan", email: "student@university.edu", role: "STUDENT", enrollment: "EN2022CS0421", status: "ACTIVE", joined: "Jun 1, 2025" },
  { id: "usr-002", name: "Arjun Mehta", email: "president@university.edu", role: "PRESIDENT", enrollment: "EN2020CS0011", status: "ACTIVE", joined: "May 15, 2025" },
  { id: "usr-003", name: "Sneha Iyer", email: "vp@university.edu", role: "VICE_PRESIDENT", enrollment: "EN2021CS0088", status: "ACTIVE", joined: "May 15, 2025" },
  { id: "usr-004", name: "Dr. Priya Nair", email: "faculty@university.edu", role: "FACULTY", enrollment: "FAC-2019-004", status: "ACTIVE", joined: "Jan 10, 2025" },
  { id: "usr-005", name: "System Admin", email: "admin@university.edu", role: "ADMIN", enrollment: "ADM-001", status: "ACTIVE", joined: "Jan 1, 2025" },
  { id: "usr-006", name: "Divya Menon", email: "divya@university.edu", role: "STUDENT", enrollment: "EN2022CS0302", status: "ACTIVE", joined: "Jun 10, 2025" },
  { id: "usr-007", name: "Rahul Verma", email: "rahul@university.edu", role: "STUDENT", enrollment: "EN2022ME0204", status: "SUSPENDED", joined: "Jun 5, 2025" },
];

const roleColor: Record<string, string> = {
  STUDENT: "bg-blue-500/10 text-blue-500",
  PRESIDENT: "bg-violet-500/10 text-violet-500",
  VICE_PRESIDENT: "bg-purple-500/10 text-purple-500",
  FACULTY: "bg-green-500/10 text-green-500",
  ADMIN: "bg-pink-500/10 text-pink-500",
};

export default function AdminUsersPage() {
  const [q, setQ] = React.useState("");
  const [statuses, setStatuses] = React.useState<Record<string, string>>(
    Object.fromEntries(USERS.map((u) => [u.id, u.status]))
  );

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase()) ||
    u.role.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = (id: string, name: string) => {
    const next = statuses[id] === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setStatuses((prev) => ({ ...prev, [id]: next }));
    
    if (next === "SUSPENDED") {
      toast.error("User Suspended", `${name}'s account has been suspended.`);
    } else {
      toast.success("User Activated", `${name}'s account has been reinstated.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{USERS.length} registered users across all roles.</p>
        </div>
        <div className="relative w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8 h-8 text-xs" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((u, i) => {
          const status = statuses[u.id];
          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-card shadow-sm p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${roleColor[u.role]}`}>
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1">
                <div>
                  <p className="font-bold text-sm text-foreground truncate">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{u.enrollment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor[u.role]}`}>
                    {u.role.replace("_", " ")}
                  </span>
                  <Badge variant={status === "ACTIVE" ? "success" : "destructive"}>{status}</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toggle(u.id, u.name)}
                className={`h-7 text-xs shrink-0 flex items-center gap-1.5 ${status === "ACTIVE" ? "border-destructive/40 text-destructive hover:bg-destructive/10" : ""}`}>
                {status === "ACTIVE" ? <><ShieldOff className="h-3 w-3" /> Suspend</> : <><ShieldCheck className="h-3 w-3" /> Reinstate</>}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
