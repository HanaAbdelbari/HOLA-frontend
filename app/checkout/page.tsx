"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
  "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia", "New Valley", "Suez",
  "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharqia",
  "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag",
];

const FREE_SHIPPING_THRESHOLD = 2000;

const CAIRO_GIZA = new Set(["cairo", "giza"]);
const CANAL_DAMIETTA = new Set(["ismailia", "suez", "port said", "damietta"]);
const UPPER_EGYPT = new Set([
  "fayoum", "beni suef", "minya", "assiut", "sohag", "qena", "luxor", "aswan"
]);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    governorate: "",
    address: "",
    notes: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function estimatedShipping(): number | null {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) return 0;
    if (!form.governorate) return null;

    const g = form.governorate.trim().toLowerCase();

    if (CAIRO_GIZA.has(g)) return 75;
    if (CANAL_DAMIETTA.has(g)) return 95;
    if (UPPER_EGYPT.has(g)) return 110;

    return 90;
  }

  const shipping = estimatedShipping();
  const total = shipping === null ? totalPrice : totalPrice + shipping;

  // تقريب العربون (Deposit) لأقرب 5 لأسفل بدون كسور
  const deposit = Math.floor((total * 0.5) / 5) * 5;

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function placeOrder() {
    setError("");
    if (!form.fullName || !form.phone || !form.governorate || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Store Policy.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          governorate: form.governorate,
          address: form.address,
          notes: form.notes,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const order = await res.json();
      clearCart();
      router.push(`/order-success?order=${order.orderNumber}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return <main className="mx-auto max-w-5xl px-4 py-20" />;
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-brown-soft">Your cart is empty.</p>
      </main>
    );
  }

  const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-brown-soft mb-1.5";
  const inputClass =
    "w-full rounded-lg border border-cyan-200 bg-white px-3.5 py-3 text-sm text-brown placeholder:text-stone-400 transition-all hover:border-cyan-400 focus:border-brown focus:outline-none focus:ring-1 focus:ring-brown shadow-sm";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl text-brown">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <section className="rounded-xl border border-cyan-100 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="mb-6 font-serif text-xl text-brown">Customer Information</h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  className={inputClass}
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="e.g. Sarah Ahmed"
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div>
                <label className={labelClass}>Governorate *</label>
                <select
                  className={inputClass}
                  value={form.governorate}
                  onChange={(e) => update("governorate", e.target.value)}
                >
                  <option value="">Select governorate</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Detailed Address *</label>
                <textarea
                  className={inputClass}
                  rows={2.5}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street, Building No., Apartment"
                />
              </div>

              <div>
                <label className={labelClass}>Order Notes (optional)</label>
                <input
                  className={inputClass}
                  placeholder="Clothing sizes, gift message, or delivery preferences"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <section className="rounded-xl border border-cyan-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-serif text-xl text-brown">Order Summary</h2>
            
            <div className="space-y-3 text-sm text-brown-soft">
              <div className="flex justify-between">
                <span>Products</span>
                <span className="font-semibold text-brown">EGP {totalPrice}</span>
              </div>
              <div className="flex justify-between border-b border-cyan-50 pb-3.5">
                <span>Shipping</span>
                <span>
                  {shipping === null ? (
                    <span className="italic text-stone-400">select governorate</span>
                  ) : shipping === 0 ? (
                    <span className="font-semibold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-brown">EGP {shipping}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-serif text-lg text-brown">
                <span>Total</span>
                <div className="font-bold">
                  <span>EGP {total}</span>
                  {shipping === null && (
                    <span className="ml-1 text-xs font-normal text-stone-500">
                      (+ shipping)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-cyan-200 bg-[#F0F9FF] p-6">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brown">Payment Details</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-brown">
                <span>Deposit to confirm (50%)</span>
                <span className="font-bold">EGP {deposit}</span>
              </div>
              <div className="flex justify-between text-sm text-brown-soft">
                <span>Remaining on delivery</span>
                <span>EGP {total - deposit}</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-stone-500">
              📌 Vodafone Cash instructions will be displayed immediately after placing the order.
            </p>
          </section>

          <div className="pt-1 space-y-4">
            <label className="flex items-center gap-2.5 text-xs text-brown-soft cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 accent-brown"
              />
              <span>
                I have read and agree to the{" "}
                <Link href="/policy" target="_blank" className="underline font-medium hover:text-brown">
                  Store Policy
                </Link>
              </span>
            </label>

            {error && <p className="text-xs font-medium text-rose-700">{error}</p>}

            <button
              onClick={placeOrder}
              disabled={submitting}
              className="w-full rounded-xl bg-brown py-4 text-sm font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-[#023E8A] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? "Placing order..." : "Place Order"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}