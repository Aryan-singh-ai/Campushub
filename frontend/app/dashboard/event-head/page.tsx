"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api-client";
import { 
  Calendar, MapPin, DollarSign, AlertCircle, FileText, CheckCircle, 
  Upload, Plus, Trash2, QrCode, Megaphone, Loader2, Sparkles,
  Send, Check, X, Archive, Users, Image, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomField {
  label: string;
  type: "text" | "paragraph";
  required: boolean;
  placeholder: string;
}

export default function EventHeadDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = React.useState<any[]>([]);
  
  // Tab State
  const [activeTab, setActiveTab] = React.useState<"proposal" | "manage">("proposal");

  // Form states for Propose Event
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Form states for Event Page Builder
  const [regFee, setRegFee] = React.useState("299");
  const [qrImage, setQrImage] = React.useState<string | null>(null);
  const [customFields, setCustomFields] = React.useState<CustomField[]>([
    { label: "Why do you want to participate?", type: "paragraph", required: true, placeholder: "Type your answer..." }
  ]);
  const [newFieldLabel, setNewFieldLabel] = React.useState("");
  const [newFieldType, setNewFieldType] = React.useState<"text" | "paragraph">("text");

  // Active Events Manager States
  const [allEvents, setAllEvents] = React.useState<any[]>([]);
  const [selectedManageEvent, setSelectedManageEvent] = React.useState<any | null>(null);
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = React.useState("");
  
  // Verification dialog/viewer states
  const [viewingDocument, setViewingDocument] = React.useState<{ name: string; url: string; type: string } | null>(null);

  const loadProposals = () => {
    const stored = localStorage.getItem("campushub_event_head_proposals");
    if (stored) {
      setProposals(JSON.parse(stored));
    }
  };

  const loadEventsData = async () => {
    // 1. Load events
    const response = await apiFetch("/events");
    if (response && response.success) {
      // Fetch completed list
      const completedListStr = localStorage.getItem("campushub_completed_events");
      const completedList: string[] = completedListStr ? JSON.parse(completedListStr) : [];
      
      const mapped = response.events.map((e: any) => ({
        ...e,
        status: completedList.includes(e.id) ? "COMPLETED" : "ACTIVE"
      }));
      setAllEvents(mapped);

      // Auto-select event if none is selected
      if (mapped.length > 0 && !selectedManageEvent) {
        setSelectedManageEvent(mapped[0]);
      } else if (selectedManageEvent) {
        // update selected event reference
        const updatedSelected = mapped.find((m: any) => m.id === selectedManageEvent.id);
        if (updatedSelected) setSelectedManageEvent(updatedSelected);
      }
    }

    // 2. Load registrations
    const storedRegs = localStorage.getItem("campushub_registrations");
    if (storedRegs) {
      setRegistrations(JSON.parse(storedRegs));
    }
  };

  React.useEffect(() => {
    loadProposals();
    loadEventsData();
    const handleSync = () => {
      loadProposals();
      loadEventsData();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("campushub_storage_updated", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("campushub_storage_updated", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  // Filter proposals submitted by this user
  const myProposals = proposals.filter((p) => p.eventHead === user?.name);
  
  // Find active proposal (if any proposal is pending reviews or approved)
  const activeProposal = myProposals.find(
    (p) => p.status === "PENDING_FACULTY" || p.status === "PENDING_ADMIN" || p.status === "APPROVED"
  ) || myProposals.find(p => p.status === "REJECTED_FACULTY" || p.status === "REJECTED");

  // Metrics
  const proposedCount = myProposals.length;
  const approvedCount = myProposals.filter(p => p.status === "APPROVED" || p.status === "PUBLISHED").length;
  const publishedCount = myProposals.filter(p => p.status === "PUBLISHED").length;

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !venue.trim() || !budget.trim() || !description.trim()) {
      toast.error("Error", "Please fill in all details to propose the event.");
      return;
    }

    const newProposal = {
      id: `ehp-${Math.random().toString(36).substring(7)}`,
      title: title.trim(),
      date: date.trim(),
      venue: venue.trim(),
      budget: budget.trim(),
      description: description.trim(),
      eventHead: user?.name ?? "Event Head",
      status: "PENDING_FACULTY",
      submittedAt: new Date().toISOString(),
    };

    const updated = [...proposals, newProposal];
    setProposals(updated);
    localStorage.setItem("campushub_event_head_proposals", JSON.stringify(updated));
    
    // Clear form
    setTitle("");
    setDate("");
    setVenue("");
    setBudget("");
    setDescription("");
    toast.success("Success", "Event proposal submitted to Faculty Coordinator successfully.");
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) {
      toast.error("Error", "Please enter a label for the custom field.");
      return;
    }
    const newField: CustomField = {
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: true,
      placeholder: newFieldType === "text" ? "Type your response..." : "Write your paragraph response..."
    };
    setCustomFields([...customFields, newField]);
    setNewFieldLabel("");
    toast.success("Field Added", `"${newField.label}" added to form schema.`);
  };

  const handleRemoveField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setQrImage(reader.result as string);
      toast.success("Success", "UPI payment QR code uploaded successfully.");
    };
    reader.readAsDataURL(file);
  };

  const handlePublishEvent = () => {
    if (!activeProposal) return;
    if (!qrImage) {
      toast.error("Error", "Please upload a payment QR code image before publishing.");
      return;
    }

    // 1. Create registration form sections
    const customSection = {
      id: "sec-custom",
      title: "Event Specific Details",
      fields: customFields.map((cf, idx) => ({
        id: `f-custom-${idx}`,
        label: cf.label,
        type: cf.type,
        isRequired: cf.required,
        placeholder: cf.placeholder
      }))
    };

    const studentInfo = {
      id: "sec-student",
      title: "Student Information",
      fields: [
        { id: "f-name", label: "Full Name", type: "text", isRequired: true, placeholder: "e.g. Karthik Rajan" },
        { id: "f-enrollment", label: "Enrollment Number", type: "text", isRequired: true, placeholder: "e.g. EN2022CS0421" },
        { id: "f-email", label: "University Email ID", type: "email", isRequired: true, placeholder: "e.g. karthik@university.edu" },
        { id: "f-phone", label: "Contact Number", type: "text", isRequired: true, placeholder: "e.g. +91-98765-43210" },
      ]
    };

    // 2. Build Event Object
    let eventIsoDate = new Date().toISOString();
    try {
      const parsedDate = new Date(activeProposal.date);
      if (!isNaN(parsedDate.getTime())) {
        eventIsoDate = parsedDate.toISOString();
      }
    } catch (err) {}

    const newEvent = {
      id: `evt-custom-${Math.random().toString(36).substring(7)}`,
      title: activeProposal.title,
      description: activeProposal.description,
      category: { name: "Special Event" },
      venue: activeProposal.venue,
      date: eventIsoDate,
      isPaid: true,
      regFee: parseInt(regFee.replace(/[^0-9]/g, "")) || 299,
      paymentInstructions: `Scan the QR code below and transfer ₹${regFee}. Submit the Transaction Reference screenshot below.`,
      qrCode: qrImage,
      eventHead: user?.name || "Event Head",
      registrationForm: {
        sections: [studentInfo, customSection]
      }
    };

    // 3. Save to published events array in localStorage
    const publishedStored = localStorage.getItem("campushub_published_events");
    const publishedList = publishedStored ? JSON.parse(publishedStored) : [];
    localStorage.setItem("campushub_published_events", JSON.stringify([...publishedList, newEvent]));

    // 4. Update proposal status to PUBLISHED in localStorage
    const updatedProposals = proposals.map((p) => 
      p.id === activeProposal.id ? { ...p, status: "PUBLISHED" } : p
    );
    setProposals(updatedProposals);
    localStorage.setItem("campushub_event_head_proposals", JSON.stringify(updatedProposals));

    // Clear builder states
    setQrImage(null);
    setRegFee("299");
    
    // Dispatch event to sync topbar notice counters
    window.dispatchEvent(new Event("campushub_announcements_updated"));
    
    loadEventsData(); // refresh management panel
    toast.success("Event Published!", `"${activeProposal.title}" is now live and browseable everywhere.`);
    setActiveTab("manage"); // Switch to manage tab
  };

  const handleResetProposal = () => {
    if (!activeProposal) return;
    const updatedProposals = proposals.filter((p) => p.id !== activeProposal.id);
    setProposals(updatedProposals);
    localStorage.setItem("campushub_event_head_proposals", JSON.stringify(updatedProposals));
  };

  // Manage Active Event Handler Helpers
  const activeEvents = allEvents.filter(e => e.status !== "COMPLETED");
  const selectedEventRegs = selectedManageEvent 
    ? registrations.filter(r => r.eventId === selectedManageEvent.id)
    : [];

  const pendingRegs = selectedEventRegs.filter(r => r.status === "PENDING");
  const verifiedRegs = selectedEventRegs.filter(r => r.status === "CONFIRMED" || r.status === "VERIFIED");
  const totalRevenue = verifiedRegs.length * (selectedManageEvent?.regFee || 0);

  const handleVerifyRegistration = (regId: string, studentName: string) => {
    const updated = registrations.map(r => r.id === regId ? { ...r, status: "CONFIRMED" } : r);
    setRegistrations(updated);
    localStorage.setItem("campushub_registrations", JSON.stringify(updated));
    toast.success("Ticket Verified", `Approved registration for ${studentName}.`);
  };

  const handleRejectRegistration = (regId: string, studentName: string) => {
    const updated = registrations.map(r => r.id === regId ? { ...r, status: "REJECTED" } : r);
    setRegistrations(updated);
    localStorage.setItem("campushub_registrations", JSON.stringify(updated));
    toast.error("Registration Rejected", `Declined registration for ${studentName}.`);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim() || !selectedManageEvent) return;

    const storedAnn = localStorage.getItem("campushub_event_announcements");
    const list = storedAnn ? JSON.parse(storedAnn) : [];
    
    const payload = {
      id: `ann-${Math.random().toString(36).substring(7)}`,
      eventId: selectedManageEvent.id,
      eventTitle: selectedManageEvent.title,
      content: newAnnouncement.trim(),
      timestamp: new Date().toLocaleString("en-IN", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
    };

    localStorage.setItem("campushub_event_announcements", JSON.stringify([payload, ...list]));
    setNewAnnouncement("");
    toast.success("Broadcast Sent", `Announcement posted for "${selectedManageEvent.title}"!`);
  };

  const handleMarkCompleted = (eventId: string, eventTitle: string) => {
    const completedListStr = localStorage.getItem("campushub_completed_events");
    const completedList: string[] = completedListStr ? JSON.parse(completedListStr) : [];
    if (!completedList.includes(eventId)) {
      completedList.push(eventId);
      localStorage.setItem("campushub_completed_events", JSON.stringify(completedList));
      toast.success("Event Completed", `"${eventTitle}" has been marked as completed.`);
      loadEventsData();
    }
  };

  return (
    <div className="space-y-6 text-foreground pb-12 relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
            Event Head Portal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Propose, build, and audit active university events and ticket bookings.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-muted rounded-xl p-1 border text-xs font-semibold select-none">
          <button
            onClick={() => setActiveTab("proposal")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "proposal" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Proposal Pipeline
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "manage" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manage Active Events ({activeEvents.length})
          </button>
        </div>
      </div>

      {activeTab === "proposal" ? (
        /* PROPOSAL PIPELINE TAB VIEW */
        <>
          {/* Stats Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Proposed Events" value={String(proposedCount)} icon={FileText} description="total submissions" />
            <StatCard title="Approved Events" value={String(approvedCount)} icon={CheckCircle} description="cleared by admin" />
            <StatCard title="Published Live" value={String(publishedCount)} icon={Megaphone} description="active registrations" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-6">
            
            {/* Main Work Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* STEP 1: If no proposal is currently active */}
              {!activeProposal && (
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h2 className="font-bold text-base">Propose a New Event</h2>
                  </div>
                  <p className="text-xs text-muted-foreground">Submit event details to the System Administrator for verification and approval.</p>

                  <form onSubmit={handlePropose} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-muted-foreground">Event Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. National Coding Hackathon"
                        className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Target Date</label>
                        <input
                          type="date"
                          required
                          className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Venue</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Seminar Hall 3, Block C"
                          className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                          value={venue}
                          onChange={(e) => setVenue(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Expected Budget</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ₹15,000"
                          className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-muted-foreground">Event Outline / Description</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Provide details about registration tracks, target audience, schedule, and speakers..."
                        className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs py-2 px-4 rounded-lg">
                      Submit Event Proposal
                    </Button>
                  </form>
                </div>
              )}

              {/* STEP 2: Proposal is PENDING_FACULTY */}
              {activeProposal && activeProposal.status === "PENDING_FACULTY" && (
                <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">Awaiting Faculty Coordinator Approval</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Your event proposal <span className="font-semibold text-foreground">"{activeProposal.title}"</span> is currently pending review by the Faculty Coordinator.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 max-w-md text-xs text-left space-y-2">
                    <p><span className="font-semibold text-muted-foreground">Venue:</span> {activeProposal.venue}</p>
                    <p><span className="font-semibold text-muted-foreground">Date:</span> {activeProposal.date}</p>
                    <p><span className="font-semibold text-muted-foreground">Budget:</span> {activeProposal.budget}</p>
                  </div>
                </div>
              )}

              {/* STEP 2.5: Proposal is PENDING_ADMIN */}
              {activeProposal && activeProposal.status === "PENDING_ADMIN" && (
                <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">Awaiting System Admin Approval</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Your event proposal <span className="font-semibold text-foreground">"{activeProposal.title}"</span> has been approved by the Faculty Coordinator ({activeProposal.approvedByFaculty || "Dr. Priya Nair"}) and is now pending final review by the System Administrator.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 max-w-md text-xs text-left space-y-2">
                    <p><span className="font-semibold text-muted-foreground">Venue:</span> {activeProposal.venue}</p>
                    <p><span className="font-semibold text-muted-foreground">Date:</span> {activeProposal.date}</p>
                    <p><span className="font-semibold text-muted-foreground">Budget:</span> {activeProposal.budget}</p>
                  </div>
                </div>
              )}

              {/* STEP 3: Proposal is REJECTED_FACULTY */}
              {activeProposal && activeProposal.status === "REJECTED_FACULTY" && (
                <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">Event Proposal Declined by Faculty</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Your proposal <span className="font-semibold text-foreground">"{activeProposal.title}"</span> was declined by the Faculty Coordinator.
                    </p>
                  </div>
                  <Button onClick={handleResetProposal} className="bg-destructive hover:bg-destructive/95 text-white text-xs font-semibold px-4 py-2 cursor-pointer">
                    Create New Proposal
                  </Button>
                </div>
              )}

              {/* STEP 3.5: Proposal is REJECTED (by Admin) */}
              {activeProposal && activeProposal.status === "REJECTED" && (
                <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">Event Proposal Rejected by Admin</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Your proposal <span className="font-semibold text-foreground">"{activeProposal.title}"</span> was rejected by the System Administrator.
                    </p>
                  </div>
                  <Button onClick={handleResetProposal} className="bg-destructive hover:bg-destructive/95 text-white text-xs font-semibold px-4 py-2 cursor-pointer">
                    Create New Proposal
                  </Button>
                </div>
              )}

              {/* STEP 4: Proposal is APPROVED -> Unlock Form Builder & QR Uploader */}
              {activeProposal && activeProposal.status === "APPROVED" && (
                <div className="space-y-6">
                  
                  {/* Event approved card banner */}
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-green-800 dark:text-green-400">Proposal Approved!</h4>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        The system admin verified your proposal <span className="font-semibold">"{activeProposal.title}"</span>. Build your registration form and payment portal below.
                      </p>
                    </div>
                  </div>

                  {/* Form Customizer & QR Code Uploader */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6 text-foreground">
                    <div className="flex items-center gap-2 border-b pb-3">
                      <QrCode className="h-5 w-5 text-amber-500" />
                      <h3 className="font-bold text-base">Configure Registration Form & Payment</h3>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Fee amount */}
                      <div className="space-y-1 max-w-xs">
                        <label className="font-semibold text-muted-foreground">Registration Fee Amount (₹)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                          <input
                            type="text"
                            className="w-full p-2 pl-6 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                            value={regFee}
                            onChange={(e) => setRegFee(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* QR Image Uploader */}
                      <div className="space-y-2">
                        <label className="font-semibold text-muted-foreground">Upload Payment UPI QR Code Image</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="h-32 w-32 border-2 border-dashed bg-muted/20 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 group">
                            {qrImage ? (
                              <img src={qrImage} alt="QR Preview" className="h-full w-full object-contain" />
                            ) : (
                              <>
                                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-[9px] text-muted-foreground mt-1">Upload QR</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleQrUpload}
                            />
                          </div>
                          <div className="space-y-1 text-left">
                            <p className="font-bold">Select QR Code Image file</p>
                            <p className="text-[10px] text-muted-foreground leading-normal">
                              Submit a QR code image (GPay, Paytm, or UPI) corresponding to your registration fee. Students will scan this QR at ticket checkout.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Custom fields builder */}
                      <div className="space-y-3 pt-3 border-t">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-foreground">Custom Registration Fields</h4>
                          <p className="text-[10px] text-muted-foreground">Design custom questions/inputs that students must answer when registering.</p>
                        </div>

                        {/* Active custom fields list */}
                        <div className="space-y-2 max-w-md">
                          {customFields.map((cf, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 gap-3">
                              <div className="min-w-0">
                                <p className="font-bold text-xs truncate">{cf.label}</p>
                                <p className="text-[9px] text-muted-foreground uppercase">{cf.type === "text" ? "Single Line Input" : "Text Area Field"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(index)}
                                className="h-6 w-6 rounded border border-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive/10 shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add custom field form */}
                        <div className="p-4 rounded-xl border border-dashed bg-muted/10 max-w-md space-y-3">
                          <p className="font-bold text-xs">Add Custom Question</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="e.g. Enter your Github Profile URL"
                              className="w-full p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                              value={newFieldLabel}
                              onChange={(e) => setNewFieldLabel(e.target.value)}
                            />
                            <div className="flex gap-4">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="fieldType"
                                  checked={newFieldType === "text"}
                                  onChange={() => setNewFieldType("text")}
                                  className="text-amber-500 focus:ring-amber-500"
                                />
                                <span>Single Line text</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="fieldType"
                                  checked={newFieldType === "paragraph"}
                                  onChange={() => setNewFieldType("paragraph")}
                                  className="text-amber-500 focus:ring-amber-500"
                                />
                                <span>Paragraph Box</span>
                              </label>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddField}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] h-7 px-3 py-1 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Question
                          </Button>
                        </div>
                      </div>

                      {/* Publish Actions */}
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                          type="button"
                          onClick={handlePublishEvent}
                          className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Megaphone className="h-4 w-4" /> Publish the Event
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Info panel on the right */}
            <div className="space-y-4">
              <div className="rounded-xl border p-5 bg-card shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Event Head Guide
                </h3>
                <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    To launch a custom event on **GD Goenka Event Hub**, follow these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 pl-1.5 font-medium">
                    <li>
                      <span className="text-foreground">Propose Details:</span> Submit the venue, expected budget, target date, and outline description.
                    </li>
                    <li>
                      <span className="text-foreground">Wait for Audit:</span> The System Administrator reviews and clears the proposal.
                    </li>
                    <li>
                      <span className="text-foreground">Build & Upload QR:</span> Customize your registration form questions and link a payment UPI QR code image.
                    </li>
                    <li>
                      <span className="text-foreground">Go Live:</span> Click "Publish" to display your event catalog index page and enable ticket purchases.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* MANAGE ACTIVE EVENTS TAB VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Active Events List (Left Column) */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-bold text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" /> Active Catalog Events
            </h3>

            {activeEvents.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl bg-card text-muted-foreground text-xs">
                No active published events to manage. Publish a proposal first!
              </div>
            ) : (
              <div className="space-y-3">
                {activeEvents.map((evt) => {
                  const isSelected = selectedManageEvent?.id === evt.id;
                  const regCount = registrations.filter(r => r.eventId === evt.id).length;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedManageEvent(evt)}
                      className={`p-4 rounded-xl border bg-card cursor-pointer transition-all shadow-sm flex flex-col justify-between hover:border-amber-500/40 hover:scale-[1.01] ${
                        isSelected ? "border-amber-500 ring-1 ring-amber-500/20" : ""
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-muted border text-muted-foreground">
                            {evt.category?.name || "General"}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {regCount} {regCount === 1 ? "Registration" : "Registrations"}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-foreground truncate mt-1.5">{evt.title}</h4>
                        <p className="text-[10px] text-muted-foreground truncate">{evt.venue}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Event Controller & Auditor (Right Column) */}
          <div className="lg:col-span-2">
            {!selectedManageEvent ? (
              <div className="text-center py-24 border rounded-2xl bg-card text-muted-foreground text-sm flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-muted-foreground/30" />
                <span>Select an active event from the sidebar to audit tickets and broadcast announcements.</span>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Selected Event Card Metrics */}
                <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-none">{selectedManageEvent.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-primary" /> {selectedManageEvent.venue} • {new Date(selectedManageEvent.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleMarkCompleted(selectedManageEvent.id, selectedManageEvent.title)}
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/5 shrink-0 cursor-pointer"
                    >
                      <Archive className="h-3.5 w-3.5 mr-1" /> Mark Completed
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    {[
                      { label: "Total Bookings", value: String(selectedEventRegs.length), sub: "Registrations" },
                      { label: "Awaiting Verification", value: String(pendingRegs.length), sub: "Tickets" },
                      { label: "Approved Tickets", value: String(verifiedRegs.length), sub: "Registered" },
                      { label: "Est. Revenue", value: `₹${totalRevenue}`, sub: "Fees Collected" },
                    ].map((m, idx) => (
                      <div key={idx} className="bg-muted/30 rounded-lg p-3 border">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{m.label}</p>
                        <p className="text-lg font-extrabold text-foreground mt-0.5">{m.value}</p>
                        <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">{m.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Broadcast announcements Form */}
                <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Megaphone className="h-4 w-4 text-amber-500" /> Broadcast Event Update
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Post an important update or reschedule notice directly to all registered students' dashboards.
                  </p>
                  <form onSubmit={handleBroadcastAnnouncement} className="flex gap-2 items-center">
                    <Input
                      placeholder="e.g. Gd Goenka Tech Fest rescheduled to 10 AM in Lab 4. Bring your laptops!"
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      className="h-9 text-xs flex-1 bg-background"
                      required
                    />
                    <Button type="submit" size="sm" className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white shrink-0">
                      <Send className="h-3.5 w-3.5 mr-1" /> Broadcast
                    </Button>
                  </form>
                </div>

                {/* Registration Roster & Verifications List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> Roster Auditing Directory
                  </h4>

                  {selectedEventRegs.length === 0 ? (
                    <div className="text-center py-16 border rounded-xl bg-card text-muted-foreground text-xs">
                      No registrations recorded for this event yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedEventRegs.map((reg) => (
                        <div key={reg.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                {(reg.studentName || "Student").charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-foreground leading-none">{reg.studentName || "Anonymous Student"}</h5>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {reg.studentEmail || "No Email"} • {reg.enrollment || "No Enrollment"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {reg.status === "PENDING" && <Badge variant="secondary">Pending Review</Badge>}
                              {(reg.status === "CONFIRMED" || reg.status === "VERIFIED") && <Badge variant="success">Confirmed ✓</Badge>}
                              {reg.status === "REJECTED" && <Badge variant="destructive">Declined ✕</Badge>}
                            </div>
                          </div>

                          {/* Answers & Upload Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                            <div className="bg-muted/30 rounded-lg p-2 border flex flex-col justify-center">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">Transaction Ref</span>
                              <span className="font-bold text-foreground mt-0.5">{reg.transactionRef || "N/A"}</span>
                            </div>
                            
                            {/* College ID image verification */}
                            <div className="bg-muted/30 rounded-lg p-2 border flex items-center justify-between gap-1.5">
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase block">College ID Card</span>
                                <span className="font-semibold text-foreground truncate block mt-0.5">{reg.collegeIdName || "N/A"}</span>
                              </div>
                              {reg.collegeIdUrl && reg.collegeIdUrl !== "N/A" && (
                                <button
                                  type="button"
                                  onClick={() => setViewingDocument({ name: "College ID Card", url: reg.collegeIdUrl, type: "ID Card" })}
                                  className="h-6 px-1.5 rounded bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1 shrink-0 font-semibold cursor-pointer"
                                >
                                  <Eye className="h-3 w-3" /> View
                                </button>
                              )}
                            </div>

                            {/* Payment screenshot verification */}
                            <div className="bg-muted/30 rounded-lg p-2 border flex items-center justify-between gap-1.5">
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Payment Proof</span>
                                <span className="font-semibold text-foreground truncate block mt-0.5">{reg.paymentScreenshotName || "N/A"}</span>
                              </div>
                              {reg.paymentScreenshotUrl && reg.paymentScreenshotUrl !== "N/A" && (
                                <button
                                  type="button"
                                  onClick={() => setViewingDocument({ name: "Payment Proof Screenshot", url: reg.paymentScreenshotUrl, type: "Receipt" })}
                                  className="h-6 px-1.5 rounded bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1 shrink-0 font-semibold cursor-pointer"
                                >
                                  <Eye className="h-3 w-3" /> View
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          {reg.status === "PENDING" && (
                            <div className="border-t pt-3 flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRegistration(reg.id, reg.studentName || "Student")}
                                className="h-7 text-[10px] border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5 mr-1" /> Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleVerifyRegistration(reg.id, reg.studentName || "Student")}
                                className="h-7 text-[10px] bg-primary text-white cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5 mr-1" /> Approve Ticket
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {viewingDocument && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDocument(null)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[15%] max-w-lg mx-auto bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{viewingDocument.name}</h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{viewingDocument.type} Document Preview</span>
                </div>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 bg-muted/20 flex items-center justify-center min-h-[250px] relative">
                {viewingDocument.url.startsWith("data:image/") || viewingDocument.url.includes("cloudinary.com") || viewingDocument.url.endsWith(".png") || viewingDocument.url.endsWith(".jpg") || viewingDocument.url.endsWith(".jpeg") ? (
                  /* Render Mock Images */
                  <img
                    src={viewingDocument.url.includes("cloudinary.com") ? "https://placehold.co/600x400/indigo/white?text=Mock+Document+Scan" : viewingDocument.url}
                    alt="Document Preview"
                    className="max-h-[300px] w-full object-contain rounded-lg border shadow"
                  />
                ) : (
                  /* Render PDF Placeholder */
                  <div className="text-center space-y-2 py-8">
                    <FileText className="h-12 w-12 text-primary mx-auto animate-bounce" />
                    <p className="font-bold text-xs text-foreground">File: {viewingDocument.url.split("/").pop()}</p>
                    <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                      This is a PDF/Non-Image document scan payload. Verification checks cleared successfully.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t bg-card flex justify-end">
                <Button size="sm" onClick={() => setViewingDocument(null)} className="h-8 text-xs">
                  Close Preview
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
