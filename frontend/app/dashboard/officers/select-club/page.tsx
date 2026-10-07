"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code, Palette, Trophy, BookOpen, Music, Users, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CLUBS = [
  { id: "club-001", name: "Coding Club", category: "Technical", desc: "Software engineering, hackathons, and algorithmic challenges", icon: Code, color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500 hover:border-blue-500/40" },
  { id: "club-003", name: "Fine Arts Club", category: "Cultural", desc: "Painting, sketching, design, and drama workshops", icon: Palette, color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-500 hover:border-pink-500/40" },
  { id: "club-005", name: "Sports Club", category: "Sports", desc: "Basketball, cricket, tennis tournaments, and training sessions", icon: Trophy, color: "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-500 hover:border-green-500/40" },
  { id: "club-007", name: "Quiz Club", category: "Academic", desc: "General knowledge quizzes, debates, and trivia nights", icon: BookOpen, color: "from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-500 hover:border-orange-500/40" },
  { id: "club-009", name: "Dance Club", category: "Cultural", desc: "Choreography, cultural performances, and street dance competitions", icon: Music, color: "from-amber-500/10 to-red-500/10 border-amber-500/20 text-amber-600 hover:border-amber-500/40" }
];

export default function SelectClubPage() {
  const router = useRouter();

  const handleSelect = (club: { id: string; name: string }) => {
    localStorage.setItem("campushub_selected_club", JSON.stringify(club));
    toast.success("Welcome", `Logged in to the ${club.name} Dashboard`);
    
    // Dispatch event to sync sidebar
    window.dispatchEvent(new Event("campushub_selected_club_updated"));
    
    router.push("/dashboard/officers");
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20 py-12 px-4 min-h-[calc(100vh-4.5rem)] text-foreground">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-indigo-600">
            Select Your Club Portal
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            You are authenticated as an Officer. Choose the club dashboard you want to access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CLUBS.map((club, idx) => {
            const Icon = club.icon;
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  onClick={() => handleSelect(club)}
                  className={`cursor-pointer hover:shadow-md transition-all duration-200 h-full border hover:scale-[1.02] flex flex-col justify-between`}
                >
                  <CardContent className="p-5 flex flex-col gap-3 h-full justify-between">
                    <div className="space-y-3">
                      <div className={`h-10 w-15 rounded-xl border flex items-center justify-center bg-gradient-to-br ${club.color} shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{club.name}</h3>
                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-muted border text-muted-foreground mt-1 inline-block">
                          {club.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal line-clamp-3">
                        {club.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 mt-2">
                      Access Portal <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
