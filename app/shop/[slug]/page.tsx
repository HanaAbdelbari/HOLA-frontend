"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";

type ProductVariant = {
  id?: number;
  label: string;
  price?: number;
  stockQuantity: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  images: string[];
  variants: ProductVariant[];
};

function VariantSelector({
  title,
  variants,
  selectedVariant,
  onSelect,
}: {
  title: string;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-medium text-brown">{title}</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <button
            key={variant.id || index}
            type="button"
            onClick={() => onSelect(variant)}
            disabled={variant.stockQuantity === 0}
            className={`rounded-md border px-3 py-2 text-sm transition-colors ${
              selectedVariant?.label === variant.label
                ? "border-brown bg-brown text-white"
                : "border-hairline text-brown hover:bg-gray-50"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {variant.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/products/${slug}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data: Product = await res.json();
        setProduct(data);

        // ضبط الصورة الرئيسية الافتراضية
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }

        // اختيار أول Variant متوفر
        if (data.variants && data.variants.length > 0) {
          const firstAvailable = data.variants.find((v) => v.stockQuantity > 0) || data.variants[0];
          setSelectedVariant(firstAvailable);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (quantity > variant.stockQuantity) {
      setQuantity(Math.max(1, variant.stockQuantity));
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-brown">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="p-12 text-center text-red-500">Product not found!</div>;
  }

  const currentPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
  const maxStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 1. معرض الصور (Image Gallery) */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        {/* المصغرات (Thumbnails) */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${
                  selectedImage === imgUrl ? "border-brown ring-2 ring-brown" : "border-gray-200"
                }`}
              >
                <img src={imgUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. تفاصيل المنتج والتفاعل */}
      <div className="flex flex-col">
        <h1 className="font-serif text-3xl text-brown">{product.name}</h1>
        
        <p className="text-2xl font-semibold text-brown mt-2">
          {currentPrice.toFixed(2)} EGP
        </p>

        {product.description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>
        )}

        {/* الخيارات المتاحة */}
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            title="Select Option"
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={handleSelectVariant}
          />
        )}

        {/* حالة الستوك */}
        {selectedVariant && (
          <p className="mt-3 text-xs text-brown-soft">
            {selectedVariant.stockQuantity === 0
              ? "Out of stock"
              : selectedVariant.stockQuantity === 1
              ? "Only 1 item left in stock!"
              : `${selectedVariant.stockQuantity} items available`}
          </p>
        )}

        {/* العداد وزر الإضافة */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center border border-hairline rounded-md bg-white px-3 py-2 text-sm">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-2 text-brown hover:bg-gray-100 rounded disabled:opacity-30"
            >
              -
            </button>
            <span className="px-3 font-medium text-brown">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              disabled={quantity >= maxStock || maxStock === 0}
              className="px-2 text-brown hover:bg-gray-100 rounded disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={maxStock === 0 || ((product.variants?.length ?? 0) > 0 && !selectedVariant)}
            className={`flex-1 rounded-md py-3 text-sm font-medium transition-colors ${
              maxStock > 0
                ? "bg-brown text-white hover:bg-[#4E342E]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {maxStock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}