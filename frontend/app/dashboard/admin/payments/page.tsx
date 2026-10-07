"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, XCircle, Clock, ExternalLink, X } from "lucide-react";

const INITIAL_REGISTRATIONS = [
  { id: "pay-001", studentName: "Divya Menon", enrollment: "EN2022CS0302", eventTitle: "CSE Tech Fest 2025", regFee: 299, transactionRef: "UTR2025062800123", paymentScreenshotName: "payment_proof_divya.jpg", paymentScreenshotUrl: "https://cloudinary.com/payment/proof_divya.jpg", collegeIdName: "id_card_divya.png", collegeIdUrl: "https://cloudinary.com/id/card_divya.png", submittedAt: "Jun 28, 2025 – 9:14 AM", status: "PENDING", isPaid: true },
  { id: "pay-002", studentName: "Rahul Verma", enrollment: "EN2022ME0204", eventTitle: "Inter-College Quiz Bowl", regFee: 100, transactionRef: "UTR2025062500456", paymentScreenshotName: "payment_proof_rahul.jpg", paymentScreenshotUrl: "https://cloudinary.com/payment/proof_rahul.jpg", collegeIdName: "id_card_rahul.png", collegeIdUrl: "https://cloudinary.com/id/card_rahul.png", submittedAt: "Jun 25, 2025 – 4:30 PM", status: "VERIFIED", isPaid: true },
  { id: "pay-003", studentName: "Ananya Singh", enrollment: "EN2022CS0305", eventTitle: "CSE Tech Fest 2025", regFee: 299, transactionRef: "UTR2025062601789", paymentScreenshotName: "payment_proof_ananya.jpg", paymentScreenshotUrl: "https://cloudinary.com/payment/proof_ananya.jpg", collegeIdName: "id_card_ananya.png", collegeIdUrl: "https://cloudinary.com/id/card_ananya.png", submittedAt: "Jun 26, 2025 – 11:00 AM", status: "PENDING", isPaid: true },
  { id: "pay-004", studentName: "Karan Patel", enrollment: "EN2021EC0211", eventTitle: "CSE Tech Fest 2025", regFee: 299, transactionRef: "UTR2025062700934", paymentScreenshotName: "payment_proof_karan.jpg", paymentScreenshotUrl: "https://cloudinary.com/payment/proof_karan.jpg", collegeIdName: "id_card_karan.png", collegeIdUrl: "https://cloudinary.com/id/card_karan.png", submittedAt: "Jun 27, 2025 – 2:45 PM", status: "REJECTED", isPaid: true },
];

