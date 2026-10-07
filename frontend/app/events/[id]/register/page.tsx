"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, Upload, CheckSquare, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";

export default function RegisterEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Form State
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [files, setFiles] = React.useState<Record<string, { fileName: string; fileUrl: string; fileSize: number }>>({});
  
  // Payment State
  const [transactionRef, setTransactionRef] = React.useState("");
  const [paymentScreenshot, setPaymentScreenshot] = React.useState<string | null>(null);
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = React.useState<string | null>(null);

  // External Student State
  const [isExternal, setIsExternal] = React.useState(false);
  const [externalName, setExternalName] = React.useState("");
  const [externalEmail, setExternalEmail] = React.useState("");
  const [externalInstitution, setExternalInstitution] = React.useState("");
  const [externalPhone, setExternalPhone] = React.useState("");
  const [isRegistered, setIsRegistered] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsExternal(params.get("external") === "true");
    }
  }, []);

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await apiFetch(`/events/${id}`);
        if (data && data.success) {
          setEvent(data.event);
        }
      } catch (err: any) {
        toast.error("Failed to load event registration form", err.message);
        router.push(`/events/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id, router]);

  const handleInputChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (fieldId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      setFiles((prev) => ({
        ...prev,
        [fieldId]: {
          fileName: file.name,
          fileUrl: base64Url,
          fileSize: file.size,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Verify external details if external
    if (isExternal) {
      if (!externalName.trim() || !externalEmail.trim() || !externalInstitution.trim() || !externalPhone.trim()) {
        toast.error("Missing Details", "Please fill out all personal contact details.");
        return;
      }
      if (!externalEmail.includes("@")) {
        toast.error("Invalid Email", "Please enter a valid email address.");
        return;
      }
    }

    // 2. Verify required form fields
    const formSchema = event.registrationForm;
    if (formSchema && formSchema.sections) {
      for (const sec of formSchema.sections) {
        for (const f of sec.fields) {
          if (f.isRequired && !answers[f.id] && f.type !== "file") {
            toast.error("Missing Field", `Please fill out the required field: ${f.label}`);
            return;
          }
          if (f.isRequired && f.type === "file" && !files[f.id]) {
            toast.error("Missing File", `Please upload the required file: ${f.label}`);
            return;
          }
        }
      }
    }

    // 3. Verify Payment details if paid
    if (event.isPaid && (!transactionRef.trim() || !paymentScreenshot)) {
      toast.error("Payment Required", "Please enter the Transaction Reference and upload the Payment Screenshot.");
      return;
    }

    setSaving(true);
    try {
      // 4. Submit core registration
      const answersPayload = Object.entries(answers).map(([fieldId, val]) => {
        // Find label
        let label = "Field";
        formSchema?.sections?.forEach((sec: any) => {
          const match = sec.fields.find((f: any) => f.id === fieldId);
          if (match) label = match.label;
        });
        return { fieldId, label, value: val };
      });

      const filesPayload = Object.entries(files).map(([fieldId, fData]) => ({
        fieldId,
        fileName: fData.fileName,
        fileUrl: fData.fileUrl,
        fileSize: fData.fileSize,
      }));

      const regData = await apiFetch("/registrations", {
        method: "POST",
        body: JSON.stringify({
          eventId: id,
          answers: answersPayload,
          files: filesPayload,
          isExternal,
          externalDetails: isExternal
            ? {
                name: externalName,
                email: externalEmail,
                institution: externalInstitution,
                phone: externalPhone,
              }
            : null,
        }),
      });

      if (regData && regData.success) {
        const regId = regData.registration.id;

        // Find file info
        const collegeIdObj = files["f-college-id"];
        const paymentScreenshotObj = files["f-payment-screenshot"];

        const collegeIdUrl = collegeIdObj ? collegeIdObj.fileUrl : "N/A";
        const collegeIdName = collegeIdObj ? collegeIdObj.fileName : "N/A";
        const paymentScreenshotUrlCombined = paymentScreenshotObj ? paymentScreenshotObj.fileUrl : (paymentScreenshotUrl || "N/A");
        const paymentScreenshotName = paymentScreenshotObj ? paymentScreenshotObj.fileName : (paymentScreenshot || "N/A");

        // Save registration payload to localStorage
        const newReg = {
          id: regId,
          eventId: id,
          eventTitle: event.title,
          studentName: isExternal ? externalName : (user?.name || "Karthik Rajan"),
          studentEmail: isExternal ? externalEmail : (user?.email || "student@university.edu"),
          enrollment: isExternal ? "GUEST" : (answers["f-enrollment"] || "EN2022CS0421"),
          phone: isExternal ? externalPhone : (answers["f-phone"] || "+91-98765-43210"),
          answers: answersPayload,
          files: filesPayload,
          isPaid: event.isPaid,
          regFee: event.regFee,
          status: event.isPaid ? "PENDING" : "CONFIRMED",
          submittedAt: new Date().toLocaleString(),
          transactionRef: transactionRef || "N/A",
          collegeIdUrl,
          collegeIdName,
          paymentScreenshotUrl: paymentScreenshotUrlCombined,
          paymentScreenshotName,
          track: answers["f-track"] || answers["f-sport"] || "Solo",
          team: answers["f-team"] || answers["f-teamname"] || null
        };

        const storedRegs = localStorage.getItem("campushub_registrations");
        const regsList = storedRegs ? JSON.parse(storedRegs) : [];
        localStorage.setItem("campushub_registrations", JSON.stringify([newReg, ...regsList]));

        // 5. Submit Payment Screenshot if Paid event
        if (event.isPaid) {
          await apiFetch(`/registrations/${regId}/payment`, {
            method: "POST",
            body: JSON.stringify({
              transactionRef,
              fileUrl: paymentScreenshotUrlCombined,
            }),
          });
          toast.success("Success", "Registration and payment proof submitted successfully!");
        } else {
          toast.success("Success", "Registered for event successfully!");
        }

        if (isExternal) {
          setIsRegistered(true);
        } else {
          router.push("/dashboard/student/registrations");
        }
      }
    } catch (err: any) {
      toast.error("Registration Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) return null;

  if (isRegistered) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="border shadow-lg bg-card text-center overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-8 border-b bg-gradient-to-b from-primary/5 to-transparent">
            <div className="h-12 w-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckSquare className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">Registration Successful!</CardTitle>
            <CardDescription className="text-xs">Your registration has been processed successfully.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs text-left leading-relaxed">
            <div className="p-4 bg-muted/30 rounded-xl space-y-2 border">
              <p className="font-semibold text-foreground text-center text-sm pb-1.5 border-b mb-1">Booking Confirmation Summary</p>
              <div className="grid grid-cols-3 gap-y-1">
                <span className="text-muted-foreground">Attendee:</span>
                <span className="col-span-2 font-bold text-foreground">{externalName}</span>
                <span className="text-muted-foreground">Email:</span>
                <span className="col-span-2 font-mono text-foreground">{externalEmail}</span>
                <span className="text-muted-foreground">College:</span>
                <span className="col-span-2 font-semibold text-foreground">{externalInstitution}</span>
                <span className="text-muted-foreground">Event:</span>
                <span className="col-span-2 font-bold text-primary">{event.title}</span>
                <span className="text-muted-foreground">Category:</span>
                <span className="col-span-2 text-foreground font-semibold">{event.category?.name || "General"}</span>
                <span className="text-muted-foreground">Venue:</span>
                <span className="col-span-2 text-foreground font-semibold">{event.venue}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center leading-normal">
              A mock ticket with confirmation barcode has been issued and sent to <span className="font-bold text-foreground">{externalEmail}</span>. Please present the ticket email upon arrival.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col border-t bg-muted/10 pt-4 pb-6">
            <Link href={`/events/${id}`} className="w-full">
              <Button className="w-full h-10 font-bold uppercase text-xs tracking-wider">
                Back to Event Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formSchema = event.registrationForm;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back Link */}
      <Link href={`/events/${id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Event Details</span>
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Event Registration Form</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Complete {isExternal ? "your personal and " : ""}custom details below to secure your seat for &ldquo;{event.title}&rdquo;.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* External Student Personal Details Card */}
        {isExternal && (
          <Card className="bg-card text-card-foreground border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold">Personal Details (External Student)</CardTitle>
              <CardDescription>Provide your details to register as a guest attendee.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Aditi Sharma" 
                    required 
                    value={externalName}
                    onChange={(e) => setExternalName(e.target.value)}
                    className="h-8 text-xs mt-1" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input 
                    type="email" 
                    placeholder="e.g. aditi@domain.com" 
                    required 
                    value={externalEmail}
                    onChange={(e) => setExternalEmail(e.target.value)}
                    className="h-8 text-xs mt-1" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Institution / University <span className="text-destructive">*</span>
                  </label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Delhi University" 
                    required 
                    value={externalInstitution}
                    onChange={(e) => setExternalInstitution(e.target.value)}
                    className="h-8 text-xs mt-1" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Contact Number <span className="text-destructive">*</span>
                  </label>
                  <Input 
                    type="text" 
                    placeholder="e.g. +91-99887-76655" 
                    required 
                    value={externalPhone}
                    onChange={(e) => setExternalPhone(e.target.value)}
                    className="h-8 text-xs mt-1" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Form Questionnaire Canvas */}
        <Card className="bg-card text-card-foreground border shadow-sm">
          <CardContent className="p-6 space-y-6">
            {(!formSchema || !formSchema.sections || formSchema.sections.length === 0) ? (
              <p className="text-center text-muted-foreground py-8">
                No custom registration form designed. Proceed to submit.
              </p>
            ) : (
              formSchema.sections.map((sec: any) => (
                <div key={sec.id} className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-sm font-bold text-foreground">{sec.title}</h3>
                  </div>

                  {sec.fields.map((f: any) => {
                    return (
                      <div key={f.id} className="space-y-1.5">
                        <label className="font-semibold text-foreground">
                          {f.label} {f.isRequired && <span className="text-destructive">*</span>}
                        </label>
                        {f.description && <p className="text-[10px] text-muted-foreground">{f.description}</p>}

                        {f.type === "paragraph" ? (
                          <textarea
                            placeholder={f.placeholder || "Enter details..."}
                            required={f.isRequired}
                            onChange={(e) => handleInputChange(f.id, e.target.value)}
                            rows={3}
                            className="w-full mt-1 p-2.5 border bg-background text-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                          />
                        ) : ["select", "radio", "checkbox"].includes(f.type) ? (
                          <div className="flex flex-col gap-2 mt-1.5 pl-1">
                            {f.options?.map((opt: any) => (
                              <label key={opt.id} className="flex items-center gap-2 cursor-pointer select-none text-[11px]">
                                <input
                                  type={f.type === "checkbox" ? "checkbox" : "radio"}
                                  name={f.id}
                                  value={opt.value}
                                  onChange={(e) => handleInputChange(f.id, e.target.value)}
                                  className="h-3.5 w-3.5 rounded border-gray-300 text-primary cursor-pointer"
                                />
                                <span>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        ) : f.type === "file" ? (
                          <div className="flex flex-col gap-1.5 mt-1">
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileChange(f.id, file);
                                }
                              }}
                              className="h-9 text-xs py-1 cursor-pointer bg-background border file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-[10px] file:px-2.5 file:py-0.5 file:rounded file:mr-2 hover:file:bg-primary/20"
                            />
                            {files[f.id] && (
                              <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-0.5">
                                Selected: {files[f.id].fileName} (Ready)
                              </p>
                            )}
                          </div>
                        ) : (
                          <Input
                            type={f.type === "number" ? "number" : f.type === "email" ? "email" : "text"}
                            placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                            required={f.isRequired}
                            onChange={(e) => handleInputChange(f.id, e.target.value)}
                            className="h-8 text-xs mt-1"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Paid Event Payment Screenshot Step */}
        {event.isPaid && (
          <Card className="border border-primary/20 bg-primary/[0.01] shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Paid Event Payment Gateway</span>
              </CardTitle>
              <CardDescription>
                Submit payment proof of ₹{event.regFee} to complete ticket bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/40 rounded-lg border text-xs leading-relaxed space-y-2">
                <p className="font-bold flex items-center gap-1"><Info className="h-4 w-4 text-primary shrink-0" /> Payment Instructions:</p>
                <p>{event.paymentInstructions || "Please scan the UPI QR code below and transfer the registration amount. Submit reference number after transfer."}</p>
                <div className="h-32 w-32 border bg-background rounded-lg flex items-center justify-center mx-auto mt-4 overflow-hidden relative">
                  {event.qrCode ? (
                    <img src={event.qrCode} alt="Payment QR" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-semibold">Mock QR Scan</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground">Transaction Reference Number</label>
                  <Input
                    placeholder="e.g. TXN99887711"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground">Upload Payment Screenshot (.png/.jpeg)</label>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPaymentScreenshot(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPaymentScreenshotUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="h-9 text-xs py-1 cursor-pointer bg-background border file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-[10px] file:px-2.5 file:py-0.5 file:rounded file:mr-2 hover:file:bg-primary/20"
                    />
                    {paymentScreenshot && (
                      <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-0.5">
                        Selected: {paymentScreenshot} (Ready)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t pt-4">
          <Link href={`/events/${id}`}>
            <Button type="button" variant="outline" className="h-9">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={saving} className="flex gap-1.5 h-9 px-6 shadow-lg shadow-primary/20">
            <CheckSquare className="h-4 w-4" />
            <span>Submit Registration</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
