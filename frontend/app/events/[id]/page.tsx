"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  Users,
  ClipboardList,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [event, setEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch(`/events/${id}`)
      .then((d) => { if (d.success) setEvent(d.event); })
      .catch(() => router.push("/events"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) return null;

  const formSections = event.registrationForm?.sections ?? [];
  const totalFields = formSections.reduce(
    (acc: number, s: any) => acc + (s.fields?.length ?? 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </button>

      {/* Event hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card shadow-md overflow-hidden"
      >
        {/* Gradient banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-violet-500/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/60" />
        </div>

        <div className="px-8 pb-8 -mt-6 relative">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge>{event.category?.name ?? "General"}</Badge>
            {event.isPaid ? (
              <Badge variant="secondary">
                <DollarSign className="h-3 w-3" />
                Paid · ₹{event.regFee}
              </Badge>
            ) : (
              <Badge variant="success">
                <CheckCircle className="h-3 w-3" />
                Free Entry
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            {event.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            {event.description}
          </p>

          {/* Meta info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Date & Time</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Venue</p>
                <p className="text-sm font-semibold text-foreground">{event.venue}</p>
              </div>
            </div>

            {totalFields > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Registration Form</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formSections.length} section{formSections.length !== 1 ? "s" : ""} · {totalFields} field{totalFields !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {event.isPaid && (
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-primary/5 border-primary/20">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Registration Fee</p>
                  <p className="text-sm font-bold text-primary">₹{event.regFee}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Registration form preview */}
      {formSections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card shadow-sm p-6 space-y-4"
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Registration Form Overview
            </h2>
          </div>
          <div className="space-y-3">
            {formSections.map((sec: any) => (
              <div key={sec.id} className="p-3 rounded-lg border bg-muted/20 space-y-1">
                <p className="text-xs font-bold text-foreground">{sec.title}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sec.fields.map((f: any) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-background text-muted-foreground"
                    >
                      {f.label}
                      {f.isRequired && <span className="text-destructive">*</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row items-center gap-3 border-t pt-6"
      >
        <Link href={`/events/${id}/register`} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 px-8 text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Register for this Event
          </Button>
        </Link>
        <Link href={`/events/${id}/register?external=true`} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto h-11 px-6 text-sm flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Register as External Student
          </Button>
        </Link>
        <Link href="/events" className="w-full sm:w-auto">
          <Button variant="ghost" className="w-full sm:w-auto h-11 text-sm flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Events
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
