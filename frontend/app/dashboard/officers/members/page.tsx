"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  UserCheck, UserX, Clock, Mail, Hash, Phone, Star, 
  Presentation, MessageSquare, Send, X, Users, MessageCircle 
} from "lucide-react";

interface MemberRequest {
  id: string;
  name: string;
  enrollment: string;
  email: string;
  year: string;
  club: string;
  reason: string;
  applied: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  phone?: string;
  rating?: string | number;
  stagePerformance?: string;
}

interface ChatMessage {
  id: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  content: string;
  timestamp: string;
}

const DEFAULT_MOCK_REQUESTS: MemberRequest[] = [
  { id: "mr-001", name: "Abhishek Sharma", enrollment: "EN2022CS0201", email: "abhishek@university.edu", year: "2nd Year – CSE", club: "Coding Club", reason: "I love competitive programming and want to contribute to hackathon teams.", applied: "30 mins ago", status: "PENDING" },
  { id: "mr-002", name: "Priya Kapoor", enrollment: "EN2023IT0034", email: "priya@university.edu", year: "1st Year – IT", club: "AI Research Club", reason: "I have been studying ML and want to join a team working on real-world problems.", applied: "2 hours ago", status: "PENDING" },
  { id: "mr-003", name: "Rohan Das", enrollment: "EN2021ME0112", email: "rohan@university.edu", year: "3rd Year – Mech", club: "Coding Club", reason: "Looking to cross-discipline into tech and grow my programming skills.", applied: "Yesterday", status: "PENDING" },
  { id: "mr-004", name: "Ananya Singh", enrollment: "EN2022CS0305", email: "ananya@university.edu", year: "2nd Year – CSE", club: "Coding Club", reason: "Want to be part of the team for the upcoming Tech Fest hackathon.", applied: "2 days ago", status: "PENDING" },
  { id: "mr-005", name: "Aditi Sharma", enrollment: "EN2022CS0912", email: "aditi@university.edu", year: "3rd Year – CSE", club: "Dance Club", reason: "I have been training in contemporary dance for 4 years and want to lead core choreographies.", applied: "1 hour ago", status: "PENDING", phone: "+91-98765-11223", rating: 9, stagePerformance: "Yes" },
  { id: "mr-006", name: "Rahul Verma", enrollment: "EN2023ME0405", email: "rahul@university.edu", year: "1st Year – Mech", club: "Dance Club", reason: "I want to participate in group street dancing and learn from seniors.", applied: "4 hours ago", status: "PENDING", phone: "+91-98765-44332", rating: 6, stagePerformance: "No" }
];

