import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-16 bg-white border-t border-stone-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Single Image replacing the 4-image grid */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-stone-200/80 shadow-lg bg-[#FAF7F2]">
              <Image
                src="https://res.cloudinary.com/jubzk4b3/image/upload/v1786564198/WhatsApp_Image_2026-08-12_at_9.14.56_PM.jpg"
                alt="HOLA Egyptian Cotton Beach Towel"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
          </div>

          {/* About Text Content */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide">
              About HOLA
            </h2>
            <div className="mx-auto lg:mx-0 mt-3 h-0.5 w-12 rounded-full bg-gold/60" />

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-stone-600">
              Meet the <strong className="font-serif text-brown">HOLA Beach Towel 🌊</strong> — 
               crafted from 100% Egyptian Cotton to elevate your summer escapes. 
              Lightweight, super absorbent, and ultra-fast drying.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              ✨ Personalize your towel with custom printing — add your Name, Zodiac, or Favorite Photo!
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="rounded-xl bg-brown px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-stone-800 active:scale-[0.99]"
              >
                EXPLORE COLLECTION
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-stone-300 bg-white px-7 py-3 text-xs font-bold uppercase tracking-widest text-stone-700 transition-all hover:bg-stone-50 active:scale-[0.99]"
              >
                OUR STORY
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}