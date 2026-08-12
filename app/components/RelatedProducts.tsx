// "You may also like" — shows up to 4 products from the same category,
// excluding the current product. Runs on the server (just fetches + displays).
import ProductCard from "./ProductCard";

type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  discountPercent: number | null;
  inStock: boolean;
  mainImageUrl: string | null;
};

async function getCategoryProducts(
  categorySlug: string
): Promise<ProductSummary[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${categorySlug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function RelatedProducts({
  categorySlug,
  currentSlug,
}: {
  categorySlug: string;
  currentSlug: string;
}) {
  const all = await getCategoryProducts(categorySlug);

  // Remove the product we're currently viewing, keep up to 4.
  const related = all.filter((p) => p.slug !== currentSlug).slice(0, 4);

  // If there's nothing else in this category, show nothing.
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-hairline pt-12">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-3xl text-brown">You may also like</h2>
        <div className="mx-auto mt-2 h-px w-16 bg-gold" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}