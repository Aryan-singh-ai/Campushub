"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Sparkles, Check } from "lucide-react";
import Link from "next/link";

const CLUB_NAMES: Record<string, string> = {
  "club-001": "Coding Club",
  "club-002": "AI Research Club",
  "club-003": "Fine Arts Club",
  "club-004": "Photography Club",
  "club-005": "Sports Club",
  "club-006": "Eco Warriors Club",
  "club-007": "Quiz Club",
  "club-008": "Music Society",
  "club-009": "Dance Club",
};

export default function JoinClubPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const clubName = CLUB_NAMES[id] || "Club";

  // Form State
  const [name, setName] = React.useState("");
  const [enrollment, setEnrollment] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [rating, setRating] = React.useState<number | null>(null);
  const [performedOnStage, setPerformedOnStage] = React.useState<"Yes" | "No" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !enrollment.trim() || !phone.trim() || !about.trim() || !rating || !performedOnStage) {
      toast.error("Error", "Please fill in all details and complete the selections.");
      return;
    }

    const newRequest = {
      id: `mr-custom-${Math.random().toString(36).substring(7)}`,
      name: name.trim(),
      enrollment: enrollment.trim(),
      phone: phone.trim(),
      email: "student@university.edu",
      year: "2nd Year – CSE",
      club: clubName,
      clubId: id,
      reason: about.trim(),
      rating: rating,
      stagePerformance: performedOnStage,
      applied: "Just now",
      status: "PENDING"
    };

    // Load and append
    const stored = localStorage.getItem("campushub_member_requests");
    const requestsList = stored ? JSON.parse(stored) : [];
    localStorage.setItem("campushub_member_requests", JSON.stringify([newRequest, ...requestsList]));

    toast.success("Application Submitted", `Successfully applied to join ${clubName}!`);
    router.push("/clubs");
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Back Link */}
        <Link href="/clubs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Clubs
        </Link>

        <Card className="border shadow-lg bg-card">
          <CardHeader className="space-y-1.5 border-b bg-gradient-to-b from-primary/5 to-transparent pb-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Club Application</span>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              Join {clubName}
            </CardTitle>
            <CardDescription className="text-xs">
              Complete this quick form to submit your join request to the Club President.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-4 text-xs">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Full Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Karthik Rajan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Enrollment & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Enrollment Number</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. EN2022CS0421"
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Phone Number</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* About yourself */}
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">About Yourself / Why do you want to join?</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your interests, programming experience, projects, or creative passions..."
                  className="w-full text-xs p-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>

              {/* Skill Rating Selector (1 to 10) */}
              <div className="space-y-2 pt-2">
                <label className="font-semibold text-muted-foreground">
                  How good are you according to yourself? Rate (1 to 10)
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRating(val)}
                      className={`h-9 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        rating === val
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card border-border hover:border-primary/40 hover:bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage Performance Selectors */}
              <div className="space-y-2 pt-2">
                <label className="font-semibold text-muted-foreground">
                  Have you performed on stage before?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Yes, I have stage experience", value: "Yes" as const },
                    { label: "No, I do not have stage experience", value: "No" as const }
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPerformedOnStage(item.value)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 relative ${
                        performedOnStage === item.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-card hover:bg-muted/20"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        performedOnStage === item.value ? "border-primary bg-primary text-white" : "border-muted-foreground"
                      }`}>
                        {performedOnStage === item.value && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className="font-semibold leading-normal">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>

            <CardFooter className="border-t pt-4 pb-6 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-2 px-5 rounded-lg flex items-center gap-1.5 shadow-md shadow-primary/10">
                <Send className="h-3.5 w-3.5" /> Submit Application
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
