import ProductCard from "../components/ProductCard";

type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  discountPercent: number | null;
  inStock: boolean;
  stockQuantity: number;
  mainImageUrl: string | null;
};

// إجبار Next.js على جلب البيانات مباشرة من السيرفر بدون كاش
export const dynamic = "force-dynamic";

async function getProducts(): Promise<ProductSummary[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Page title */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-brown">Shop All</h1>
        <div className="mx-auto mt-2 h-px w-16 bg-gold" />
        <p className="mt-3 text-sm text-brown-soft">
          Showing {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Products grid, or an empty message */}
      {products.length === 0 ? (
        <p className="py-16 text-center text-muted">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}