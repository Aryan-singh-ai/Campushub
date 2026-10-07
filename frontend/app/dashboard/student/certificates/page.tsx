"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Download, Calendar, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const CERTIFICATES = [
  {
    id: "CERT-2025-1122",
    event: "CSE Tech Fest 2024",
    issued: "August 10, 2024",
    type: "Participation",
    track: "Hackathon – Runner Up 🥈",
    color: "from-violet-500/10 to-purple-500/5 border-violet-500/30",
    accent: "text-violet-500",
  },
];

const PENDING = [
  { id: "p-1", event: "Annual Photography Showcase", date: "Aug 15, 2025", note: "Certificate issued after event completion." },
  { id: "p-2", event: "Sports Meet 2025", date: "Sep 20, 2025", note: "Attendance must be verified at the gate." },
];

export default function StudentCertificatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
        <p className="text-muted-foreground text-sm mt-1">Download your participation and achievement certificates.</p>
      </div>

      {/* Earned */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-green-500" /> Certificates Earned
        </h2>
        {CERTIFICATES.map((cert, i) => (
          <motion.div key={cert.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-xl border-2 bg-gradient-to-br ${cert.color} p-6 flex items-center justify-between gap-4 shadow-md`}>
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-background/70 border flex items-center justify-center ${cert.accent}`}>
                <Award className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="success" className="mb-1">Issued ✓</Badge>
                <h3 className="font-bold text-base text-foreground">{cert.event}</h3>
                <p className={`text-xs font-semibold ${cert.accent} mt-0.5`}>{cert.track}</p>
                <div className="flex gap-3 text-[11px] text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Issued: {cert.issued}</span>
                  <span>ID: <span className="font-mono font-semibold text-foreground">{cert.id}</span></span>
                </div>
              </div>
            </div>
            <Button size="sm" onClick={() => toast.success("Certificate Downloaded", `${cert.event} certificate saved.`)}
              className="flex items-center gap-1.5 shrink-0">
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Pending */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pending Certificates</h2>
        {PENDING.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4 shadow-sm opacity-70">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{p.event}</p>
                <p className="text-[11px] text-muted-foreground">{p.note}</p>
              </div>
            </div>
            <Badge variant="secondary">Pending</Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
