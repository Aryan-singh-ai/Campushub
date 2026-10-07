"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  GraduationCap, ShieldCheck, UserCheck, Users,
  ArrowRight, Key, ArrowLeft, Crown, Star, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Must be a valid email address" })
    .refine((val) => val.endsWith("@university.edu"), {
      message: "Restricted to official university emails (*@university.edu)",
    }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Single accounts (no sub-roles) ────────────────────────────────────────
const SINGLE_ACCOUNTS = [
  {
    role: "Student",
    email: "student@university.edu",
    desc: "Register for events, view tickets, and get certificates",
    icon: GraduationCap,
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500 hover:border-blue-500/40",
  },
  {
    role: "Presidents/Vice Presidents",
    email: "president@university.edu",
    desc: "Submit proposals, manage rosters, events, and broadcast announcements",
    icon: Users,
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-500 hover:border-violet-500/40",
  },
  {
    role: "Faculty Coordinator",
    email: "faculty@university.edu",
    desc: "Approve event proposals and coordinate attendance check-ins",
    icon: UserCheck,
    color: "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-500 hover:border-green-500/40",
  },
  {
    role: "System Admin",
    email: "admin@university.edu",
    desc: "Verify payments, manage user directories, and system setup",
    icon: ShieldCheck,
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-500 hover:border-pink-500/40",
  },
  {
    role: "Head of Event",
    email: "eventhead@university.edu",
    desc: "Propose new events, configure registration forms, and upload payment QRs",
    icon: UserCheck,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 hover:border-amber-500/40",
  },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"profiles" | "manual">("profiles");
  const [activeQuickLoginEmail, setActiveQuickLoginEmail] = React.useState<string | null>(null);
  // Whether the Club Officers card is expanded
  const [officerExpanded, setOfficerExpanded] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(values.email, values.password);
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    }
  };

  const handleQuickLogin = async (email: string) => {
    if (loading) return;
    setAuthError(null);
    setActiveQuickLoginEmail(email);
    try {
      await login(email, "Password123!");
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
      setActiveQuickLoginEmail(null);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">

          {/* ── Profiles view ─────────────────────────────────────────── */}
          {view === "profiles" ? (
            <motion.div
              key="profiles-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border shadow-lg bg-card overflow-hidden">
                <CardHeader className="space-y-1.5 flex flex-col items-center text-center pb-6 border-b bg-gradient-to-b from-primary/5 to-transparent">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    University Portal Access
                  </CardTitle>
                  <CardDescription className="max-w-md text-sm">
                    Select your role profile to log in instantly, or use custom credentials.
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                  {authError && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
                      {authError}
                    </div>
                  )}

                  {/* ── Grid of single-role cards ──────────────────────── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SINGLE_ACCOUNTS.map((account) => {
                      const Icon = account.icon;
                      const isThisLoading = loading && activeQuickLoginEmail === account.email;
                      return (
                        <button
                          key={account.email}
                          onClick={() => handleQuickLogin(account.email)}
                          disabled={loading}
                          className={`flex items-start text-left gap-4 p-4 rounded-xl border bg-gradient-to-br ${account.color} transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden`}
                        >
                          <div className="mt-0.5 p-2 rounded-lg bg-background border shrink-0">
                            {isThisLoading ? (
                              <Spinner size="sm" className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {account.role}
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                              {account.email}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1.5 leading-normal">
                              {account.desc}
                            </p>
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-primary">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </button>
                      );
                    })}

                  </div>
                </CardContent>

                <CardFooter className="flex flex-col border-t bg-muted/10 pt-4 pb-6">
                  <Button
                    variant="outline"
                    onClick={() => { setAuthError(null); setView("manual"); }}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <Key className="h-4 w-4" />
                    <span>Log In with Custom Credentials</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

          ) : (
            /* ── Manual credentials view ────────────────────────────── */
            <motion.div
              key="manual-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border shadow-lg bg-card max-w-md mx-auto">
                <CardHeader className="space-y-1.5 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Key className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Custom Credentials
                  </CardTitle>
                  <CardDescription>
                    Log in using your official university credentials
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    {authError && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
                        {authError}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        University Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="student@university.edu"
                        error={errors.email?.message}
                        {...register("email")}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Password
                        </label>
                        <span className="text-xs text-primary hover:underline cursor-pointer font-medium">
                          Forgot Password?
                        </span>
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register("password")}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col pt-2 pb-6 space-y-4">
                    <Button type="submit" className="w-full animate-fade-in" isLoading={loading}>
                      Sign In
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setAuthError(null); setView("profiles"); }}
                      className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      disabled={loading}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Profile Selection</span>
                    </button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
