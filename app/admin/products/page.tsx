"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Pencil, Trash2, Plus, RotateCcw } from "lucide-react";

type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  categoryName: string;
  mainImageUrl: string | null;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, isLoggedIn, logout } = useAdminAuth();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Render only after mounting in the browser (depends on stored token).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/admin");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }
        const data = await res.json();
        if (active) setProducts(data);
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

  async function handleDelete(id: number) {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setConfirmId(null);
    // Refresh the list
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
    );
  }

  async function handleRestore(id: number) {
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}/restore`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
    );
  }

  const productToDelete = products.find((p) => p.id === confirmId);

  if (!mounted || !isLoggedIn) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-brown">Products</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="text-sm text-brown-soft hover:text-gold">
            Orders
          </Link>
          <button
            onClick={() => { logout(); router.replace("/admin"); }}
            className="text-sm text-brown-soft hover:text-gold"
          >
            Logout
          </button>
        </div>
      </div>

      <Link
        href="/admin/products/new"
        className="mb-4 inline-flex items-center gap-2 rounded-md bg-brown px-4 py-2 text-sm text-white transition-colors hover:bg-[#4E342E]"
      >
        <Plus size={16} /> Add Product
      </Link>

      {loading ? (
        <p className="text-brown-soft">Loading...</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 rounded-lg border border-hairline bg-white p-3 ${
                !p.isActive ? "opacity-50" : ""
              }`}
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-[#F8F2EC]">
                {p.mainImageUrl && (
                  <Image src={p.mainImageUrl} alt={p.name} fill className="object-cover" sizes="56px" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium text-brown">
                  {p.name}
                  {!p.isActive && <span className="ml-2 text-xs text-muted">(hidden)</span>}
                </div>
                <div className="text-xs text-brown-soft">
                  {p.categoryName} · EGP {p.salePrice ?? p.price} · Stock: {p.stockQuantity}
                </div>
              </div>

              <Link
                href={`/admin/products/${p.id}`}
                aria-label="Edit"
                className="text-brown-soft transition-colors hover:text-brown"
              >
                <Pencil size={16} />
              </Link>
              {p.isActive ? (
                <button
                  onClick={() => setConfirmId(p.id)}
                  aria-label="Hide"
                  className="text-brown-soft transition-colors hover:text-[#8F473A]"
                >
                  <Trash2 size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleRestore(p.id)}
                  aria-label="Restore"
                  className="text-brown-soft transition-colors hover:text-success"
                  title="Restore to store"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <Trash2 size={32} className="mx-auto text-[#8F473A]" />
            <h3 className="mt-4 font-serif text-xl text-brown">Hide this product?</h3>
            <p className="mt-2 text-sm text-brown-soft">
              {productToDelete.name} will be hidden from the store. Existing orders keep it.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-md border border-brown py-2.5 text-sm text-brown hover:bg-[#F8F2EC]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(productToDelete.id)}
                className="flex-1 rounded-md bg-[#8F473A] py-2.5 text-sm text-white hover:bg-[#7a3d31]"
              >
                Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}