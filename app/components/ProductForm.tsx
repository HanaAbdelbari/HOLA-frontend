"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";

type Category = { id: number; name: string; slug: string };

// Turn "Gold Hoops" into "gold-hoops" for the slug.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// If productId is given, the form loads that product and updates it.
// Otherwise it creates a new product.
export default function ProductForm({ productId }: { productId?: number }) {
  const router = useRouter();
  const { token, isLoggedIn, logout } = useAdminAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Uploaded image URLs (from Cloudinary) + upload-in-progress flag.
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    material: "",
    size: "",
    chainLength: "",
    stockQuantity: "0",
    displayOrder: "0",
  });

  useEffect(() => {
    if (!isLoggedIn) router.replace("/admin");
  }, [isLoggedIn, router]);

  // Load categories for the dropdown.
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // If editing, load the product's current data from the admin detail endpoint.
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
          chainLength: detail.chainLength ?? "",
          stockQuantity: String(detail.stockQuantity ?? 0),
          displayOrder: String(detail.displayOrder ?? 0),
        });
        setImageUrls(detail.images ?? []);
        setSlugEdited(true);
      })
      .catch(() => {});
  }, [productId, token]);

  function update(field: string, value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Auto-generate slug from name until the user edits slug manually.
      if (field === "name" && !slugEdited) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  // Upload a chosen file to the backend (which stores it on Cloudinary),
  // then add the returned URL to the list.
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
      e.target.value = ""; // allow re-selecting the same file
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

    const body = {
      categoryId: Number(form.categoryId),
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      material: form.material || null,
      size: form.size || null,
      chainLength: form.chainLength || null,
      stockQuantity: Number(form.stockQuantity),
      displayOrder: Number(form.displayOrder),
      imageUrls: imageUrls,
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
      <select className={input} value={form.categoryId}
        onChange={(e) => update("categoryId", e.target.value)}>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <label className={labelC}>Name</label>
      <input className={input} value={form.name} onChange={(e) => update("name", e.target.value)} />

      <label className={labelC}>Slug (URL)</label>
      <input className={input} value={form.slug}
        onChange={(e) => { setSlugEdited(true); update("slug", e.target.value); }} />

      <label className={labelC}>Description</label>
      <textarea className={input} rows={3} value={form.description}
        onChange={(e) => update("description", e.target.value)} />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Price (EGP)</label>
          <input className={input} type="number" value={form.price}
            onChange={(e) => update("price", e.target.value)} />
        </div>
        <div className="flex-1">
          <label className={labelC}>Sale Price (optional)</label>
          <input className={input} type="number" value={form.salePrice}
            onChange={(e) => update("salePrice", e.target.value)} />
        </div>
      </div>

      <label className={labelC}>Material</label>
      <input className={input} value={form.material} onChange={(e) => update("material", e.target.value)} />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Size (optional)</label>
          <input className={input} value={form.size} onChange={(e) => update("size", e.target.value)} />
        </div>
        <div className="flex-1">
          <label className={labelC}>Chain Length (optional)</label>
          <input className={input} value={form.chainLength} onChange={(e) => update("chainLength", e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelC}>Stock Quantity</label>
          <input className={input} type="number" value={form.stockQuantity}
            onChange={(e) => update("stockQuantity", e.target.value)} />
        </div>
        <div className="flex-1">
          <label className={labelC}>Display Order</label>
          <input className={input} type="number" value={form.displayOrder}
            onChange={(e) => update("displayOrder", e.target.value)} />
        </div>
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

        {/* Upload button */}
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
        <button onClick={() => router.push("/admin/products")}
          className="flex-1 rounded-md border border-brown py-2.5 text-sm text-brown hover:bg-[#F8F2EC]">
          Cancel
        </button>
        <button onClick={save} disabled={saving}
          className="flex-1 rounded-md bg-brown py-2.5 text-sm text-white hover:bg-[#4E342E] disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </main>
  );
}