"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type AuthContextType = {
  user: any | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider: string, options?: any) => Promise<any>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setIsAdmin(session.user.role === "ADMIN");
      setIsEditor(
        session.user.role === "ADMIN" || session.user.role === "EDITOR"
      );
    } else {
      setUser(null);
      setIsAdmin(false);
      setIsEditor(false);
    }
  }, [session]);

  const value = {
    user,
    status,
    signIn,
    signOut,
    isAdmin,
    isEditor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
