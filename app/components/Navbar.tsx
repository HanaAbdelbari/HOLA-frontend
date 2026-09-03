"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { Playfair_Display } from "next/font/google";
import { useCart } from "../context/CartContext";

const logoFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export default function Navbar() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // التأكد من إن الـ Component تم تحميله على المتصفح لمنع خطأ الـ Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-4 sm:px-6">
        
        {/* Left: Desktop Nav / Mobile Menu */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="text-brown md:hidden hover:opacity-70"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-brown">
            <Link href="/" className="transition-opacity hover:opacity-60">
              Home
            </Link>
            <Link href="/shop" className="transition-opacity hover:opacity-60">
              Shop
            </Link>
            <Link href="/about" className="transition-opacity hover:opacity-60">
              About
            </Link>
            <Link href="/policy" className="transition-opacity hover:opacity-60">
              Contact
            </Link>
          </nav>
        </div>

        {/* Center: Styled Editorial Logo */}
        <div className="text-center">
          <Link
            href="/"
            className={`${logoFont.className} inline-block text-3xl sm:text-4xl font-bold tracking-[0.25em] text-brown transition-transform hover:scale-105 duration-200`}
          >
            HOLA
          </Link>
        </div>

        {/* Right: Social & Cart Icons */}
        <div className="flex items-center justify-end gap-5 text-brown">
          <a
            href="https://www.instagram.com/holla_hola23?igsh=NXV2aWRnNThoYzUw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden sm:block transition-opacity hover:opacity-60"
          >
            <InstagramIcon size={18} />
          </a>
          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="relative transition-opacity hover:opacity-60"
          >
            <ShoppingBag size={20} />
            {/* العرض فقط بعد الـ Mounting لمنع الـ Hydration Error */}
            {mounted && totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brown text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}