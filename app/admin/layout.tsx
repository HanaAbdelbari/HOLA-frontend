"use client";

import { AdminAuthProvider } from "../context/AdminAuthContext";

// Wraps all /admin pages with the auth provider.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}