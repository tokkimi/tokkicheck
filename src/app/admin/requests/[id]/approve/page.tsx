import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { approveProductRequest } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function ApproveRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [request, categories, countries] = await Promise.all([
    prisma.productRequest.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);
  if (!request) notFound();

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-gray-900">등록 요청 승인</h2>
      <p className="mb-3 text-xs text-gray-500">
        사용자가 제출한 정보를 확인하고 부족한 항목(카테고리, 제조국,
        영양성분 등)을 채운 뒤 승인하세요.
      </p>
      <ProductForm
        action={approveProductRequest}
        categories={categories}
        countries={countries}
        submitLabel="승인하고 게시"
        extraHiddenFields={[{ name: "requestId", value: request.id }]}
        product={{
          nameKo: request.nameKo,
          brandKo: request.brandKo,
          categoryId: request.categoryId ?? undefined,
          imageFront: request.imageFront ?? undefined,
          imageBack: request.imageBack,
        }}
      />
    </div>
  );
}
