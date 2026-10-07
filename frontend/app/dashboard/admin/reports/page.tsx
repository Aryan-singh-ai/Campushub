"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time metrics tracking user enrollment, payment volumes, and event success rates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Platform Users"
          value="874"
          icon={Users}
          description="active user profiles"
          trend={{ value: "+12% this week", isPositive: true }}
        />
        <StatCard
          title="Payment Transactions"
          value="₹43,058"
          icon={DollarSign}
          description="total revenue processed"
          trend={{ value: "98.9% success rate", isPositive: true }}
        />
        <StatCard
          title="System Health"
          value="99.8%"
          icon={Activity}
          description="average uptime last 30d"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        {/* User Breakdown */}
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-foreground">User Directory breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Distribution of roles across GD Goenka Event Hub</p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: "Students", value: "812", percentage: 93, color: "bg-blue-500" },
              { label: "Club Officers", value: "48", percentage: 5.5, color: "bg-violet-500" },
              { label: "Faculty / Coordinators", value: "12", percentage: 1.3, color: "bg-green-500" },
              { label: "System Admins", value: "2", percentage: 0.2, color: "bg-pink-500" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground">{item.value} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Summary */}
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-foreground">System Activity Summary</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Logs and process metrics</p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: "Event Registrations", value: "248 completed", rate: 94 },
              { label: "Payment Proofs Submitted", value: "62 proofs", rate: 88 },
              { label: "Faculty Approvals Granted", value: "14 proposals", rate: 100 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0 text-xs">
                <div>
                  <p className="font-bold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.value}</p>
                </div>
                <Badge variant={item.rate >= 90 ? "success" : "secondary"}>
                  {item.rate}% success
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
