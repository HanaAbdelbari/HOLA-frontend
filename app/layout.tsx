import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-custom",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: {
    default: "HOLA — Beach Towels & Essentials",
    template: "%s | HOLA",
  },
  description: "Premium 100% Egyptian Cotton Beach Towels. Lightweight, absorbent, fast-drying, and customizable.",
  keywords: [
    "HOLA",
    "beach towels",
    "egyptian cotton towels",
    "custom beach towel",
    "personalized towel",
    "مناشف شاطئ",
    "فوط قطن مصري",
  ],
  openGraph: {
    title: "HOLA — Beach Towels & Essentials",
    description: "Premium 100% Egyptian Cotton Beach Towels. Lightweight, absorbent, fast-drying, and customizable.",
    siteName: "HOLA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jakarta.variable} ${bodoni.variable} font-sans bg-white text-stone-800 antialiased`}>
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}