"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarChart3, TrendingUp, Users, DollarSign, Award, ArrowUpRight } from "lucide-react";

export default function FacultyReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          A statistical summary of events, participation, and budget utilization.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Registrations"
          value="210"
          icon={Users}
          description="across all approved events"
          trend={{ value: "+28% vs last month", isPositive: true }}
        />
        <StatCard
          title="Total Budget Utilized"
          value="₹11,700"
          icon={DollarSign}
          description="allocated from funds"
          trend={{ value: "Remaining: ₹25,000", isPositive: true }}
        />
        <StatCard
          title="Completion Rate"
          value="92%"
          icon={TrendingUp}
          description="scheduled events completed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        {/* Participation Breakdown */}
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-foreground">Participation Breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Registrations by event category</p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: "Technical Events", value: "142", percentage: 67, color: "bg-blue-500" },
              { label: "Cultural Events", value: "68", percentage: 33, color: "bg-violet-500" },
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

        {/* Top Active Clubs */}
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-foreground">Top Performing Clubs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Active event count & participation</p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { club: "Coding Club", events: 3, students: 142 },
              { club: "Fine Arts Club", events: 1, students: 68 },
            ].map((item, i) => (
              <div key={item.club} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">0{i + 1}</span>
                  <span className="font-bold text-foreground">{item.club}</span>
                </div>
                <div className="text-right text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.events}</span> events · <span className="font-semibold text-foreground">{item.students}</span> participants
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
