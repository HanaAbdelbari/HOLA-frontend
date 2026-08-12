import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "../../components/ProductGallery";
import AddToCartSection from "../../components/AddToCartSection";
import RelatedProducts from "../../components/RelatedProducts";

type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  discountPercent: number | null;
  material: string | null;
  size: string | null;
  chainLength: string | null;
  stockQuantity: number;
  inStock: boolean;
  categoryName: string;
  categorySlug: string;
  images: string[];
};

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Lumière. Elegant stainless steel accessories.`,
    openGraph: {
      title: `${product.name} | Lumière`,
      description: product.description || `Buy ${product.name} at Lumière.`,
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const attributes = [
    { label: "Material", value: product.material },
    { label: "Size", value: product.size },
    { label: "Chain length", value: product.chainLength },
  ].filter((a) => a.value);

  return (
    <main className="mx-auto max-w-5xl px-6 py-5">
      <div className="mb-3 text-sm text-brown-soft">
        Home › {product.categoryName} › {product.name}
      </div>

      <div className="grid gap-4 md:gap-10 md:grid-cols-[44%_56%] items-start">
        <ProductGallery
          images={product.images}
          name={product.name}
          onSale={product.onSale}
          discountPercent={product.discountPercent}
        />

        <div>
          <h1 className="font-serif text-lg text-brown">{product.name}</h1>

          <div className="mt-1 flex items-center gap-3">
            {product.onSale ? (
              <>
                <span className="text-lg font-medium text-brown">
                  EGP {product.salePrice}
                </span>
                <span className="text-sm text-muted line-through">
                  EGP {product.price}
                </span>
                <span className="rounded-full bg-brown px-2 py-0.5 text-[10px] font-medium text-white">
                  -{product.discountPercent}%
                </span>
              </>
            ) : (
              <span className="text-lg font-medium text-brown">
                EGP {product.price}
              </span>
            )}
          </div>

          {attributes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attributes.map((attr) => (
                <div
                  key={attr.label}
                  className="rounded-full border border-hairline px-3 py-1.5"
                >
                  <span className="text-xs text-muted">{attr.label}: </span>
                  <span className="text-xs text-brown">{attr.value}</span>
                </div>
              ))}
            </div>
          )}

          {product.description && (
            <p className="mt-2 text-xs leading-relaxed text-brown-soft">
              {product.description}
            </p>
          )}

          <div className="mt-3 mb-2">
            {product.inStock ? (
              product.stockQuantity > 0 && product.stockQuantity <= 3 && (
                <p className="text-sm font-medium text-error">
                  Only {product.stockQuantity} pieces remaining
                </p>
              )
            ) : (
              <p className="text-sm text-muted">Out of stock</p>
            )}
          </div>

          <AddToCartSection
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={product.onSale ? product.salePrice! : product.price}
            imageUrl={product.images[0] ?? null}
            attributes={attributes.map((a) => a.value).join(" · ")}
            inStock={product.inStock}
            stockQuantity={product.stockQuantity}
          />
        </div>
      </div>

      <RelatedProducts
        categorySlug={product.categorySlug}
        currentSlug={product.slug}
      />
    </main>
  );
}