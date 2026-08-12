"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const TOKEN_KEY = "hola-admin-token";

type AdminAuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // Read the saved token once (lazy init), so refresh keeps you logged in.
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  });

  // Keep localStorage in sync with the token.
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  function login(newToken: string) {
    setToken(newToken);
  }

  function logout() {
    setToken(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{ token, login, logout, isLoggedIn: !!token }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}