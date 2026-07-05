import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ChevronLeft, PlayCircle } from "lucide-react";
import { getProductDetail } from "@/lib/queries";
import { ProductImageFlip } from "@/components/ProductImageFlip";
import { RatingWidget } from "@/components/RatingWidget";

export const dynamic = "force-dynamic";

const nutritionRows = (p: NonNullable<Awaited<ReturnType<typeof getProductDetail>>>) => [
  { label: "열량", value: p.calories != null ? `${p.calories} kcal` : "-" },
  { label: "탄수화물", value: p.carbsG != null ? `${p.carbsG} g` : "-" },
  { label: "당류", value: p.sugarG != null ? `${p.sugarG} g` : "-" },
  { label: "단백질", value: p.proteinG != null ? `${p.proteinG} g` : "-" },
  { label: "지방", value: p.fatG != null ? `${p.fatG} g` : "-" },
  { label: "나트륨", value: p.sodiumMg != null ? `${p.sodiumMg} mg` : "-" },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductDetail(id);
  if (!product) notFound();

  return (
    <div className="pb-8">
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} />
        </Link>
        <span className="text-sm font-semibold text-gray-500">
          {product.category.nameKo}
        </span>
      </div>

      <div className="px-4">
        <ProductImageFlip
          front={product.imageFront}
          back={product.imageBack}
          alt={product.nameKo}
        />
      </div>

      <div className="mt-4 px-4">
        <div className="flex items-center gap-2 text-xs">
          {product.isNew && (
            <span className="rounded-full bg-danger px-2 py-0.5 font-bold text-white">
              NEW
            </span>
          )}
          <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand-dark">
            제조국 · {product.country.nameKo}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-400">{product.brandKo}</p>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {product.nameKo}
        </h1>
        {product.price != null && (
          <p className="mt-1 text-sm font-semibold text-gray-600">
            참고 가격 {product.price.toLocaleString()}원
          </p>
        )}
      </div>

      {product.issues.length > 0 && (
        <div className="mx-4 mt-4 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle size={18} />
            <span className="text-sm font-bold">제조 안전 주의 정보</span>
          </div>
          {product.issues.map((issue) => (
            <div key={issue.id} className="border-t border-red-200 pt-3 first:border-t-0 first:pt-0">
              <p className="text-sm font-bold text-red-900">{issue.titleKo}</p>
              <p className="mt-1 text-xs leading-relaxed text-red-800">
                {issue.descriptionKo}
              </p>
              <Link
                href={issue.videoUrl}
                target={issue.videoUrl.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-xs font-bold text-white"
              >
                <PlayCircle size={14} />
                제조 공정 영상 보기
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 px-4">
        <RatingWidget
          productId={product.id}
          initialAvg={product.ratingAvg}
          initialCount={product.ratingCount}
        />
      </div>

      <div className="mt-4 px-4">
        <h2 className="mb-2 text-base font-bold text-gray-900">영양성분표</h2>
        <p className="mb-2 text-xs text-gray-500">
          1회 제공량 {product.servingSizeG ?? "-"}g 기준
        </p>
        <div className="overflow-hidden rounded-2xl border border-border">
          {nutritionRows(product).map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                i % 2 === 0 ? "bg-surface" : "bg-background"
              }`}
            >
              <span className="text-gray-600">{row.label}</span>
              <span className="font-semibold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4">
        <h2 className="mb-2 text-base font-bold text-gray-900">원재료명</h2>
        <p className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-gray-700">
          {product.ingredientsKo ?? "정보 없음"}
        </p>
      </div>

      <div className="mt-4 px-4">
        <h2 className="mb-2 text-base font-bold text-gray-900">알레르기 정보</h2>
        <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium leading-relaxed text-red-800">
          {product.allergensKo ?? "정보 없음"}
        </p>
      </div>
    </div>
  );
}
