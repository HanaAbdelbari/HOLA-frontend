"use client";

import { useEffect, useState, use } from "react";
import { useCart } from "../../context/CartContext";

type ProductVariant = {
  id?: number;
  label: string;
  price?: number | null;
  stockQuantity: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  material?: string;
  size?: string;
  dimensions?: string;
  color?: string;
  stockQuantity: number;
  images?: string[];
  imageUrls?: string[];
  variants?: ProductVariant[];
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
        {variants.map((variant, index) => {
          const isSelected = selectedVariant?.label === variant.label;
          const isOutOfStock = variant.stockQuantity === 0;

          return (
            <button
              key={variant.id || index}
              type="button"
              onClick={() => onSelect(variant)}
              disabled={isOutOfStock}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-brown bg-brown text-white"
                  : "border-hairline text-brown hover:bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span>{variant.label}</span>
              {variant.price != null && (
                <span className={`ml-1 text-xs ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
                  ({variant.price} EGP)
                </span>
              )}
            </button>
          );
        })}
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

  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/products/${slug}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data: Product = await res.json();
        setProduct(data);

        const productImages = data.imageUrls ?? data.images ?? [];

        if (productImages.length > 0) {
          setSelectedImage(productImages[0]);
        }

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
    if (quantity > variant.stockQuantity && variant.stockQuantity > 0) {
      setQuantity(variant.stockQuantity);
    } else if (variant.stockQuantity === 0) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: selectedVariant?.price ?? product.salePrice ?? product.price,
      imageUrl: (product.imageUrls ?? product.images ?? [])[0] ?? "",
      attributes: selectedVariant?.label ?? "",
    }, quantity);

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  if (loading) {
    return <div className="p-12 text-center text-brown">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="p-12 text-center text-red-500">Product not found!</div>;
  }

  const allImages = product.imageUrls ?? product.images ?? [];
  const currentPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
  const maxStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 1. معرض الصور */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
          {selectedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${
                  selectedImage === imgUrl ? "border-brown ring-2 ring-brown" : "border-gray-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
          {Number(currentPrice).toFixed(2)} EGP
        </p>

        {product.description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>
        )}

        {/* عرض تفاصيل المادة، الأبعاد، والمقاس للعميل */}
        <div className="mt-4 space-y-1.5 text-sm text-brown-soft">
          {product.material && (
            <p>
              <span className="font-semibold text-brown">Material:</span> {product.material}
            </p>
          )}
          {product.dimensions && (
            <p>
              <span className="font-semibold text-brown">Dimensions:</span> {product.dimensions}
            </p>
          )}
          {product.size && (
            <p>
              <span className="font-semibold text-brown">Size:</span> {product.size}
            </p>
          )}
        </div>

        {/* الألوان أو الفاريانتس */}
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            title="Options / Variants"
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={handleSelectVariant}
          />
        )}

        {/* حالة الستوك */}
        <p className="mt-3 text-xs text-brown-soft">
          {maxStock === 0
            ? "Out of stock"
            : maxStock === 1
            ? "Only 1 item left in stock!"
            : `${maxStock} items available`}
        </p>

        {/* العداد وزر الإضافة للسلة */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center border border-hairline rounded-md bg-white px-3 py-2 text-sm">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || maxStock === 0}
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
            onClick={handleAddToCart}
            disabled={maxStock === 0 || ((product.variants?.length ?? 0) > 0 && !selectedVariant)}
            className={`flex-1 rounded-md py-3 text-sm font-medium transition-colors ${
              maxStock > 0
                ? "bg-brown text-white hover:bg-[#4E342E]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {maxStock === 0 ? "Out of Stock" : addedMessage ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}