import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/auth";
import { getCategories, getProductsByCategory, enrichProductsForUser } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const productsRaw = await getProductsByCategory(slug);
  const products = await enrichProductsForUser(productsRaw, session?.user?.id);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-1 flex items-center gap-2 text-xl font-extrabold text-gray-900">
        <span>{category.icon}</span>
        {category.nameKo}
      </h1>
      <p className="mb-4 text-xs text-gray-500">
        총 {products.length}개 제품
      </p>
      {products.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          아직 등록된 제품이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
