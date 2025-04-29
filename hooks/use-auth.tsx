"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";
  const isEditor =
    session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";

  return {
    user: session?.user || null,
    status,
    isAdmin,
    isEditor,
    signIn,
    signOut,
  };
}
