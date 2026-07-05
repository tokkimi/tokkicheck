import Link from "next/link";
import { AlertTriangle, Star } from "lucide-react";

type CardProduct = {
  id: string;
  nameKo: string;
  brandKo: string;
  imageFront: string;
  calories: number | null;
  isNew: boolean;
  ratingAvg: number;
  ratingCount: number;
  category: { nameKo: string; slug: string };
  country: { nameKo: string; code: string };
  _count: { issues: number };
};

export function ProductCard({ product }: { product: CardProduct }) {
  const hasIssue = product._count.issues > 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-transform active:scale-[0.97]"
    >
      <div className="relative aspect-[3/4] w-full bg-brand-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageFront}
          alt={product.nameKo}
          className="h-full w-full object-contain p-2"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold text-white">
            NEW
          </span>
        )}
        {hasIssue && (
          <span
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-danger shadow"
            title="제조 안전 주의 정보 있음"
          >
            <AlertTriangle size={14} />
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">
          {product.country.nameKo}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-2.5 py-2">
        <span className="truncate text-[11px] text-gray-400">
          {product.brandKo}
        </span>
        <span className="line-clamp-2 min-h-[2.4em] text-[13px] font-bold leading-tight text-gray-900">
          {product.nameKo}
        </span>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-brand-dark">
            {product.calories ?? "-"} kcal
          </span>
          <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {product.ratingAvg.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
