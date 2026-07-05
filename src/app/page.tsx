import Link from "next/link";
import { AlertTriangle, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ScrollRow } from "@/components/ScrollRow";
import { SectionHeader } from "@/components/SectionHeader";
import { auth } from "@/auth";
import {
  getCategories,
  getFlaggedProducts,
  getNewArrivals,
  getTopRanked,
  enrichProductsForUser,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const [categories, newArrivalsRaw, topRankedRaw, flaggedRaw] = await Promise.all([
    getCategories(),
    getNewArrivals(),
    getTopRanked(),
    getFlaggedProducts(),
  ]);
  const [newArrivals, topRanked, flagged] = await Promise.all([
    enrichProductsForUser(newArrivalsRaw, session?.user?.id),
    enrichProductsForUser(topRankedRaw, session?.user?.id),
    enrichProductsForUser(flaggedRaw, session?.user?.id),
  ]);

  return (
    <div className="flex flex-col gap-6 pb-6 pt-4">
      <div className="px-4">
        <p className="text-sm text-gray-500">
          대한민국 판매 식품, 성분부터 제조 안전까지
        </p>
        <h1 className="mt-0.5 text-xl font-extrabold text-gray-900">
          오늘 먹은 제품, 안전할까요? 🐰
        </h1>
        <Link
          href="/search"
          className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-gray-400 shadow-sm"
        >
          <Search size={17} />
          제품명 또는 브랜드로 검색
        </Link>
      </div>

      <section>
        <SectionHeader title="카테고리" href="/categories" />
        <ScrollRow>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-border bg-surface py-3 text-center shadow-sm"
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[11px] font-semibold text-gray-700">
                {c.nameKo}
              </span>
            </Link>
          ))}
        </ScrollRow>
      </section>

      <section>
        <SectionHeader
          title="🆕 신상품"
          subtitle="이번 주 새로 등록된 제품"
          href="/categories?filter=new"
        />
        <ScrollRow>
          {newArrivals.map((p) => (
            <div key={p.id} className="w-36 shrink-0 sm:w-40">
              <ProductCard product={p} />
            </div>
          ))}
        </ScrollRow>
      </section>

      {flagged.length > 0 && (
        <section>
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-danger">
            <AlertTriangle size={16} />
            <p className="text-xs font-semibold">
              제조 안전 주의가 접수된 제품이 있어요. 꼭 확인하세요.
            </p>
          </div>
          <ScrollRow>
            {flagged.map((p) => (
              <div key={p.id} className="w-36 shrink-0 sm:w-40">
                <ProductCard product={p} />
              </div>
            ))}
          </ScrollRow>
        </section>
      )}

      <section>
        <SectionHeader title="🏆 인기 랭킹" subtitle="사용자 평점 기준" />
        <div className="flex flex-col gap-2 px-4">
          {topRanked.slice(0, 6).map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2 shadow-sm"
            >
              <span className="w-6 shrink-0 text-center text-base font-extrabold text-brand-dark">
                {i + 1}
              </span>
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageFront}
                  alt={p.nameKo}
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900">
                  {p.nameKo}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {p.brandKo} · {p.category.nameKo}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-gray-500">
                ★ {p.ratingAvg.toFixed(1)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
