"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Code, Palette, Trophy, Leaf, BookOpen, Camera, Music, Cpu, Phone, Mail, X } from "lucide-react";

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  president: string;
  presidentInfo: Contact;
  vpInfo: Contact;
  icon: any;
  color: string;
  iconColor: string;
  events: number;
}

const CLUBS: Club[] = [
  {
    id: "club-001",
    name: "Coding Club",
    category: "Technical",
    description: "Build projects, compete in hackathons, and grow your programming skills with like-minded developers.",
    members: 142,
    president: "Arjun Mehta",
    presidentInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    vpInfo: { name: "Sneha Iyer", email: "vp@university.edu", phone: "+91-98765-43213" },
    icon: Code,
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
    events: 12,
  },
  {
    id: "club-002",
    name: "AI Research Club",
    category: "Technical",
    description: "Explore cutting-edge AI and machine learning research with weekly paper readings and project workshops.",
    members: 89,
    president: "Arjun Mehta",
    presidentInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    vpInfo: { name: "Sneha Jenkins", email: "vp@university.edu", phone: "+91-98765-43214" },
    icon: Cpu,
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-500",
    events: 8,
  },
  {
    id: "club-003",
    name: "Fine Arts Club",
    category: "Cultural",
    description: "Express your creativity through visual arts, theatre, and cultural performances throughout the year.",
    members: 75,
    president: "Sneha Iyer",
    presidentInfo: { name: "Sneha Iyer", email: "vp@university.edu", phone: "+91-98765-43213" },
    vpInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    icon: Palette,
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20",
    iconColor: "text-pink-500",
    events: 6,
  },
  {
    id: "club-004",
    name: "Photography Club",
    category: "Cultural",
    description: "Learn photography techniques, participate in exhibitions, and capture the beauty of campus life.",
    members: 63,
    president: "Sneha Iyer",
    presidentInfo: { name: "Sneha Iyer", email: "vp@university.edu", phone: "+91-98765-43213" },
    vpInfo: { name: "Sneha Jenkins", email: "vp@university.edu", phone: "+91-98765-43214" },
    icon: Camera,
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
    iconColor: "text-amber-500",
    events: 5,
  },
  {
    id: "club-005",
    name: "Sports Club",
    category: "Sports",
    description: "Compete in inter-college tournaments, stay fit, and build team spirit through various sporting events.",
    members: 210,
    president: "Arjun Mehta",
    presidentInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    vpInfo: { name: "Karthik Rajan", email: "student@university.edu", phone: "+91-98765-43215" },
    icon: Trophy,
    color: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    iconColor: "text-green-500",
    events: 15,
  },
  {
    id: "club-006",
    name: "Eco Warriors Club",
    category: "Social",
    description: "Drive sustainability initiatives, tree plantation drives, and environmental awareness campaigns on campus.",
    members: 55,
    president: "Arjun Mehta",
    presidentInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    vpInfo: { name: "Aditya Verma", email: "student@university.edu", phone: "+91-98765-43216" },
    icon: Leaf,
    color: "from-teal-500/10 to-cyan-500/10 border-teal-500/20",
    iconColor: "text-teal-500",
    events: 4,
  },
  {
    id: "club-007",
    name: "Quiz Club",
    category: "Academic",
    description: "Challenge your knowledge across general knowledge, science, current affairs, and academic subjects.",
    members: 48,
    president: "Arjun Mehta",
    presidentInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    vpInfo: { name: "Divya Menon", email: "student@university.edu", phone: "+91-98765-43217" },
    icon: BookOpen,
    color: "from-orange-500/10 to-red-500/10 border-orange-500/20",
    iconColor: "text-orange-500",
    events: 7,
  },
  {
    id: "club-008",
    name: "Music Society",
    category: "Cultural",
    description: "Celebrate musical talent through performances, jam sessions, and collaborations across genres.",
    members: 92,
    president: "Sneha Iyer",
    presidentInfo: { name: "Sneha Iyer", email: "vp@university.edu", phone: "+91-98765-43213" },
    vpInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    icon: Music,
    color: "from-indigo-500/10 to-blue-500/10 border-indigo-500/20",
    iconColor: "text-indigo-500",
    events: 9,
  },
  {
    id: "club-009",
    name: "Dance Club",
    category: "Cultural",
    description: "Express rhythm and passion through classical, contemporary, and street dance styles.",
    members: 110,
    president: "Arjun Mehta",
    presidentInfo: { name: "Arjun Mehta", email: "president@university.edu", phone: "+91-98765-43212" },
    vpInfo: { name: "Sneha Jenkins", email: "vp@university.edu", phone: "+91-98765-43214" },
    icon: Music,
    color: "from-amber-500/10 to-red-500/10 border-amber-500/20",
    iconColor: "text-amber-600",
    events: 7,
  },
];

