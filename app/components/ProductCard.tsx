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

  const stockQty = product.stockQuantity ?? 0;
  const isInStock = product.inStock !== undefined 
    ? product.inStock 
    : (product.stockQuantity !== undefined ? stockQty > 0 : true);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation(); // يمنع انتشار حدث الضغط للـ Link

    if (!isInStock || stockQty <= 0) return;

    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.onSale && product.salePrice ? product.salePrice : product.price,
        imageUrl: product.mainImageUrl ?? "",
        attributes: "",
        stockQuantity: stockQty,
      },
      1
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-[#FAF7F2] p-3 border border-stone-200/60 transition-all duration-200 hover:shadow-sm">
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
          {product.mainImageUrl ? (
            <Image
              src={product.mainImageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
              No image
            </div>
          )}

          {/* Badges */}
          {product.onSale && product.discountPercent && (
            <span className="absolute right-2 top-2 rounded-full bg-brown px-2 py-0.5 font-sans text-[10px] font-semibold text-white shadow-sm">
              -{product.discountPercent}%
            </span>
          )}

          {!isInStock && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-stone-600 shadow-sm backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-3">
          <h3 className="font-serif text-sm font-medium text-brown transition-colors group-hover:text-gold line-clamp-1">
            {product.name}
          </h3>

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
        </div>
      </Link>

      {/* زر الإضافة للسلة ظاهر ومتاح دائمًا */}
      <div className="mt-3">
        <button
          type="button"
          onClick={quickAdd}
          disabled={!isInStock || stockQty <= 0}
          className={`w-full rounded-md py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
            isInStock && stockQty > 0
              ? "bg-brown text-white hover:bg-[#4E342E] active:scale-[0.98]"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {!isInStock || stockQty <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}