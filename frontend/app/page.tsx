"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Star, 
  RefreshCw,
  Search,
  Cpu,
  Palette,
  Code,
  CheckCircle2,
  ChevronDown,
  QrCode,
  Coins,
  ThumbsUp,
  MapPin,
  Clock,
  ExternalLink,
  Award
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api-client";

export default function HomePage() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"student" | "leader" | "faculty" | "admin">("student");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  React.useEffect(() => {
    apiFetch("/events")
      .then((d) => {
        if (d.success) setEvents(d.events);
      })
      .catch((e) => console.error("Error fetching events:", e))
      .finally(() => setLoadingEvents(false));
  }, []);

  const handleResetPrototype = () => {
    if (window.confirm("Are you sure you want to reset the prototype? This will clear all registrations, chat messages, event proposals, and dynamic clubs, restoring the app to its default state.")) {
      localStorage.clear();
      toast.success("Prototype Reset Successful", "All custom activities and local storage values have been cleared.");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const filteredEvents = events.filter((e) => {
    const term = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term) ||
      (e.category?.name || "General").toLowerCase().includes(term) ||
      (e.venue || "").toLowerCase().includes(term)
    );
  });

  const STATS = [
    { label: "Active Clubs", value: "9+", detail: "Tech, Sports & Culture", color: "text-blue-500" },
    { label: "Weekly Events", value: "3+", detail: "Seminars & hackathons", color: "text-indigo-500" },
    { label: "Active Students", value: "800+", detail: "Vibrant campus community", color: "text-violet-500" },
    { label: "Verification Time", value: "Instant", detail: "UPI & QR integration", color: "text-emerald-500" }
  ];

  const SPOTLIGHT_CLUBS = [
    {
      id: "club-001",
      name: "Coding Club",
      category: "Technical",
      icon: Code,
      desc: "Build real-world projects, compete in hackathons, and learn web development.",
      members: "140+",
      color: "from-blue-500/20 via-indigo-500/5 to-transparent border-blue-500/30",
      accent: "text-blue-500",
      pill: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      id: "club-002",
      name: "AI Research Club",
      category: "Technical",
      icon: Cpu,
      desc: "Delve into cutting-edge machine learning models, neural networks, and prompt engineering.",
      members: "80+",
      color: "from-violet-500/20 via-purple-500/5 to-transparent border-violet-500/30",
      accent: "text-violet-500",
      pill: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
    },
    {
      id: "club-003",
      name: "Fine Arts Club",
      category: "Cultural",
      icon: Palette,
      desc: "Ignite visual designs, canvas paintings, wall murals, and college fest decorations.",
      members: "75+",
      color: "from-pink-500/20 via-rose-500/5 to-transparent border-pink-500/30",
      accent: "text-pink-500",
      pill: "bg-pink-500/10 text-pink-600 dark:text-pink-400"
    }
  ];

  const ROLE_FLOWS = {
    student: {
      title: "Student Experience",
      badge: "Fast & Secure",
      steps: [
        { icon: Search, title: "1. Discover", desc: "Search sports meets, tech workshops, and hackathons live." },
        { icon: Coins, title: "2. Register & Pay", desc: "Select tracks, enter student details, and upload UPI receipt logs." },
        { icon: QrCode, title: "3. Instant Ticket", desc: "Collect verification updates and digital tickets for gate check-in." }
      ]
    },
    leader: {
      title: "Club Leader Workspace",
      badge: "Dynamic Auditing",
      steps: [
        { icon: Sparkles, title: "1. Create Event", desc: "Propose event forms, set entry limits, registration fees, and tags." },
        { icon: Users, title: "2. Roster Control", desc: "Track registrants, view spreadsheet data, and manage waitlists." },
        { icon: ArrowRight, title: "3. Announcements", desc: "Broadcast event schedule changes or updates to members in real-time." }
      ]
    },
    faculty: {
      title: "Faculty Supervisor Desk",
      badge: "Instant Approval",
      steps: [
        { icon: Calendar, title: "1. Review Requests", desc: "Inspect dates, clash detection, budget requests, and venues." },
        { icon: ThumbsUp, title: "2. Fast Approvals", desc: "One-click approval updates the student homepage and event calendar." },
        { icon: Shield, title: "3. Check Analytics", desc: "Access engagement stats, attendee reports, and event summaries." }
      ]
    },
    admin: {
      title: "Administrator Controls",
      badge: "Complete Oversight",
      steps: [
        { icon: Shield, title: "1. Verify Payments", desc: "Approve or reject payments by reviewing transaction screenshots." },
        { icon: CheckCircle2, title: "2. System Health", desc: "Reset active mock databases, configure properties, and check audit tables." },
        { icon: RefreshCw, title: "3. Sync Directory", desc: "Manage roles (Student, Leader, Faculty, Admin) and permissions." }
      ]
    }
  };

  const FAQS = [
    {
      q: "How do I register and pay for college events?",
      a: "Simply head over to the Events page, click 'Register Now' on your preferred event, and fill out the custom form. If it's a paid event, scan the displayed UPI QR code, complete the transaction in your bank app, and upload the screenshot along with the 12-digit UTR reference number."
    },
    {
      q: "Can club leaders modify registration forms after publishing?",
      a: "Once an event proposal is approved by the Faculty supervisor, the registration fields are locked to prevent data mismatches. However, club leaders can post real-time event updates or announcements to notify registered students of scheduling shifts."
    },
    {
      q: "How do attendance check-ins work on the event day?",
      a: "Event hosts or club coordinators can check in attendees by searching their enrollment numbers or using the digital pass details shown in the user's dashboard registrations list. Check-ins are updated in real-time."
    },
    {
      q: "How can I test the prototype with different roles?",
      a: "You can click 'Log In Now' and use any of the pre-seeded accounts shown on the login page (Student, Club Leader, Faculty, Admin). To revert modifications at any point, click the red floating reset button at the bottom-right."
    }
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 overflow-hidden py-12 md:py-20 border-b">
        
        {/* Ambient Dark/Light Gradients on top of Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 opacity-75 dark:opacity-[0.55] pointer-events-none"
          style={{ backgroundImage: `url('/campus-bg.png')` }}
        />
        
        {/* Aesthetic glass masking layer */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-background/70 via-background/45 to-background dark:from-background/80 dark:via-background/55 dark:to-background pointer-events-none" />
        
        {/* Glow Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-10 right-10 w-60 h-60 md:w-80 md:h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

        <div className="relative z-10 max-w-4xl w-full text-center space-y-6 md:space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-primary/10 dark:bg-primary/20 text-xs font-bold text-primary backdrop-blur-md shadow-sm border-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-spin duration-3000" />
            GDGU Event Hub Live Portal
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] md:leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                GD Goenka Event Hub
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-foreground/85 font-medium text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              The unified digital platform to join dynamic student clubs, register for hackathons or cultural fests, submit event proposals, and coordinate fast check-ins.
            </motion.p>
          </div>

          {/* Interactive Search Overlay Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto w-full px-2"
          >
            <div className="relative group shadow-xl shadow-primary/5">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search upcoming events, clubs, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-card/60 dark:bg-card/45 backdrop-blur-xl border border-border/80 focus:border-primary/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
              <div className="absolute inset-y-2 right-2 flex items-center">
                <button
                  onClick={() => {
                    const el = document.getElementById("events-feed");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md active:scale-95"
                >
                  Find Event
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            {/* Quick Interactive Tags */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-xs text-muted-foreground">
              <span>Try searching:</span>
              {["Tech Fest", "Badminton", "Photography", "Coding"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-lg border bg-card/40 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-medium cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-destructive font-semibold hover:underline ml-1"
                >
                  Clear search
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.4 }}
            >
              <Link
                href="/events"
                className="flex flex-col items-center p-6 rounded-2xl border bg-card/45 dark:bg-card/30 backdrop-blur-md hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-full text-foreground"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Browse Events Calendar</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Register for hackathons, quizzes, and workshops.</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.5 }}
            >
              <Link
                href="/clubs"
                className="flex flex-col items-center p-6 rounded-2xl border bg-card/45 dark:bg-card/30 backdrop-blur-md hover:bg-indigo-500/5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group cursor-pointer h-full text-foreground"
              >
                <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm text-foreground group-hover:text-indigo-500 transition-colors">Explore Student Clubs</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Discover campus clubs, contact officers, and join groups.</span>
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-b py-10 px-4 bg-muted/20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-2xl border bg-card/65 backdrop-blur-sm flex flex-col items-center text-center space-y-1 hover:shadow-md transition-all group hover:border-primary/20 text-foreground"
              >
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground">{stat.label}</span>
                <span className="text-[11px] text-muted-foreground">{stat.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC EVENTS SECTION */}
      <section id="events-feed" className="py-20 px-4 border-b scroll-mt-6">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Upcoming Activities</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Featured Campus Events</h2>
              <p className="text-sm text-muted-foreground">Dynamic list of events currently open for registration.</p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline hover:gap-2 transition-all shrink-0"
            >
              See All Upcoming Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl border bg-card p-6 space-y-4 animate-pulse">
                  <div className="h-5 w-24 bg-muted rounded-full" />
                  <div className="h-6 w-3/4 bg-muted rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded-sm" />
                    <div className="h-4 w-2/3 bg-muted rounded-sm" />
                  </div>
                  <div className="h-10 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center space-y-4 max-w-lg mx-auto bg-muted/10">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm">No Events Found</h3>
                <p className="text-xs text-muted-foreground">We couldn&apos;t find any events matching &quot;{searchQuery}&quot;.</p>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredEvents.slice(0, 3).map((event, idx) => {
                const isPaid = event.isPaid;
                const dateObj = new Date(event.date);
                const isTech = event.category?.name === "Technical";
                const isCult = event.category?.name === "Cultural";
                const isSports = event.category?.name === "Sports";
                const badgeColor = isTech 
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                  : isCult 
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : isSports 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground";

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-col rounded-2xl border bg-card hover:bg-card/85 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group shadow-sm text-foreground"
                  >
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeColor}`}>
                          {event.category?.name || "General"}
                        </span>
                        {isPaid ? (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                            ₹{event.regFee}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            Free Entry
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-extrabold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="pt-2 space-y-2 border-t border-border/50 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>
                            {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>
                            {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-5">
                      <Link
                        href={`/events/${event.id}/register`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-all duration-300 text-foreground"
                      >
                        Register Spot
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. CLUBS SPOTLIGHT SECTION */}
      <section className="py-20 px-4 bg-muted/10 border-b">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Spotlight Directory</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Active Student Clubs</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Join active peer networks to level up your engineering, arts, and photography portfolios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPOTLIGHT_CLUBS.map((club, idx) => {
              const ClubIcon = club.icon;
              return (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  className={`relative rounded-2xl border p-6 bg-gradient-to-br ${club.color} flex flex-col space-y-4 hover:shadow-lg transition-all duration-300 group text-foreground`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-card border flex items-center justify-center ${club.accent} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <ClubIcon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${club.pill}`}>
                      {club.category}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    <h3 className="font-extrabold text-base text-foreground">{club.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {club.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" /> {club.members} Members
                    </span>
                    <Link
                      href="/clubs"
                      className="text-primary hover:underline flex items-center gap-1 hover:gap-1.5 transition-all"
                    >
                      Explore <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE ROLE-BASED FLOW */}
      <section className="py-20 px-4 border-b">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Unified Workflows</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">How GDGU Event Hub Works</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Select a portal perspective to explore role-specific tools built directly into the prototype.
            </p>
          </div>

          {/* Interactive Role Tabs */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border bg-muted/40 max-w-xl mx-auto">
            {(Object.keys(ROLE_FLOWS) as Array<keyof typeof ROLE_FLOWS>).map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role as any)}
                className={`flex-1 min-w-[100px] text-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === role 
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Interactive Tab Contents */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border bg-card p-8 md:p-10 shadow-md space-y-8 relative overflow-hidden text-foreground"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                  <h3 className="text-lg md:text-xl font-extrabold text-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {ROLE_FLOWS[activeTab].title}
                  </h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {ROLE_FLOWS[activeTab].badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {ROLE_FLOWS[activeTab].steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={index} className="space-y-3 relative group">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-4 border-t flex flex-wrap justify-between items-center gap-4 text-xs">
                  <span className="text-muted-foreground font-medium">Ready to try it yourself? Log in with a seeded role account.</span>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline hover:gap-2 transition-all"
                  >
                    Switch User Role now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="py-20 px-4 bg-muted/5 border-b">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Help Center</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">
              Clear up questions on event workflows, registrations, and payment verification.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border bg-card overflow-hidden shadow-sm transition-colors hover:border-primary/20 text-foreground"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-foreground cursor-pointer transition-all hover:bg-muted/10"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-4 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="p-5 pt-0 border-t border-border/40 text-xs text-muted-foreground leading-relaxed bg-muted/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 px-4 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Jump In?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Log in with pre-seeded role credentials or explore the full lists of campus clubs and upcoming events now.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-sm transition-all cursor-pointer shadow-sm active:scale-95 text-foreground"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Sign Up (Guest)
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all cursor-pointer shadow-md shadow-primary/20 active:scale-95 text-foreground"
            >
              <Calendar className="h-4 w-4 text-primary-foreground" />
              Log In Now
            </Link>
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-all cursor-pointer shadow-sm active:scale-95"
            >
              View Clubs Directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FLOATING RESET BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleResetPrototype}
          title="Reset Prototype Data"
          className="h-11 w-11 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg border border-destructive/20 hover:bg-destructive/90 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

    </div>
  );
}
