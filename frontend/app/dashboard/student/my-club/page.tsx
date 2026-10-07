"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  Users, MessageSquare, Send, CheckCircle2, Clock, 
  ArrowRight, Shield, MessageCircle, X, Search, Globe 
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";

interface Club {
  id: string;
  name: string;
  category: string;
  desc: string;
  iconColor: string;
}

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
}

interface ChatMessage {
  id: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  content: string;
  timestamp: string;
}

interface GroupMessage {
  id: string;
  clubId: string;
  fromEmail: string;
  fromName: string;
  content: string;
  timestamp: string;
}

const CLUBS: Club[] = [
  { id: "club-001", name: "Coding Club", category: "Technical", desc: "Build software projects, compete in hackathons, and learn algorithms.", iconColor: "text-blue-500 bg-blue-500/10" },
  { id: "club-003", name: "Fine Arts Club", category: "Cultural", desc: "Express creativity through painting, theater, and design.", iconColor: "text-pink-500 bg-pink-500/10" },
  { id: "club-005", name: "Sports Club", category: "Sports", desc: "Participate in tournaments and maintain fitness through sports.", iconColor: "text-green-500 bg-green-500/10" },
  { id: "club-007", name: "Quiz Club", category: "Academic", desc: "Compete in general and specialized academic quiz rounds.", iconColor: "text-orange-500 bg-orange-500/10" },
  { id: "club-009", name: "Dance Club", category: "Cultural", desc: "Express rhythm through choreography, street dance, and cultural events.", iconColor: "text-amber-500 bg-amber-500/10" }
];

