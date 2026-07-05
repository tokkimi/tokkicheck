import Link from "next/link";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="px-4 py-4">
      <h1 className="mb-4 text-xl font-extrabold text-gray-900">카테고리</h1>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface py-5 shadow-sm"
          >
            <span className="text-3xl">{c.icon}</span>
            <span className="text-xs font-semibold text-gray-700">
              {c.nameKo}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
