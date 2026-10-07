"use client";

import React from "react";
import { useRouter } from "next/navigation";

export type UserRole = "STUDENT" | "PRESIDENT" | "FACULTY" | "ADMIN" | "EVENT_HEAD" | "GUEST";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null, isAuthenticated: false, loading: false,
  login: async () => {}, logout: () => {},
});

const MOCK_ACCOUNTS: Record<string, AuthUser> = {
  "student@university.edu":   { id: "usr-001", name: "Karthik Rajan",  email: "student@university.edu",   role: "STUDENT" },
  "president@university.edu": { id: "usr-002", name: "Arjun Mehta",    email: "president@university.edu", role: "PRESIDENT" },
  "faculty@university.edu":   { id: "usr-004", name: "Dr. Priya Nair", email: "faculty@university.edu",   role: "FACULTY" },
  "admin@university.edu":     { id: "usr-005", name: "System Admin",   email: "admin@university.edu",     role: "ADMIN" },
  "eventhead@university.edu": { id: "usr-006", name: "Vikram Malhotra", email: "eventhead@university.edu", role: "EVENT_HEAD" },
};

const ROLE_REDIRECTS: Record<UserRole, string> = {
  STUDENT:       "/dashboard/student",
  PRESIDENT:     "/dashboard/officers/select-club",
  FACULTY:       "/dashboard/faculty",
  ADMIN:         "/dashboard/admin",
  EVENT_HEAD:    "/dashboard/event-head",
  GUEST:         "/dashboard/student",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("campushub_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const account = MOCK_ACCOUNTS[email.toLowerCase()];
    if (!account) { setLoading(false); throw new Error("No account found with this email address."); }
    if (password.length < 6) { setLoading(false); throw new Error("Password must be at least 6 characters."); }
    setUser(account);
    localStorage.setItem("campushub_user", JSON.stringify(account));
    setLoading(false);
    router.push(ROLE_REDIRECTS[account.role]);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campushub_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return React.useContext(AuthContext); }
