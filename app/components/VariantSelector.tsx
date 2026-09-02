"use client";

import { useState } from "react";

export interface ProductVariant {
  id?: number;
  label: string;
  price?: number;
  stockQuantity: number;
}

interface VariantSelectorProps {
  title?: string;
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  title = "Select Option",
  variants,
  onSelect,
}: VariantSelectorProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!variants || variants.length === 0) return null;

  const handleSelect = (variant: ProductVariant, index: number) => {
    if (variant.stockQuantity <= 0) return;
    setSelectedId(variant.id ?? index);
    onSelect(variant);
  };

  return (
    <div className="my-4">
      <label className="block text-xs font-medium uppercase tracking-wider text-brown-soft mb-2">
        {title}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {variants.map((v, index) => {
          const currentId = v.id ?? index;
          const isSelected = selectedId === currentId;
          const isOutOfStock = v.stockQuantity <= 0;

          return (
            <button
              key={currentId}
              type="button"
              disabled={isOutOfStock}
              onClick={() => handleSelect(v, index)}
              className={`flex flex-col items-center justify-center rounded-lg border py-2.5 px-2 transition-all text-center ${
                isSelected
                  ? "border-brown bg-[#F8F2EC] ring-1 ring-brown"
                  : "border-gray-200 bg-white hover:border-brown-soft"
              } ${isOutOfStock ? "opacity-40 cursor-not-allowed bg-gray-50" : "cursor-pointer"}`}
            >
              {/* اسم الخيار */}
              <span className={`text-sm font-medium ${isSelected ? "text-brown" : "text-gray-800"}`}>
                {v.label}
              </span>

              {/* السعر إن وجد */}
              {v.price != null && (
                <span className="text-[11px] text-brown-soft mt-0.5">
                  ({v.price} EGP)
                </span>
              )}

              {/* المخزون المتبقي */}
              <span
                className={`text-[10px] mt-1 font-sans ${
                  v.stockQuantity === 1
                    ? "text-red-500 font-semibold"
                    : v.stockQuantity > 0
                    ? "text-gray-400"
                    : "text-red-400"
                }`}
              >
                {v.stockQuantity === 0
                  ? "Out of stock"
                  : v.stockQuantity === 1
                  ? "1 left"
                  : `${v.stockQuantity} in stock`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}