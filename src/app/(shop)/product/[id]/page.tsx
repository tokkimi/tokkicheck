import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ChevronLeft, NotebookPen, PlayCircle, ShieldAlert } from "lucide-react";
import { getProductDetail } from "@/lib/queries";
import { CountryFlags } from "@/components/CountryFlag";
import { overlappingAllergens } from "@/lib/allergens";
import { ProductImageFlip } from "@/components/ProductImageFlip";
import { RatingWidget } from "@/components/RatingWidget";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AddToShoppingListButton } from "@/components/AddToShoppingListButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  const [product, session] = await Promise.all([getProductDetail(id), auth()]);
  if (!product) notFound();

  const isFavorited = session?.user?.id
    ? Boolean(
        await prisma.favorite.findUnique({
          where: { userId_productId: { userId: session.user.id, productId: id } },
        })
      )
    : false;

  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { allergenTags: true },
      })
    : null;
  const allergenWarning = overlappingAllergens(product.allergenTags, currentUser?.allergenTags ?? []);

  return (
    <div className="pb-8 md:mx-auto md:max-w-2xl">
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
          <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand-dark">
            제조국
            <CountryFlags
              primaryCode={product.country.code}
              extraCodes={product.originCountryCodes}
              primaryLabel={product.country.nameKo}
              flagClassName="h-3 w-4"
            />
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/search?q=${encodeURIComponent(product.brandKo)}`}
              className="mt-2 inline-block text-sm text-gray-400 underline-offset-2 hover:underline"
            >
              {product.brandKo}
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {product.nameKo}
            </h1>
          </div>
          <FavoriteButton
            productId={product.id}
            initialFavorited={isFavorited}
            size={20}
            className="mt-2 h-10 w-10 shrink-0 border border-border bg-surface shadow-sm"
          />
        </div>
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

      <div className="mt-3 flex gap-2 px-4">
        <div className="flex-1">
          <AddToShoppingListButton productId={product.id} />
        </div>
        <Link
          href={`/mypage/symptoms?productId=${product.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-surface py-2.5 text-xs font-semibold text-gray-600"
        >
          <NotebookPen size={14} />
          증상 기록하기
        </Link>
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

      {allergenWarning.length > 0 && (
        <div className="mx-4 mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              내 알레르기 설정과 일치하는 성분이 있어요
            </p>
            <p className="mt-0.5 text-xs text-amber-700">{allergenWarning.join(", ")}</p>
          </div>
        </div>
      )}

      <div className="mt-4 px-4">
        <h2 className="mb-2 text-base font-bold text-gray-900">알레르기 정보</h2>
        <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium leading-relaxed text-red-800">
          {product.allergensKo ?? "정보 없음"}
        </p>
      </div>
    </div>
  );
}
