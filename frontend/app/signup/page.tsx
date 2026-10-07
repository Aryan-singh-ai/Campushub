"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  GraduationCap, ArrowRight, ArrowLeft, Key, UserCheck, ShieldCheck, Sparkles, Building, Phone, User
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Must be a valid email address" }),
  institution: z.string().min(2, { message: "Institution/University is required" }),
  phone: z.string().min(10, { message: "Enter a valid phone number (min 10 digits)" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/student");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", institution: "", phone: "", password: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setAuthError(null);
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 800));

      const mockGuestUser = {
        id: `usr-${Math.random().toString(36).substring(7)}`,
        name: values.name,
        email: values.email,
        role: "GUEST",
        institution: values.institution,
        phone: values.phone
      };

      // Set user session in localStorage
      localStorage.setItem("campushub_user", JSON.stringify(mockGuestUser));

      // Trigger custom storage sync
      window.dispatchEvent(new Event("campushub_storage_updated"));
      
      toast.success("Account Created Successfully", `Welcome to GD Goenka Event Hub, ${values.name.split(" ")[0]}!`);
      
      // Redirect to guest student dashboard
      router.push("/dashboard/student");
      
      // Reload window to refresh navbar session context
      setTimeout(() => {
        window.location.reload();
      }, 200);
      
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during account creation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border shadow-lg bg-card overflow-hidden">
            <CardHeader className="space-y-1.5 flex flex-col items-center text-center pb-6 border-b bg-gradient-to-b from-primary/5 to-transparent">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create Guest Account
              </CardTitle>
              <CardDescription className="max-w-xs text-sm">
                Register as an external student to participate in campus hackathons, fests, and sports meets.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-4 text-xs">
                {authError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
                    {authError}
                  </div>
                )}
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-primary" /> Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Aditi Sharma"
                    error={errors.name?.message}
                    {...register("name")}
                    disabled={loading}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Key className="h-3.5 w-3.5 text-primary" /> Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. aditi@gmail.com"
                    error={errors.email?.message}
                    {...register("email")}
                    disabled={loading}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Institution Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-primary" /> Institution / University
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Delhi University"
                    error={errors.institution?.message}
                    {...register("institution")}
                    disabled={loading}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-primary" /> Contact Number
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. +91 99887 76655"
                    error={errors.phone?.message}
                    {...register("phone")}
                    disabled={loading}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Key className="h-3.5 w-3.5 text-primary" /> Choose Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                    disabled={loading}
                    className="h-9 text-xs"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col pt-2 pb-6 space-y-4 px-6">
                <Button type="submit" className="w-full h-10 font-bold uppercase text-xs tracking-wider" isLoading={loading}>
                  Sign Up & Log In
                </Button>
                
                <div className="flex justify-between w-full items-center text-xs text-muted-foreground pt-1.5 border-t">
                  <span>Already have an account?</span>
                  <Link href="/login" className="text-primary font-bold hover:underline">
                    Log In
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
