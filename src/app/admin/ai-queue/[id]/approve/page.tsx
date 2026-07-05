import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { approveAiProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function ApproveAiProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories, countries] = await Promise.all([
    prisma.aiDiscoveredProduct.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);
  if (!item) notFound();

  const matchedCategory = categories.find((c) => c.id === item.categorySlug);

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-gray-900">
        AI 발견 신상품 검수
      </h2>
      <p className="mb-3 text-xs text-gray-500">
        AI가 자동 수집한 정보이므로 반드시 사실 여부(칼로리, 성분, 원산지 등)를
        확인한 뒤 게시하세요.
      </p>
      <ProductForm
        action={approveAiProduct}
        categories={categories}
        countries={countries}
        submitLabel="검수 완료 후 게시"
        extraHiddenFields={[{ name: "aiId", value: item.id }]}
        product={{
          nameKo: item.nameKo,
          brandKo: item.brandKo,
          categoryId: matchedCategory?.id,
          imageFront: item.imageFront ?? undefined,
          calories: item.calories,
        }}
      />
    </div>
  );
}
