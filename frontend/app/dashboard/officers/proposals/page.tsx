"use client";

import React from "react";
import { RequestsList } from "@/components/dashboard/requests-list";

export default function OfficersProposalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Proposals</h1>
        <p className="text-muted-foreground text-sm mt-1">Create, edit, and track status of your club's event proposals submitted for faculty approval.</p>
      </div>
      <RequestsList />
    </div>
  );
}
