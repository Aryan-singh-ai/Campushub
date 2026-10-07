"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const MOCK_PROPOSALS = [
  {
    id: "p-001",
    title: "Robotics Workshop Series",
    club: "Coding Club",
    status: "PENDING",
    submittedAt: "2025-06-25T10:00:00.000Z",
  },
  {
    id: "p-002",
    title: "Cultural Night – Monsoon Edition",
    club: "Cultural Committee",
    status: "PENDING",
    submittedAt: "2025-06-20T14:00:00.000Z",
  },
  {
    id: "p-003",
    title: "Career Guidance Workshop",
    club: "Career Cell",
    status: "PENDING",
    submittedAt: "2025-06-22T09:00:00.000Z",
  },
];

const statusBadge: Record<string, { variant: "default" | "success" | "destructive" | "secondary" | "warning"; label: string; icon: React.FC<any> }> = {
  PENDING: { variant: "secondary", label: "PENDING", icon: Clock },
  APPROVED: { variant: "success", label: "APPROVED", icon: CheckCircle },
  REJECTED: { variant: "destructive", label: "REJECTED", icon: XCircle },
  REVISION_REQUESTED: { variant: "warning", label: "REVISE", icon: AlertCircle },
  RESUBMITTED: { variant: "secondary", label: "REVISED", icon: Clock },
};

export function RequestsList() {
  const [proposals, setProposals] = React.useState<any[]>(MOCK_PROPOSALS);

  React.useEffect(() => {
    const stored = localStorage.getItem("campushub_proposals");
    if (stored) {
      setProposals(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="space-y-4">
      {proposals.map((p) => {
        const statusConfig = statusBadge[p.status] ?? statusBadge.PENDING;
        const { variant, label, icon: Icon } = statusConfig;
        return (
          <div key={p.id} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all space-y-2 text-foreground">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{p.title}</p>
                  <p className="text-[11px] text-muted-foreground">{p.club}</p>
                </div>
              </div>
              <Badge variant={variant}>
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground pl-10">
              Submitted: {p.date || new Date(p.submittedAt).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