export default function OfficersMembersPage() {
  const [selectedClub, setSelectedClub] = React.useState<{ id: string; name: string } | null>(null);
  const [requests, setRequests] = React.useState<MemberRequest[]>([]);
  const [activeTab, setActiveTab] = React.useState<"requests" | "members">("requests");

  // Private Chat Drawer States
  const [activeChatUser, setActiveChatUser] = React.useState<MemberRequest | null>(null);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState("");

  const loadData = () => {
    // 1. Load active club
    const storedClub = localStorage.getItem("campushub_selected_club");
    let activeClub = { id: "club-001", name: "Coding Club" };
    if (storedClub) {
      try {
        activeClub = JSON.parse(storedClub);
      } catch {}
    }
    setSelectedClub(activeClub);

    // 2. Load requests
    const storedRequests = localStorage.getItem("campushub_member_requests");
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    } else {
      localStorage.setItem("campushub_member_requests", JSON.stringify(DEFAULT_MOCK_REQUESTS));
      setRequests(DEFAULT_MOCK_REQUESTS);
    }
  };

  React.useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("focus", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Filter requests according to the selected club
  const clubRequests = requests.filter(
    (req) => selectedClub && req.club.toLowerCase() === selectedClub.name.toLowerCase()
  );

  const pendingRequests = clubRequests.filter((r) => r.status === "PENDING");
  const approvedMembers = clubRequests.filter((r) => r.status === "APPROVED");

  const handleAction = (id: string, name: string, action: "APPROVED" | "REJECTED") => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: action } : r));
    setRequests(updated);
    localStorage.setItem("campushub_member_requests", JSON.stringify(updated));

    if (action === "APPROVED") {
      toast.success("Member Approved", `${name} is now an active club member!`);
    } else {
      toast.error("Request Rejected", `${name}'s application was declined.`);
    }
  };

  // Chat Actions
  const openChatRoom = (member: MemberRequest) => {
    setActiveChatUser(member);
    loadChats(member.email);
  };

  const loadChats = (partnerEmail: string) => {
    const storedChats = localStorage.getItem("campushub_private_chats");
    const chats: ChatMessage[] = storedChats ? JSON.parse(storedChats) : [];
    
    // Get messages exchanged between President (president@university.edu) and this member
    const conversation = chats.filter(
      (m) =>
        (m.fromEmail === "president@university.edu" && m.toEmail === partnerEmail) ||
        (m.fromEmail === partnerEmail && m.toEmail === "president@university.edu")
    );
    setChatMessages(conversation);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    const msgPayload: ChatMessage = {
      id: `msg-${Math.random().toString(36).substring(7)}`,
      fromEmail: "president@university.edu",
      fromName: "Club President",
      toEmail: activeChatUser.email,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const storedChats = localStorage.getItem("campushub_private_chats");
    const chatsList = storedChats ? JSON.parse(storedChats) : [];
    const updatedChats = [...chatsList, msgPayload];

    localStorage.setItem("campushub_private_chats", JSON.stringify(updatedChats));
    setChatMessages((prev) => [...prev, msgPayload]);
    setNewMessage("");

    // Trigger local state refreshes in other focused windows
    window.dispatchEvent(new Event("campushub_new_message"));
  };

  // Poll chats periodically while drawer is open
  React.useEffect(() => {
    if (!activeChatUser) return;
    const interval = setInterval(() => loadChats(activeChatUser.email), 1000);
    return () => clearInterval(interval);
  }, [activeChatUser]);

  return (
    <div className="space-y-6 text-foreground relative min-h-[80vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-600">
            {selectedClub ? `${selectedClub.name} Roster` : "Club Roster Control"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage registrations, view current members, and message attendees directly.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-muted rounded-xl p-1 border text-xs font-semibold select-none">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "requests" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "members" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Club Members ({approvedMembers.length})
          </button>
        </div>
      </div>

      {/* Render Lists */}
      <div className="space-y-4">
        {activeTab === "requests" ? (
          /* PENDING REQUESTS PANEL */
          pendingRequests.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-card text-muted-foreground text-sm">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              No pending join requests for {selectedClub?.name || "this club"}.
            </div>
          ) : (
            pendingRequests.map((req, i) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{req.name}</p>
                      <p className="text-[11px] text-muted-foreground">{req.year}</p>
                    </div>
                  </div>
                  <Badge variant="secondary"><Clock className="h-3 w-3 mr-1 inline" />Pending</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  <div className="bg-muted/30 rounded-lg p-2.5 border flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-primary shrink-0" /><span className="font-semibold text-foreground">{req.enrollment}</span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2.5 border flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" /><span className="font-semibold truncate text-foreground">{req.email}</span>
                  </div>
                  {req.phone && (
                    <div className="bg-muted/30 rounded-lg p-2.5 border flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" /><span className="font-semibold text-foreground">{req.phone}</span>
                    </div>
                  )}
                  {req.rating && (
                    <div className="bg-muted/30 rounded-lg p-2.5 border flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-amber-500 shrink-0 fill-amber-500/10" />
                      <span className="text-muted-foreground">Self-Rating: </span>
                      <span className="font-bold text-foreground">{req.rating}/10</span>
                    </div>
                  )}
                  {req.stagePerformance && (
                    <div className="bg-muted/30 rounded-lg p-2.5 border flex items-center gap-1.5">
                      <Presentation className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="text-muted-foreground">Stage Exp: </span>
                      <span className="font-bold text-foreground">{req.stagePerformance}</span>
                    </div>
                  )}
                </div>

                <div className="bg-muted/20 rounded-lg p-3 border text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">About / Reason: </span>{req.reason}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{req.applied}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleAction(req.id, req.name, "REJECTED")}
                      className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer">
                      <UserX className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => handleAction(req.id, req.name, "APPROVED")} className="h-7 text-xs cursor-pointer bg-primary text-white">
                      <UserCheck className="h-3.5 w-3.5 mr-1" /> Approve Member
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )
        ) : (
          /* ACTIVE CLUB MEMBERS PANEL */
          approvedMembers.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-card text-muted-foreground text-sm">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              No active members in {selectedClub?.name || "this club"} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {approvedMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border bg-card p-4 flex flex-col justify-between hover:shadow-md hover:border-violet-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p 
                        onClick={() => openChatRoom(member)}
                        className="font-bold text-sm text-foreground hover:text-violet-600 cursor-pointer transition-colors hover:underline truncate"
                      >
                        {member.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">{member.enrollment}</p>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-semibold">{member.year}</span>
                    <Button 
                      size="sm" 
                      onClick={() => openChatRoom(member)}
                      className="h-7 text-[10px] cursor-pointer bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" /> Chat Private
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* PRIVATE SLIDE-OUT CHAT DRAWER */}
      <AnimatePresence>
        {activeChatUser && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveChatUser(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b bg-gradient-to-r from-violet-500/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {activeChatUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground leading-none">{activeChatUser.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-semibold mt-1">Private Message • {selectedClub?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveChatUser(null)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/10 flex flex-col">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground text-xs my-auto flex flex-col items-center gap-2">
                    <MessageCircle className="h-8 w-8 text-muted-foreground/30 animate-pulse" />
                    <span>No messages exchanged yet. Send a message to start chatting!</span>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.fromEmail === "president@university.edu";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          isMe ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? "bg-violet-600 text-white rounded-tr-none"
                              : "bg-muted text-foreground rounded-tl-none border"
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                        <span className="text-[9px] text-muted-foreground mt-1 px-1 font-semibold">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t bg-card flex gap-2 items-center">
                <Input
                  placeholder={`Message ${activeChatUser.name.split(" ")[0]}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="h-9 text-xs flex-1 bg-muted/40 border"
                />
                <Button type="submit" size="sm" className="h-9 w-9 p-0 shrink-0 bg-violet-600 text-white">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