export default function StudentMyClubPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);

  // Club Membership status
  const [membership, setMembership] = React.useState<MemberRequest | null>(null);
  
  // Group and Private Chat States
  const [activeTab, setActiveTab] = React.useState<"group" | "members">("group");
  const [groupMessages, setGroupMessages] = React.useState<GroupMessage[]>([]);
  const [newGroupMsg, setNewGroupMsg] = React.useState("");

  // Private Messaging States
  const [activeChatUser, setActiveChatUser] = React.useState<{ name: string; email: string } | null>(null);
  const [privateMessages, setPrivateMessages] = React.useState<ChatMessage[]>([]);
  const [newPrivateMsg, setNewPrivateMsg] = React.useState("");

  // Other Approved Members List
  const [clubMembers, setClubMembers] = React.useState<any[]>([]);

  const loadMembershipStatus = () => {
    if (!user) return;
    const stored = localStorage.getItem("campushub_member_requests");
    const requests: MemberRequest[] = stored ? JSON.parse(stored) : [];

    // Find if the student (student@university.edu) has submitted any request
    const myRequest = requests.find((r) => r.email === user.email);
    if (myRequest) {
      setMembership(myRequest);
      
      // Load all other members of the same club
      if (myRequest.status === "APPROVED") {
        const approvedOfSameClub = requests.filter(
          (r) => r.club.toLowerCase() === myRequest.club.toLowerCase() && r.status === "APPROVED" && r.email !== user.email
        );
        // Add the President (Arjun Mehta) as a chat contact
        const contactList = [
          { name: "Arjun Mehta (Club President)", email: "president@university.edu" },
          ...approvedOfSameClub.map(m => ({ name: m.name, email: m.email }))
        ];
        setClubMembers(contactList);
        loadGroupChats(myRequest.club);
      }
    } else {
      setMembership(null);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadMembershipStatus();
    window.addEventListener("storage", loadMembershipStatus);
    window.addEventListener("focus", loadMembershipStatus);
    window.addEventListener("campushub_new_message", loadMembershipStatus);
    return () => {
      window.removeEventListener("storage", loadMembershipStatus);
      window.removeEventListener("focus", loadMembershipStatus);
      window.removeEventListener("campushub_new_message", loadMembershipStatus);
    };
  }, [user]);

  // Load Chats
  const loadGroupChats = (clubName: string) => {
    const stored = localStorage.getItem("campushub_group_chats");
    const msgs: GroupMessage[] = stored ? JSON.parse(stored) : [];
    const clubFeed = msgs.filter(m => m.clubId.toLowerCase() === clubName.toLowerCase());
    setGroupMessages(clubFeed);
  };

  const loadPrivateChats = (partnerEmail: string) => {
    if (!user) return;
    const stored = localStorage.getItem("campushub_private_chats");
    const chats: ChatMessage[] = stored ? JSON.parse(stored) : [];
    const conversation = chats.filter(
      (m) =>
        (m.fromEmail === user.email && m.toEmail === partnerEmail) ||
        (m.fromEmail === partnerEmail && m.toEmail === user.email)
    );
    setPrivateMessages(conversation);
  };

  // Chat Poll intervals when windows are active
  React.useEffect(() => {
    if (!membership || membership.status !== "APPROVED") return;
    const interval = setInterval(() => {
      loadGroupChats(membership.club);
      if (activeChatUser) {
        loadPrivateChats(activeChatUser.email);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [membership, activeChatUser]);

  // Send Group Message
  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupMsg.trim() || !membership || !user) return;

    const msgPayload: GroupMessage = {
      id: `gmsg-${Math.random().toString(36).substring(7)}`,
      clubId: membership.club,
      fromEmail: user.email,
      fromName: user.name,
      content: newGroupMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const stored = localStorage.getItem("campushub_group_chats");
    const msgsList = stored ? JSON.parse(stored) : [];
    localStorage.setItem("campushub_group_chats", JSON.stringify([...msgsList, msgPayload]));
    
    setGroupMessages(prev => [...prev, msgPayload]);
    setNewGroupMsg("");
  };

  // Send Private Message
  const handleSendPrivateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrivateMsg.trim() || !activeChatUser || !user) return;

    const msgPayload: ChatMessage = {
      id: `msg-${Math.random().toString(36).substring(7)}`,
      fromEmail: user.email,
      fromName: user.name,
      toEmail: activeChatUser.email,
      content: newPrivateMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const stored = localStorage.getItem("campushub_private_chats");
    const chatsList = stored ? JSON.parse(stored) : [];
    localStorage.setItem("campushub_private_chats", JSON.stringify([...chatsList, msgPayload]));

    setPrivateMessages(prev => [...prev, msgPayload]);
    setNewPrivateMsg("");
  };

  if (loading) return null;

  // 1. NOT REGISTERED IN ANY CLUB
  if (!membership) {
    return (
      <div className="space-y-6 text-foreground">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Join a Campus Club
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Discover community hubs and submit join requests to active club leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {CLUBS.map((club, idx) => (
            <motion.div key={club.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="rounded-xl border bg-card p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted border text-muted-foreground">
                    {club.category}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground">{club.name}</h3>
                <p className="text-xs text-muted-foreground leading-normal">{club.desc}</p>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <Link href={`/clubs`}>
                  <Button size="sm" className="h-8 text-xs cursor-pointer flex items-center gap-1">
                    Apply to Join <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // 2. PENDING REQUEST
  if (membership.status === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto text-foreground px-4">
        <div className="h-14 w-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20 shadow-inner">
          <Clock className="h-7 w-7 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Join Request Pending</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed bg-muted/40 p-4 rounded-xl border">
          Your request to join **{membership.club}** has been sent to the Club President. 
          You will receive full portal privileges as soon as your registration is approved.
        </p>
        <div className="mt-6 flex gap-3 text-xs w-full justify-center">
          <Link href="/clubs">
            <Button variant="outline" className="h-8">View Other Clubs</Button>
          </Link>
          <Link href="/dashboard/student">
            <Button className="h-8 bg-primary text-white">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 3. REJECTED REQUEST
  if (membership.status === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto text-foreground px-4">
        <div className="h-14 w-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
          <X className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Application Declined</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed bg-muted/40 p-4 rounded-xl border">
          Your request to join **{membership.club}** was declined by the president. Feel free to browse and apply to other clubs.
        </p>
        <button 
          onClick={() => {
            const stored = localStorage.getItem("campushub_member_requests");
            if (stored) {
              const reqs = JSON.parse(stored).filter((r: any) => r.email !== user?.email);
              localStorage.setItem("campushub_member_requests", JSON.stringify(reqs));
              loadMembershipStatus();
            }
          }}
          className="mt-6 text-xs text-primary font-semibold hover:underline cursor-pointer"
        >
          Reset Application & Try Again
        </button>
      </div>
    );
  }

  // 4. APPROVED CLUB MEMBER (THE ACTIVE CLUB HUB)
  return (
    <div className="space-y-6 text-foreground min-h-[80vh] relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            {membership.club} Hub
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {user?.name.split(" ")[0]}! You are a registered member of the {membership.club}.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-muted rounded-xl p-1 border text-xs font-semibold select-none">
          <button
            onClick={() => setActiveTab("group")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "group" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Group Discussions
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "members" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Members List ({clubMembers.length})
          </button>
        </div>
      </div>

      {/* Tabs panels */}
      <div className="space-y-4">
        {activeTab === "group" ? (
          /* GROUP CHAT PANEL */
          <div className="border rounded-2xl bg-card flex flex-col h-[55vh] justify-between overflow-hidden shadow-sm">
            {/* Group info row */}
            <div className="p-3 border-b bg-muted/20 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>General Discussion Forum for all approved {membership.club} members</span>
            </div>

            {/* Message feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/10 flex flex-col">
              {groupMessages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-xs my-auto flex flex-col items-center gap-1">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                  <span>Welcome to the team! Send the first message.</span>
                </div>
              ) : (
                groupMessages.map((msg) => {
                  const isMe = msg.fromEmail === user?.email;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${
                        isMe ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      {!isMe && (
                        <span className="text-[10px] text-muted-foreground font-semibold mb-0.5 px-1 truncate max-w-xs">
                          {msg.fromName}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-tr-none"
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

            {/* Input form */}
            <form onSubmit={handleSendGroupMessage} className="p-3 border-t bg-card flex gap-2 items-center">
              <Input
                placeholder="Write a message to group..."
                value={newGroupMsg}
                onChange={(e) => setNewGroupMsg(e.target.value)}
                className="h-9 text-xs flex-1 bg-muted/40 border"
              />
              <Button type="submit" size="sm" className="h-9 w-9 p-0 shrink-0 bg-indigo-600 text-white">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        ) : (
          /* MEMBERS DIRECTORY PANEL */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clubMembers.map((member, i) => {
              const isPres = member.email === "president@university.edu";
              return (
                <motion.div
                  key={member.email}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border bg-card p-4 flex flex-col justify-between hover:shadow-sm hover:border-indigo-500/30 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPres ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                    }`}>
                      {isPres ? <Shield className="h-4 w-4" /> : member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-foreground truncate">{member.name}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-3 flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setActiveChatUser(member);
                        loadPrivateChats(member.email);
                      }}
                      className="h-7 text-[10px] cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" /> Chat Private
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRIVATE MESSAGE DRAWER */}
      <AnimatePresence>
        {activeChatUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveChatUser(null)}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 border-b bg-gradient-to-r from-indigo-500/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {activeChatUser.email === "president@university.edu" ? <Shield className="h-4 w-4" /> : activeChatUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground leading-none">{activeChatUser.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-semibold mt-1">Private Message • {membership.club}</p>
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
                {privateMessages.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground text-xs my-auto flex flex-col items-center gap-2">
                    <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                    <span>Send a message to start chatting privately!</span>
                  </div>
                ) : (
                  privateMessages.map((msg) => {
                    const isMe = msg.fromEmail === user?.email;
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
                              ? "bg-indigo-600 text-white rounded-tr-none"
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

              {/* Input Form */}
              <form onSubmit={handleSendPrivateMessage} className="p-3 border-t bg-card flex gap-2 items-center">
                <Input
                  placeholder={`Message ${activeChatUser.name.split(" ")[0]}...`}
                  value={newPrivateMsg}
                  onChange={(e) => setNewPrivateMsg(e.target.value)}
                  className="h-9 text-xs flex-1 bg-muted/40 border"
                />
                <Button type="submit" size="sm" className="h-9 w-9 p-0 shrink-0 bg-indigo-600 text-white">
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