const CATEGORIES = ["ALL", "Technical", "Cultural", "Sports", "Social", "Academic"];

export default function ClubsPage() {
  const [filter, setFilter] = React.useState("ALL");
  const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);

  const filtered = CLUBS.filter((c) => filter === "ALL" || c.category === filter);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Header */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent py-14 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Campus Clubs
          </motion.h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Discover and join clubs that match your passions. Every club hosts events managed through GD Goenka Campus Hub.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold">
              <Users className="h-3.5 w-3.5 text-primary" />
              {CLUBS.reduce((a, c) => a + c.members, 0).toLocaleString()} Members
            </span>
            <span className="flex items-center gap-1 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
              {CLUBS.length} Active Clubs
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              filter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clubs Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((club, i) => {
            const Icon = club.icon;
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedClub(club)}
                className={`rounded-xl border bg-gradient-to-br ${club.color} p-5 space-y-3 hover:shadow-md transition-all duration-200 group cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg bg-background/60 border ${club.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground border rounded-full px-2 py-0.5 bg-background/40">
                    {club.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{club.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                    {club.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {club.members} members
                  </span>
                  <span className="text-[10px] font-semibold text-primary">
                    {club.events} events hosted
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  President: <span className="font-semibold text-foreground">{club.president}</span>
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Club Details Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedClub(null)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl"
          >
            {/* Modal Header */}
            <div className={`p-6 border-b bg-gradient-to-br ${selectedClub.color} flex justify-between items-start`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground border rounded-full px-2.5 py-0.5 bg-background/60">
                  {selectedClub.category}
                </span>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-2">
                  <span className={selectedClub.iconColor}>
                    {React.createElement(selectedClub.icon, { className: "h-5 w-5 inline" })}
                  </span>
                  <span>{selectedClub.name}</span>
                </h2>
              </div>
              <button
                onClick={() => setSelectedClub(null)}
                className="h-8 w-8 rounded-full border bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">About the Club</h4>
                <p className="text-muted-foreground leading-relaxed text-sm">{selectedClub.description}</p>
              </div>

              {/* Roster Stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                <div className="text-center bg-muted/20 p-2.5 rounded-lg border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Active Members</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{selectedClub.members}</p>
                </div>
                <div className="text-center bg-muted/20 p-2.5 rounded-lg border">
                  <p className="text-[10px] text-muted-foreground font-semibold">Events Hosted</p>
                  <p className="text-lg font-bold text-primary mt-0.5">{selectedClub.events}</p>
                </div>
              </div>

              {/* Leadership Contact Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Leadership Contacts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* President */}
                  <div className="p-3 border rounded-xl bg-card space-y-2 shadow-sm">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                      <span>Club President</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{selectedClub.presidentInfo.name}</p>
                      <a href={`mailto:${selectedClub.presidentInfo.email}`} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{selectedClub.presidentInfo.email}</span>
                      </a>
                      <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{selectedClub.presidentInfo.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Vice President */}
                  <div className="p-3 border rounded-xl bg-card space-y-2 shadow-sm">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
                      <span>Vice President</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{selectedClub.vpInfo.name}</p>
                      <a href={`mailto:${selectedClub.vpInfo.email}`} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{selectedClub.vpInfo.email}</span>
                      </a>
                      <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{selectedClub.vpInfo.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Club Action Button */}
              <div className="pt-4 border-t flex">
                <Link
                  href={`/clubs/${selectedClub.id}/join`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer"
                >
                  Join Club
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