export default function AdminPaymentsPage() {
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = React.useState<string>("");

  const handleViewDocument = (url: string | undefined, name: string) => {
    if (!url || url === "N/A" || url.trim() === "") {
      toast.error("No Document Uploaded", "No file is associated with this registration.");
      return;
    }

    let displayUrl = url;

    // Fallback logic for mock database entries or placeholder values
    if (url.includes("cloudinary.com") || (!url.startsWith("data:") && !url.startsWith("http"))) {
      if (name.toLowerCase().includes("id") || name.toLowerCase().includes("signature") || name.toLowerCase().includes("enroll")) {
        displayUrl = "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1000&q=80";
      } else {
        displayUrl = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80";
      }
    }

    setPreviewUrl(displayUrl);
    setPreviewTitle(name);
  };

  const loadRegistrations = () => {
    const stored = localStorage.getItem("campushub_registrations");
    if (stored) {
      setRegistrations(JSON.parse(stored));
    } else {
      localStorage.setItem("campushub_registrations", JSON.stringify(INITIAL_REGISTRATIONS));
      setRegistrations(INITIAL_REGISTRATIONS);
    }
  };

  React.useEffect(() => {
    loadRegistrations();
    window.addEventListener("storage", loadRegistrations);
    window.addEventListener("focus", loadRegistrations);
    return () => {
      window.removeEventListener("storage", loadRegistrations);
      window.removeEventListener("focus", loadRegistrations);
    };
  }, []);

  const handle = (id: string, name: string, action: "VERIFIED" | "REJECTED") => {
    const updated = registrations.map((r) => 
      r.id === id ? { ...r, status: action === "VERIFIED" ? "CONFIRMED" : "REJECTED" } : r
    );
    setRegistrations(updated);
    localStorage.setItem("campushub_registrations", JSON.stringify(updated));
    if (action === "VERIFIED") {
      toast.success("Registration Approved", `${name}'s booking has been confirmed.`);
    } else {
      toast.error("Registration Rejected", `${name}'s request was declined.`);
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">
          Registration & Payment Verifications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Audit student registrations, college ID credentials, and payment screenshot uploads.</p>
      </div>

      <div className="space-y-5">
        {registrations.length === 0 ? (
          <div className="text-center py-10 border rounded-xl bg-card text-muted-foreground">
            No registrations to verify.
          </div>
        ) : (
          registrations.map((reg, i) => {
            const status = reg.status || "PENDING";
            return (
              <motion.div key={reg.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`rounded-xl border bg-card shadow-sm p-5 space-y-4 transition-opacity ${status !== "PENDING" ? "opacity-75" : ""}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{reg.studentName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{reg.enrollment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(status === "PENDING" || status === "UNVERIFIED") && <Badge variant="secondary"><Clock className="h-3 w-3 mr-1 inline" />Pending</Badge>}
                    {(status === "VERIFIED" || status === "CONFIRMED") && <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1 inline" />Confirmed</Badge>}
                    {status === "REJECTED" && <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1 inline" />Rejected</Badge>}
                  </div>
                </div>

                {/* Info blocks grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    ["Selected Event", reg.eventTitle || reg.event],
                    ["Registration Fee", reg.isPaid ? `₹${reg.regFee || reg.amount}` : "Free Event"],
                    ["UTR Number", reg.transactionRef || "N/A"],
                    ["Submitted At", reg.submittedAt]
                  ].map(([l, v]) => (
                    <div key={l} className="bg-muted/30 rounded-lg p-2.5 border">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">{l}</p>
                      <p className="font-semibold text-foreground mt-0.5 break-all">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Uploaded Documents audit links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* College ID image verification */}
                  <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-3 border text-xs">
                    <ExternalLink className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="text-muted-foreground font-semibold">Student ID Card: </span>
                    <button 
                      onClick={() => handleViewDocument(reg.collegeIdUrl, reg.collegeIdName || "student_id.png")}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer truncate flex-1 text-left text-ellipsis"
                    >
                      {reg.collegeIdName || "student_id.png"}
                    </button>
                  </div>

                  {/* Payment proof image verification */}
                  <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-3 border text-xs">
                    <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground font-semibold">Payment Proof: </span>
                    <button 
                      onClick={() => handleViewDocument(reg.paymentScreenshotUrl, reg.paymentScreenshotName || "payment_proof.jpg")}
                      className="font-semibold text-primary hover:underline cursor-pointer truncate flex-1 text-left text-ellipsis"
                    >
                      {reg.paymentScreenshotName || "payment_proof.jpg"}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                {(status === "PENDING" || status === "UNVERIFIED") && (
                  <div className="flex gap-2 border-t pt-3">
                    <Button size="sm" variant="outline" onClick={() => handle(reg.id, reg.studentName, "REJECTED")}
                      className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer">
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject Request
                    </Button>
                    <Button size="sm" onClick={() => handle(reg.id, reg.studentName, "VERIFIED")} className="h-7 text-xs cursor-pointer bg-primary text-white">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Confirm Booking
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* 8. PREVIEW MODAL */}
      <AnimatePresence>
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative text-foreground"
            >
              {/* Modal Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-sm text-foreground">Document Viewer</h3>
                  <p className="text-[10px] text-muted-foreground truncate max-w-md">{previewTitle}</p>
                </div>
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setPreviewTitle("");
                  }}
                  className="p-1 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-muted/10 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
                {previewUrl.startsWith("data:application/pdf") ? (
                  <iframe src={previewUrl} className="w-full h-[60vh] rounded-lg border bg-background" />
                ) : (
                  <img
                    src={previewUrl}
                    alt={previewTitle}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow border"
                  />
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t bg-muted/30 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    setPreviewUrl(null);
                    setPreviewTitle("");
                  }}
                  className="h-8 text-xs cursor-pointer"
                >
                  Close Preview
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
