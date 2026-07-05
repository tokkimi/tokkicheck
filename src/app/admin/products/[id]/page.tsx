import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createIssue, deleteIssue, updateProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, countries] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { issues: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">제품 수정</h2>
      <ProductForm
        action={updateProduct}
        categories={categories}
        countries={countries}
        product={product}
        submitLabel="저장"
      />

      <div className="mt-8 border-t border-border pt-5">
        <h3 className="mb-3 text-sm font-bold text-danger">
          제조 안전 주의 관리
        </h3>

        <div className="mb-4 flex flex-col gap-2">
          {product.issues.length === 0 && (
            <p className="text-xs text-gray-400">등록된 이슈가 없습니다.</p>
          )}
          {product.issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-bold text-red-900">{issue.titleKo}</p>
              <p className="mt-1 text-xs text-red-800">{issue.descriptionKo}</p>
              <p className="mt-1 text-xs text-gray-500">
                영상: {issue.videoUrl}
              </p>
              <form action={deleteIssue} className="mt-2">
                <input type="hidden" name="id" value={issue.id} />
                <button className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-danger">
                  삭제
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={createIssue} className="flex flex-col gap-2">
          <input type="hidden" name="productId" value={product.id} />
          <input
            name="titleKo"
            required
            placeholder="이슈 제목 (예: 비위생적 제조 공정 신고)"
            className="input"
          />
          <textarea
            name="descriptionKo"
            required
            rows={2}
            placeholder="상세 설명"
            className="input"
          />
          <input
            name="videoUrl"
            required
            placeholder="영상 URL (유튜브 등) 또는 내부 경로"
            className="input"
          />
          <input
            name="sourceUrl"
            placeholder="출처 URL (선택)"
            className="input"
          />
          <select name="severity" defaultValue="1" className="input">
            <option value="1">경미</option>
            <option value="2">주의</option>
            <option value="3">심각</option>
          </select>
          <button className="rounded-xl bg-danger py-2.5 text-sm font-bold text-white">
            이슈 등록
          </button>
        </form>
      </div>
    </div>
  );
}
