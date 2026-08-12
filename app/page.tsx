import Link from "next/link";
import Image from "next/image";
import { Music2 } from "lucide-react";
import ProductCard from "./components/ProductCard";
import CategoryCard from "./components/CategoryCard";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import InstagramIcon from "./components/InstagramIcon";

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

type Category = {
  id: number;
  name: string;
  slug: string;
  coverImage: string | null;
};

async function getProducts(): Promise<ProductSummary[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch products:", e);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch categories:", e);
    return [];
  }
}

async function getOnSale(): Promise<ProductSummary[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/on-sale`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch offers:", e);
    return [];
  }
}

export default async function HomePage() {
  const [products, categories, offers] = await Promise.all([
    getProducts(),
    getCategories(),
    getOnSale(),
  ]);

  return (
    <>
      <Hero />
      <TrustBar />

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide">
              Shop by Category
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-gold/60" />
          </div>
          
          {/* Grid متناسق ومستجيب لعدد الكروت */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 justify-center">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                priority={index < 4} 
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide">
              New Arrivals
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-gold/60" />
          </div>
          <div
            className={`grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 ${
              products.length < 4 ? "justify-center max-w-3xl mx-auto" : ""
            }`}
          >
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Special Offers Section */}
      {offers.length > 0 && (
        <section className="bg-[#F0F9FF] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide">
                Special Offers
              </h2>
              <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-gold/60" />
            </div>

            <div
              className={`grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 ${
                offers.length < 4 ? "justify-center max-w-3xl mx-auto" : ""
              }`}
            >
              {offers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {offers.length > 4 && (
              <div className="mt-10 text-center">
                <Link
                  href="/shop/sale"
                  className="inline-block rounded-full border border-brown/40 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-brown transition-all hover:border-brown hover:bg-brown hover:text-white"
                >
                  View All Offers
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* About HOLA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          
          {/* Single Featured Towel Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-3xl overflow-hidden border border-hairline shadow-md bg-white">
              <Image
                src="https://res.cloudinary.com/jubzk4b3/image/upload/v1786564198/WhatsApp_Image_2026-08-12_at_9.14.56_PM.jpg"
                alt="HOLA Egyptian Cotton Beach Towel"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-serif text-3xl text-brown sm:text-4xl">
              About HOLA
            </h2>
            <div className="mx-auto md:mx-0 mt-2 h-0.5 w-12 rounded-full bg-gold/60" />
            
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-stone-600">
              Meet the <strong className="font-serif text-brown">HOLA Beach Towel 🌊</strong> — 
              crafted from 100% Egyptian Cotton to elevate your summer escapes. 
              Lightweight, super absorbent, and ultra-fast drying. Fits right into your bag, not your worries.
            </p>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-500">
              ✨ Personalize your towel with custom printing — add your Name, Zodiac, or Favorite Photo!
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href="/shop"
                className="rounded-xl bg-brown px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#023E8A]"
              >
                Explore Collection
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-brown/50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-brown transition-all hover:border-brown hover:bg-brown hover:text-white"
              >
                Our Story
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Follow Us */}
      <section className="bg-[#F0F9FF] py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="font-serif text-3xl text-brown">Follow HOLA</h2>
          <p className="mt-2 text-xs text-stone-500 sm:text-sm">
            Stay inspired with our latest summer collections & behind the scenes.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <a
              href="https://www.instagram.com/holla_hola23?igsh=NXV2aWRnNThoYzUw"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-hairline bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brown/40 hover:shadow-md"
            >
              <div className="text-brown transition-transform group-hover:scale-110">
                <InstagramIcon size={26} />
              </div>
              <span className="text-xs font-semibold text-brown">Instagram</span>
              <span className="text-[10px] text-stone-400">@holla_hola23</span>
            </a>

            <a
              href="https://www.tiktok.com/@hola_hola2305?_r=1&_t=ZS-98pYPeSiZSW"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-hairline bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brown/40 hover:shadow-md"
            >
              <div className="text-brown transition-transform group-hover:scale-110">
                <Music2 size={26} />
              </div>
              <span className="text-xs font-semibold text-brown">TikTok</span>
              <span className="text-[10px] text-stone-400">@hola_hola2305</span>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-brown">
          Ready to Elevate Your Beach Days?
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-stone-500">
          Discover our 100% Egyptian Cotton towels designed for ultimate comfort and style.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-xl bg-brown px-10 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#023E8A] hover:shadow-md hover:-translate-y-0.5"
        >
          Shop Now
        </Link>
      </section>
    </>
  );
}