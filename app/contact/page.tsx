import { Metadata } from "next";
import InstagramIcon from "../components/InstagramIcon";
import { MessageCircle, Music2, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Lumière via WhatsApp, Instagram, or TikTok. We are happy to help with your orders and inquiries.",
};

export default function ContactPage() {
  const channels = [
    {
      label: "WhatsApp",
      value: "010 6682 6143",
      href: "https://wa.me/201066826143",
      icon: MessageCircle,
    },
    {
      label: "Instagram",
      value: "@lumiereaccessories.lu",
      href: "https://instagram.com/lumiereaccessories.lu",
      icon: InstagramIcon,
    },
    {
      label: "TikTok",
      value: "@lumiere_2222",
      href: "https://tiktok.com/@lumiere_2222",
      icon: Music2,
    },
  ];

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide">Contact Us</h1>
        <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-gold/60" />
        <p className="mt-3 text-sm text-brown-soft leading-relaxed">
          We&apos;d love to hear from you. Reach out any time.
        </p>
      </div>

      <div className="space-y-4">
        {channels.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF7F2] text-brown transition-colors group-hover:bg-brown group-hover:text-white">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-serif text-base font-medium text-brown">{c.label}</div>
                  <div className="text-xs text-brown-soft">{c.value}</div>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brown"
              />
            </a>
          );
        })}
      </div>
    </main>
  );
}