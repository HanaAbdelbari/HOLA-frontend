"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../context/AdminAuthContext";

type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  variantName?: string | null;
  variantLabel?: string | null;
  color?: string | null;
  selectedVariant?: string | null;
};

type AdminOrder = {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  depositAmount: number;
  createdAt: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string | null;
  items: OrderItem[];
};

// The statuses the admin can set.
const STATUSES = [
  "PENDING_DEPOSIT", "DEPOSIT_UNDER_REVIEW", "CONFIRMED",
  "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "DEPOSIT_REJECTED",
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, isLoggedIn, logout } = useAdminAuth();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Only render after mounting in the browser (this page depends on the
  // stored token and formats dates locally) — avoids hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect the page: if not logged in, go to login.
  useEffect(() => {
    if (!isLoggedIn) router.replace("/admin");
  }, [isLoggedIn, router]);

  // Fetch orders. Reused after a status change to refresh the list.
  async function fetchOrders(authToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 401 || res.status === 403) {
      logout();
      return;
    }
    const data = await res.json();
    setOrders(data);
  }

  // Load orders once when the token is available.
  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }
        const data = await res.json();
        if (active) setOrders(data);
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [token, logout]);

  async function changeStatus(id: number, status: string) {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchOrders(token); // refresh
  }

  if (!mounted || !isLoggedIn) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-brown">Orders</h1>
        <button
          onClick={() => { logout(); router.replace("/admin"); }}
          className="text-sm text-brown-soft transition-colors hover:text-gold"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-brown-soft">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-brown-soft">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-hairline bg-white p-4">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brown">{order.orderNumber}</div>
                  <div className="text-xs text-brown-soft">
                    {order.customerName} · {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-brown">EGP {order.totalAmount}</div>
                  <div className="text-xs text-brown-soft">Deposit: EGP {order.depositAmount}</div>
                </div>
              </div>

              {/* Status control */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-brown-soft">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => changeStatus(order.id, e.target.value)}
                  className="rounded-md border border-hairline bg-white px-2 py-1 text-xs text-brown focus:border-brown focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>

                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="ml-auto text-xs text-brown-soft underline"
                >
                  {expanded === order.id ? "Hide details" : "View details"}
                </button>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="mt-3 border-t border-hairline pt-3 text-sm text-brown-soft">
                  <p><span className="text-brown">Phone:</span> {order.phone}</p>
                  <p><span className="text-brown">Governorate:</span> {order.governorate}</p>
                  <p><span className="text-brown">Address:</span> {order.address}</p>
                  {order.notes && <p><span className="text-brown">Notes:</span> {order.notes}</p>}
                  <div className="mt-2">
                    <span className="text-brown">Items:</span>
                    <ul className="mt-1 space-y-1">
                      {order.items.map((item, i) => {
                        const variantText = item.variantName || item.variantLabel || item.color || item.selectedVariant;
                        return (
                          <li key={i}>
                            {item.productName}
                            {variantText && (
                              <span className="text-brown font-medium"> ({variantText})</span>
                            )}
                            {" "}× {item.quantity} — EGP {item.unitPrice}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}