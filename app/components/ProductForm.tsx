"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";

type Category = { id: number; name: string; slug: string };

type Variant = {
  id?: number;
  label: string;
  price?: number | null;
  stockQuantity: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({ productId }: { productId?: number }) {
  const router = useRouter();
  const { token, isLoggedIn, logout } = useAdminAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // States للـ Variants
  const [variants, setVariants] = useState<Variant[]>([]);
  const [varLabel, setVarLabel] = useState("");
  const [varPrice, setVarPrice] = useState("");
  const [varStock, setVarStock] = useState("0");

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    material: "",
    size: "",
    dimensions: "",
    color: "",
    stockQuantity: "0",
    displayOrder: "0",
  });

  useEffect(() => {
    if (!isLoggedIn) router.replace("/admin");
  }, [isLoggedIn, router]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!productId || !token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((detail) => {
        setForm({
          categoryId: String(detail.categoryId ?? ""),
          name: detail.name ?? "",
          slug: detail.slug ?? "",
          description: detail.description ?? "",
          price: String(detail.price ?? ""),
          salePrice: detail.salePrice != null ? String(detail.salePrice) : "",
          material: detail.material ?? "",
          size: detail.size ?? "",
          dimensions: detail.dimensions ?? "",
          color: detail.color ?? "",
          stockQuantity: String(detail.stockQuantity ?? 0),
          displayOrder: String(detail.displayOrder ?? 0),
        });
        setImageUrls(detail.images ?? detail.imageUrls ?? []);
        setVariants(detail.variants ?? []);
        setSlugEdited(true);
      })
      .catch(() => {});
  }, [productId, token]);

  function update(field: string, value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "name" && !slugEdited) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  // إضافة Variant جديد للقائمة المحلية
  function addVariant() {
    if (!varLabel.trim()) return;
    const newVar: Variant = {
      label: varLabel.trim(),
      price: varPrice !== "" && !isNaN(Number(varPrice)) ? Number(varPrice) : null,
      stockQuantity: !isNaN(Number(varStock)) ? Number(varStock) : 0,
    };
    setVariants((prev) => [...prev, newVar]);
    setVarLabel("");
    setVarPrice("");
    setVarStock("0");
  }

  // حذف Variant من القائمة
  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (!res.ok) {
        setError("Image upload failed.");
        return;
      }
      const result = await res.json();
      setImageUrls((prev) => [...prev, result.url]);
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setError("");
    if (!form.categoryId || !form.name || !form.slug || !form.price) {
      setError("Category, name, slug, and price are required.");
      return;
    }

    setSaving(true);

    // تجهيز قائمة الـ variants النهائية
    const finalVariants = [...variants];

    // حماية: لو المستخدم كتب variant في الإينبوت ونسي يضغط "+ Add Variant"
    if (varLabel.trim()) {
      const unaddedVariant: Variant = {
        label: varLabel.trim(),
        price: varPrice !== "" && !isNaN(Number(varPrice)) ? Number(varPrice) : null,
        stockQuantity: !isNaN(Number(varStock)) ? Number(varStock) : 0,
      };
      finalVariants.push(unaddedVariant);
      setVariants(finalVariants);
      setVarLabel("");
      setVarPrice("");
      setVarStock("0");
    }

    const body = {
      categoryId: Number(form.categoryId),
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      material: form.material || null,
      size: form.size || null,
      dimensions: form.dimensions || null,
      color: form.color || null,
      stockQuantity: Number(form.stockQuantity),
      displayOrder: Number(form.displayOrder),
      imageUrls: imageUrls,
      variants: finalVariants,
    };

    const url = productId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${productId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`;
    const method = productId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }
      if (!res.ok) {
        setError("Could not save. Check the fields (slug must be unique).");
        setSaving(false);
        return;
      }
      router.push("/admin/products");
    } catch {
      setError("Something went wrong.");
      setSaving(false);
    }
  }

  if (!isLoggedIn) return null;

  const input =
    "mt-1 w-full rounded-md border border-hairline bg-white px-3 py-2 text-sm text-brown focus:border-brown focus:outline-none";
  const labelC = "mt-4 block text-xs text-brown-soft";

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl text-brown">
        {productId ? "Edit Product" : "Add Product"}
      </h1>

      <label className="block text-xs text-brown-soft">Category</label>
      <select
        className={input}
        value={form.categoryId}
        onChange={(e) => update("categoryId", e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label className={labelC}>Name</label>
      <input className={input} value={form.name} onChange={(e) => update("name", e.target.value)} />

      <label className={labelC}>Slug (URL)</label>
      <input
        className={input}
        value={form.slug}
        onChange={(e) => {
          setSlugEdited(true);
          update("slug", e.target.value);
        }}
      />

      <label className={labelC}>Description</label>
      <textarea
        className={input}
        rows={3}
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Price (EGP)</label>
          <input
            className={input}
            type="number"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={labelC}>Sale Price (optional)</label>
          <input
            className={input}
            type="number"
            value={form.salePrice}
            onChange={(e) => update("salePrice", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Material</label>
          <input
            className={input}
            placeholder="e.g. 100% Cotton"
            value={form.material}
            onChange={(e) => update("material", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={labelC}>Color (optional)</label>
          <input
            className={input}
            placeholder="e.g. Ocean Blue"
            value={form.color}
            onChange={(e) => update("color", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Dimensions (optional)</label>
          <input
            className={input}
            placeholder="e.g. 100 x 180 cm"
            value={form.dimensions}
            onChange={(e) => update("dimensions", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={labelC}>Size (optional)</label>
          <input
            className={input}
            placeholder="e.g. S, M, L or Free Size"
            value={form.size}
            onChange={(e) => update("size", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Stock Quantity</label>
          <input
            className={input}
            type="number"
            value={form.stockQuantity}
            onChange={(e) => update("stockQuantity", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={labelC}>Display Order</label>
          <input
            className={input}
            type="number"
            value={form.displayOrder}
            onChange={(e) => update("displayOrder", e.target.value)}
          />
        </div>
      </div>

      {/* قسم Product Variants */}
      <div className="mt-6 rounded-md border border-hairline bg-[#FDFBF7] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brown">
          Product Variants (Colors / Sizes)
        </h3>

        {/* عرض القائمة الحالية للـ Variants */}
        {variants.length > 0 && (
          <div className="mt-3 space-y-2">
            {variants.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-hairline bg-white p-2 text-xs text-brown"
              >
                <div>
                  <span className="font-semibold">{v.label}</span>
                  {v.price != null && <span className="ml-2 text-brown-soft">({v.price} EGP)</span>}
                  <span className="ml-2 text-muted">— Stock: {v.stockQuantity}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* حقول إضافة Variant جديد */}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            className={input}
            placeholder="Variant Name (e.g. Ocean Blue)"
            value={varLabel}
            onChange={(e) => setVarLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addVariant();
              }
            }}
          />
          <input
            className={input}
            type="number"
            placeholder="Price (Optional)"
            value={varPrice}
            onChange={(e) => setVarPrice(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addVariant();
              }
            }}
          />
          <input
            className={input}
            type="number"
            placeholder="Stock Quantity"
            value={varStock}
            onChange={(e) => setVarStock(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addVariant();
              }
            }}
          />
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="mt-3 w-full rounded-md border border-brown bg-white py-1.5 text-xs text-brown hover:bg-[#F8F2EC]"
        >
          + Add Variant
        </button>
      </div>

      <label className={labelC}>Images</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {imageUrls.map((url, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md border border-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            >
              ×
            </button>
          </div>
        ))}

        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-hairline text-xs text-brown-soft hover:border-brown">
          {uploading ? "Uploading..." : "+ Add"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <p className="mt-1 text-xs text-muted">
        The first image is the main one shown on cards.
      </p>

      {error && <p className="mt-3 text-sm text-[#8F473A]">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="flex-1 rounded-md border border-brown py-2.5 text-sm text-brown hover:bg-[#F8F2EC]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex-1 rounded-md bg-brown py-2.5 text-sm text-white hover:bg-[#4E342E] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </main>
  );
}