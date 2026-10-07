import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { ToastContainer } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "GD Goenka Event Hub – University Event Management",
  description: "GD Goenka Event Hub is the all-in-one platform for managing university clubs, events, and student registrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
