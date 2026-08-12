"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";

type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  discountPercent: number | null;
  inStock: boolean;
  stockQuantity?: number;
  mainImageUrl: string | null;
};

export default function SalePage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/on-sale`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch sale products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-xs text-stone-400">
        <Link href="/" className="hover:text-brown transition-colors">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-brown font-medium">Sale</span>
      </nav>

      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide">
          Special Offers
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-gold/60" />
        <p className="mt-3 text-xs sm:text-sm text-brown-soft">
          Showing {displayedProducts.length} of {products.length}{" "}
          {products.length === 1 ? "product" : "products"} on offer
        </p>
      </div>

      {/* Product Grid / Empty State */}
      {loading ? (
        <p className="py-16 text-center text-xs text-stone-500">Loading offers...</p>
      ) : products.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-stone-200/80 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-stone-500 mb-4">
            No special offers available right now.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-xl bg-brown px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#4E342E]"
          >
            Explore All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Toggle Button / View Offers */}
          {!showAll && products.length > 4 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="inline-block rounded-full border border-brown/40 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-brown transition-all hover:border-brown hover:bg-brown hover:text-white"
              >
                View Offers
              </button>
            </div>
          )}

          {/* Continue Shopping */}
          <div className="mt-16 text-center">
            <p className="text-xs text-stone-500 mb-3">Looking for more styles?</p>
            <Link
              href="/shop"
              className="inline-block rounded-xl border border-brown/40 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-brown transition-all hover:border-brown hover:bg-brown hover:text-white"
            >
              Explore All Collections
            </Link>
          </div>
        </>
      )}
    </main>
  );
}