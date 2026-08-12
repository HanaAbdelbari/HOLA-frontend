"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAdminAuth();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, go straight to orders.
  useEffect(() => {
    if (isLoggedIn) router.replace("/admin/orders");
  }, [isLoggedIn, router]);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      login(data.token);
      router.replace("/admin/orders");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl tracking-[0.2em] text-brown">LUMIÈRE</h1>
        <p className="mt-2 text-sm text-brown-soft">Admin Dashboard</p>
      </div>

      <label className="block text-xs text-brown-soft">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        className="mt-1 w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-sm text-brown focus:border-brown focus:outline-none"
      />

      {error && <p className="mt-3 text-sm text-[#8F473A]">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-brown py-3 text-white transition-colors hover:bg-[#4E342E] disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </main>
  );
}