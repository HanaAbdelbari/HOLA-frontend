import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Store Policy",
  description: "Learn about Lumière's payment options, shipping times across Egypt, order cancellation, and return policy.",
};

export default function PolicyPage() {
  const policies = [
    {
      icon: "💳",
      title: "Payment",
      content: (
        <>
          Orders are confirmed with a <strong className="text-brown font-semibold">50% deposit</strong> via Vodafone Cash. The remaining amount is paid on delivery (Cash on Delivery). After placing your order, you’ll receive payment instructions and send your transfer screenshot on WhatsApp.
        </>
      ),
    },
    {
      icon: "🚚",
      title: "Shipping",
      content: (
        <>
          We deliver all over Egypt within <strong className="text-brown font-semibold">3–5 business days</strong>. Shipping is <strong className="text-emerald-700 font-semibold">FREE</strong> on orders over EGP 2000.
        </>
      ),
    },
    {
      icon: "✨",
      title: "Exchange & Returns",
      content: (
        <>
          We do not offer returns or exchanges, except when there is an error on our side or a defect in the piece. In that case, we’ll gladly exchange it for you immediately.
        </>
      ),
    },
    {
      icon: "🕒",
      title: "Order Cancellation",
      content: (
        <>
          You may cancel your order within <strong className="text-brown font-semibold">24 hours</strong> of confirmation, and your deposit will be fully refunded. After 24 hours, the order cannot be cancelled as execution begins.
        </>
      ),
    },
    {
      icon: "💎",
      title: "Materials & Care",
      content: (
        <>
          The material of each piece is marked on its underside or description, so you always know exactly what you’re wearing and how to care for it.
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#FCFCFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-brown tracking-wide mb-3">
            Store Policy
          </h1>
          <div className="w-12 h-[2px] bg-brown/40 mx-auto rounded-full mb-4" />
          <p className="text-xs sm:text-sm text-brown-soft max-w-md mx-auto leading-relaxed">
            Everything you need to know about ordering, shipping, and caring for your Lumière pieces.
          </p>
        </div>

        <div className="space-y-4">
          {policies.map((item, index) => (
            <section
              key={index}
              className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm transition-all hover:border-stone-300"
            >
              <div className="flex items-start gap-4">
                <span className="text-xl sm:text-2xl select-none pt-0.5">{item.icon}</span>
                <div className="space-y-1.5 flex-1">
                  <h2 className="font-serif text-lg text-brown tracking-wide">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {item.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-stone-400">
          Have any questions?{" "}
          <Link
            href="/checkout"
            className="text-brown underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}