export default function AnnouncementBar() {
  const messages = [
    "✨ Free shipping on orders over EGP 2000",
    "🚚 Delivery all over Egypt",
    "🌊 100% Egyptian Cotton Beach Towels",
  ];

  const line = messages.join("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");

  const half = (prefix: string) =>
    Array.from({ length: 3 }).map((_, i) => (
      <span key={`${prefix}-${i}`} className="mx-10 text-xs tracking-wide">
        {line}
      </span>
    ));

  return (
    <div className="overflow-hidden bg-brown py-2 text-white">
      {/* CSS style to slow down marquee if needed: duration-30 or custom CSS */}
      <div className="animate-marquee flex w-max whitespace-nowrap opacity-90">
        <div className="flex shrink-0">{half("a")}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {half("b")}
        </div>
      </div>
    </div>
  );
}