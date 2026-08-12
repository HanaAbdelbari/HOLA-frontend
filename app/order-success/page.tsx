import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-10">
          Loading...
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}