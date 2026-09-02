"use client";

import { Suspense } from "react";
import ProductForm from "../../../components/ProductForm";

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <ProductForm />
    </Suspense>
  );
}