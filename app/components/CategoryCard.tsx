import Link from "next/link";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  slug: string;
  coverImage: string | null;
};

interface CategoryCardProps {
  category: Category;
  priority?: boolean;
}

export default function CategoryCard({ category, priority = false }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/category/${category.slug}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-stone-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-stone-100"
    >
      {/* Background Image */}
      {category.coverImage ? (
        <Image
          src={category.coverImage}
          alt={category.name}
          fill
          priority={priority}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-stone-200 text-stone-400 text-xs">
          No Image
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

      {/* Category Name Label */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <h3 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-white drop-shadow-md transition-transform duration-300 group-hover:scale-105">
          {category.name}
        </h3>
        <span className="mt-1 inline-block text-[10px] font-medium text-stone-200 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
          Explore Collection &rarr;
        </span>
      </div>
    </Link>
  );
}