"use client";

import { useState } from "react";
import { Minus, Plus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

// Receives everything needed to add this product to the cart.
export default function AddToCartSection({
  id,
  slug,
  name,
  price,
  imageUrl,
  attributes,
  inStock,
  stockQuantity,
}: {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  attributes: string;
  inStock: boolean;
  stockQuantity: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-md bg-sand py-3 text-muted"
      >
        Out of Stock
      </button>
    );
  }

  function handleAdd() {
    addItem({ id, slug, name, price, imageUrl, attributes }, quantity);
    setShowToast(true); // show the confirmation
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {/* Quantity stepper */}
        <div className="flex items-center gap-3 rounded-lg border border-hairline px-3 py-2.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="text-brown-soft transition-colors hover:text-brown"
          >
            <Minus size={16} strokeWidth={1.5} />
          </button>
          <span className="min-w-[1.5rem] text-center text-sm text-brown">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
            aria-label="Increase quantity"
            className="text-brown-soft transition-colors hover:text-brown"
          >
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 rounded-lg bg-brown py-3.5 text-sm tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-[#553528]"
        >
          Add to Cart
        </button>
      </div>

      {/* Confirmation toast — appears after adding */}
      {showToast && (
        <div className="mt-4 rounded-lg border border-hairline bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-brown">
            <CheckCircle size={18} className="text-success" />
            Added to cart
          </div>
          <div className="flex gap-3">
            <Link
              href="/shop"
              className="flex-1 rounded-md border border-brown py-2.5 text-center text-sm text-brown transition-colors hover:bg-brown hover:text-white"
            >
              Continue Shopping
            </Link>
            <Link
              href="/cart"
              className="flex-1 rounded-md bg-brown py-2.5 text-center text-sm text-white transition-colors hover:bg-[#4E342E]"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}