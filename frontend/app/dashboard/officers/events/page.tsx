"use client";

import React from "react";
import { EventsList } from "@/components/dashboard/events-list";

export default function OfficersEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events Portfolio</h1>
        <p className="text-muted-foreground text-sm mt-1">Track, manage, and register for events hosted by your club.</p>
      </div>
      <EventsList />
    </div>
  );
}
