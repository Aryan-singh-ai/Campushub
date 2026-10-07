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

    // Try live Java Spring Boot auth API first
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("campushub_auth_token", data.token);
          let mappedRole: UserRole = "STUDENT";
          const r = (data.role || "").toUpperCase();
          if (r.includes("ADMIN")) mappedRole = "ADMIN";
          else if (r.includes("FACULTY")) mappedRole = "FACULTY";
          else if (r.includes("OFFICER") || r.includes("PRESIDENT")) mappedRole = "PRESIDENT";
          else if (r.includes("EVENT_HEAD") || r.includes("EVENTHEAD")) mappedRole = "EVENT_HEAD";

          const authUser: AuthUser = {
            id: String(data.id || "usr-001"),
            name: data.name || "University User",
            email: data.email,
            role: mappedRole,
          };
          setUser(authUser);
          localStorage.setItem("campushub_user", JSON.stringify(authUser));
          setLoading(false);
          router.push(ROLE_REDIRECTS[authUser.role]);
          return;
        }
      }
    } catch (e) {
      // Backend offline – fall through to mock demo login
    }

    // Fallback Mock authentication for standalone demo
    await new Promise((r) => setTimeout(r, 400));
    const account = MOCK_ACCOUNTS[email.toLowerCase()];
    if (!account) { 
      // If valid custom university email, create student session
      if (email.endsWith("@university.edu") && password.length >= 6) {
        const customUser: AuthUser = {
          id: `usr-${Math.random().toString(36).substr(2, 5)}`,
          name: email.split("@")[0].replace(".", " ").toUpperCase(),
          email,
          role: "STUDENT",
        };
        setUser(customUser);
        localStorage.setItem("campushub_user", JSON.stringify(customUser));
        setLoading(false);
        router.push(ROLE_REDIRECTS.STUDENT);
        return;
      }
      setLoading(false); 
      throw new Error("No account found with this email address."); 
    }
    if (password.length < 6) { setLoading(false); throw new Error("Password must be at least 6 characters."); }
    setUser(account);
    localStorage.setItem("campushub_user", JSON.stringify(account));
    setLoading(false);
    router.push(ROLE_REDIRECTS[account.role]);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campushub_user");
    localStorage.removeItem("campushub_auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return React.useContext(AuthContext); }
