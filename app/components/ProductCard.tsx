"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  onSale?: boolean;
  discountPercent?: number | null;
  inStock?: boolean;
  stockQuantity?: number;
  mainImageUrl?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  // 1. قراءة الـ stockQuantity الحقيقي
  const stockQty = product.stockQuantity ?? 0;

  // 2. الاعتماد على stockQuantity أو inStock المباشرة لحساب هل المنتج متوفر
  const isInStock = product.inStock !== undefined 
    ? product.inStock 
    : (product.stockQuantity !== undefined ? stockQty > 0 : true);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault(); // يمنع الانتقال لصفحة المنتج عند الضغط على الزر
    if (!isInStock || stockQty <= 0) return;

    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.onSale && product.salePrice ? product.salePrice : product.price,
        imageUrl: product.mainImageUrl ?? "",
        attributes: "",
        stockQuantity: stockQty, // مررنا المخزون للـ CartContext
      },
      1
    );
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#FAF7F2] border border-stone-200/60">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
            No image
          </div>
        )}

        {/* Discount badge */}
        {product.onSale && product.discountPercent && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-brown px-2 py-0.5 font-sans text-[10px] font-semibold text-white shadow-sm">
            -{product.discountPercent}%
          </span>
        )}

        {/* Out of stock badge */}
        {!isInStock && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-stone-600 shadow-sm backdrop-blur-sm">
            Sold out
          </span>
        )}

        {/* Add to Cart bar - Slides up on hover */}
        {isInStock && (
          <button
            onClick={quickAdd}
            className="absolute inset-x-0 bottom-0 translate-y-full bg-brown/95 py-3 text-center text-xs font-semibold tracking-wider uppercase text-white backdrop-blur-sm opacity-0 transition-all duration-300 hover:bg-[#4E342E] group-hover:translate-y-0 group-hover:opacity-100"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-3 px-1">
        {/* Name */}
        <h3 className="font-serif text-sm font-medium text-brown transition-colors group-hover:text-gold line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2 font-sans">
          {product.onSale && product.salePrice ? (
            <>
              <span className="text-sm font-semibold text-brown">
                EGP {product.salePrice}
              </span>
              <span className="text-xs text-stone-400 line-through">
                EGP {product.price}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-brown">
              EGP {product.price}
            </span>
          )}
        </div>

        {/* Stock status */}
        <div className="mt-1 text-[11px]">
          {!isInStock ? (
            <span className="font-medium text-stone-600">Out of stock</span>
          ) : stockQty <= 3 && product.stockQuantity !== undefined ? (
            <span className="font-medium text-amber-700">Only {stockQty} left</span>
          ) : (
            <span className="text-emerald-600">In stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}