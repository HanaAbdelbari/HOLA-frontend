import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[75vh] min-h-[520px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
        alt="HOLA Beach Towel"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/25 to-black/15" />

      {/* Centered Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
        <span className="inline-block rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white mb-4 border border-white/20">
          🇪🇬 100% Egyptian Cotton
        </span>

        <h1 className="font-serif text-3xl font-normal leading-tight tracking-wide sm:text-5xl md:text-6xl text-white drop-shadow-sm">
          Meet the HOLA Beach Towel 🌊
        </h1>

        <p className="mt-3 text-xs sm:text-base leading-relaxed text-stone-100 max-w-xl mx-auto drop-shadow-sm">
          Pure comfort designed for summer. Lightweight, super absorbent, and fast drying. Fits in your bag, not your worries.
        </p>

        {/* Soft Glassmorphism Customization Badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md px-5 py-2.5 text-xs font-medium text-white shadow-sm border border-white/25">
          <span>✨ <strong className="font-semibold text-white">Custom Printing:</strong> Personalize with your Name, Zodiac, or Favorite Photo!</span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-xl bg-brown px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:bg-white hover:text-brown active:scale-[0.99]"
          >
            SHOP BEACH TOWELS
          </Link>
        </div>
      </div>
    </section>
  );
}