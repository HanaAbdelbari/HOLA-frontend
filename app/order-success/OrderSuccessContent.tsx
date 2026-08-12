"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy, Clock, Package, Truck, XCircle } from "lucide-react";

// Vodafone Cash & WhatsApp numbers configuration
const VODAFONE_NUMBER = "010 6682 6143";
const WHATSAPP_NUMBER = "201066826143";

type OrderResponse = {
  orderNumber: string;
  status:
    | "PENDING_DEPOSIT"
    | "DEPOSIT_UNDER_REVIEW"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "DEPOSIT_REJECTED"
    | string;
  productsTotal: number;
  shippingFee: number;
  totalAmount: number;
  depositAmount: number;
};

export default function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  // تحديد حالة التحميل من البداية لتجنب تحذيرات الـ ESLint
  const [loading, setLoading] = useState<boolean>(!!orderNumber);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;

    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderNumber}`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  function copyNumber() {
    navigator.clipboard.writeText(VODAFONE_NUMBER.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Pre-filled WhatsApp message
  const waMessage = encodeURIComponent(
    `Hello Lumière!\nOrder Number: ${orderNumber}\nI have transferred the deposit and I'm attaching the payment screenshot.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center text-brown-soft">
        Loading order details...
      </main>
    );
  }

  const currentStatus = order?.status || "PENDING_DEPOSIT";

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      {/* Dynamic Status Header */}
      <div className="rounded-lg border border-hairline p-6 text-center">
        {currentStatus === "PENDING_DEPOSIT" && (
          <>
            <CheckCircle size={44} className="mx-auto text-success" />
            <h1 className="mt-4 font-serif text-2xl text-brown">
              Order placed successfully
            </h1>
            <p className="mt-2 text-sm text-brown-soft">
              Your order has been created. Complete the deposit to confirm it.
            </p>
          </>
        )}

        {currentStatus === "DEPOSIT_UNDER_REVIEW" && (
          <>
            <Clock size={44} className="mx-auto text-amber-500" />
            <h1 className="mt-4 font-serif text-2xl text-brown">
              Deposit Under Review
            </h1>
            <p className="mt-2 text-sm text-brown-soft">
              We received your request and are verifying your payment screenshot!
            </p>
          </>
        )}

        {(currentStatus === "CONFIRMED" || currentStatus === "PREPARING") && (
          <>
            <Package size={44} className="mx-auto text-brown" />
            <h1 className="mt-4 font-serif text-2xl text-brown">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-sm text-brown-soft">
              Your deposit is verified. We are currently preparing your items.
            </p>
          </>
        )}

        {currentStatus === "SHIPPED" && (
          <>
            <Truck size={44} className="mx-auto text-blue-600" />
            <h1 className="mt-4 font-serif text-2xl text-brown">
              Order On The Way
            </h1>
            <p className="mt-2 text-sm text-brown-soft">
              Your package has been shipped and is with the delivery courier.
            </p>
          </>
        )}

        {currentStatus === "DELIVERED" && (
          <>
            <CheckCircle size={44} className="mx-auto text-emerald-600" />
            <h1 className="mt-4 font-serif text-2xl text-brown">
              Order Delivered
            </h1>
            <p className="mt-2 text-sm text-brown-soft">
              Thank you for shopping with Lumière!
            </p>
          </>
        )}

        {(currentStatus === "CANCELLED" || currentStatus === "DEPOSIT_REJECTED") && (
          <>
            <XCircle size={44} className="mx-auto text-rose-500" />
            <h1 className="mt-4 font-serif text-2xl text-brown">
              Order Cancelled
            </h1>
            <p className="mt-2 text-sm text-brown-soft">
              {currentStatus === "DEPOSIT_REJECTED"
                ? "Deposit verification failed. Please contact support via WhatsApp."
                : "This order has been cancelled."}
            </p>
          </>
        )}

        <div className="mt-4 rounded-lg bg-cream p-3">
          <div className="text-xs text-brown-soft">Order Number</div>
          <div className="text-lg tracking-wide text-brown">{orderNumber}</div>
        </div>
      </div>

      {/* Payment Instructions (تظهر فقط لو العميل لسه محولش العربون PENDING_DEPOSIT) */}
      {currentStatus === "PENDING_DEPOSIT" && (
        <>
          <div className="mt-4 rounded-lg border border-hairline p-5">
            <h2 className="mb-4 text-sm font-medium text-brown">
              Payment Instructions
            </h2>

            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream text-xs text-brown">
                1
              </span>
              <div className="flex-1">
                <p className="mb-2 text-sm text-brown">Transfer the deposit</p>
                <div className="rounded-lg bg-cream p-3">
                  <div className="flex justify-between text-sm text-brown-soft">
                    <span>Deposit (50%)</span>
                    <span className="text-brown">
                      EGP {order ? order.depositAmount : "…"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-brown-soft">
                    Vodafone Cash
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brown">{VODAFONE_NUMBER}</span>
                    <button
                      onClick={copyNumber}
                      className="flex items-center gap-1 rounded-md border border-hairline px-2 py-1 text-xs text-brown hover:border-brown"
                    >
                      <Copy size={12} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mt-4 flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream text-xs text-brown">
                2
              </span>
              <div className="flex-1">
                <p className="mb-2 text-sm text-brown">
                  Send your payment screenshot on WhatsApp
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md bg-brown py-3 text-center text-sm text-white transition-colors hover:bg-[#4E342E]"
                >
                  Open WhatsApp
                </a>
                <p className="mt-2 text-xs italic text-muted">
                  Message pre-filled with order number {orderNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F5E9D0] p-3">
            <Clock size={16} className="mt-0.5 flex-shrink-0 text-[#9A7B3F]" />
            <p className="text-sm text-[#7A6230]">
              Your order is reserved. It will be confirmed once we review your transfer.
            </p>
          </div>
        </>
      )}

      {/* Continue Shopping Button */}
      <Link
        href="/shop"
        className="mt-4 block rounded-xl border border-brown py-3 text-center text-sm text-brown transition-colors hover:bg-brown hover:text-white"
      >
        Continue Shopping
      </Link>
    </main>
  );
}