import ProductCard from "../../../components/ProductCard";

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

async function getCategoryProducts(slug: string): Promise<ProductSummary[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
}

// Turn a slug like "gold-hoops" into a title "Gold Hoops"
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getCategoryProducts(slug);
  const title = titleFromSlug(slug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-muted">Home › {title}</div>

      {/* Page title */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-brown">{title}</h1>
        <div className="mx-auto mt-2 h-px w-16 bg-gold" />
        <p className="mt-3 text-sm text-brown-soft">
          Showing {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Products, or an empty message */}
      {products.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No products in this category yet.
        </p>
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