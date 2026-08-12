"use client"; // interactive: clicking a thumbnail changes the big image

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
  onSale,
  discountPercent,
}: {
  images: string[];
  name: string;
  onSale?: boolean;
  discountPercent?: number | null;
}) {
  // "selected" remembers which image is the big one right now.
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-hairline bg-white text-muted">
        No image
      </div>
    );
  }

  return (
    <div>
      {/* Big image — shorter, rounded, with the discount badge */}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {onSale && discountPercent && (
          <span className="absolute right-3 top-3 rounded-full bg-brown px-2.5 py-1 text-[11px] font-medium text-white">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Thumbnails row — only show if there's more than one image */}
      {images.length > 1 && (
        <div className="mt-2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-xl border transition-all duration-200 ${
                selected === i
  ? "border-brown shadow-sm"
  : "border-hairline hover:border-brown-soft"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}