"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "user";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company: string;
  plan: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEMO_ADMIN: UserProfile = {
  id: "USR-ADMIN-01",
  name: "Joain Monroy",
  email: "admin@slate.io",
  role: "admin",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  company: "Slate HQ",
  plan: "Enterprise Suite",
};

const DEMO_USER: UserProfile = {
  id: "USR-CLIENT-02",
  name: "Carlos Mendoza",
  email: "carlos@nexuslabs.co",
  role: "user",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  company: "Nexus Labs",
  plan: "Pro Plan",
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(DEMO_ADMIN);
  const router = useRouter();

  const login = (email: string, role: UserRole = "admin") => {
    if (role === "user" || email.includes("user")) {
      setUser(DEMO_USER);
      router.push("/user");
    } else {
      setUser(DEMO_ADMIN);
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === "admin") {
      setUser(DEMO_ADMIN);
      router.push("/");
    } else {
      setUser(DEMO_USER);
      router.push("/user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
