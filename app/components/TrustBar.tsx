import { Award, Truck, Sparkles, Heart } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: <Heart size={16} />,
      title: "Premium Quality",
    },
    {
      icon: <Award size={16} />,
      title: "100% Egyptian Cotton",
    },
    {
      icon: <Truck size={16} />,
      title: "Free Shipping over EGP 2000",
    },
    {
      icon: <Sparkles size={16} />,
      title: "Custom Printing Available",
    },
  ];

  return (
    <div className="border-b border-hairline bg-[#FAF7F2] py-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 text-center text-xs font-medium text-brown"
            >
              <span className="text-gold">{item.icon}</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}