"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut, Menu, X, Sun, Moon, LayoutDashboard, Calendar, Users } from "lucide-react";
import React from "react";
import { useAuth } from "@/providers/auth-provider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const navLinks = [
    { href: "/clubs", label: "Clubs", icon: Users },
    { href: "/events", label: "Events", icon: Calendar },
    ...(isAuthenticated && user
      ? [
          {
            href:
              user.role === "STUDENT" || user.role === "GUEST"
                ? "/dashboard/student"
                : user.role === "PRESIDENT"
                ? "/dashboard/officers/select-club"
                : user.role === "FACULTY"
                ? "/dashboard/faculty"
                : user.role === "ADMIN"
                ? "/dashboard/admin"
                : user.role === "EVENT_HEAD"
                ? "/dashboard/event-head"
                : "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight">GD Goenka Event Hub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="h-8 w-8 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {user?.name?.charAt(0) ?? "U"}
              </div>
              <button
                onClick={() => { logout(); router.push("/login"); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden h-8 w-8 rounded-lg border flex items-center justify-center"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); router.push("/login"); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t mt-2">
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
