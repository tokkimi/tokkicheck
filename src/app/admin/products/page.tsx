import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ nameKo: { contains: q } }, { brandKo: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true, country: true, _count: { select: { issues: true } } },
    take: 100,
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <form className="flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="제품명/브랜드 검색"
            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </form>
        <Link
          href="/admin/products/new"
          className="shrink-0 rounded-xl bg-brand px-3 py-2 text-sm font-bold text-white"
        >
          + 새 제품
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageFront}
                alt={p.nameKo}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">
                {p.nameKo}{" "}
                {p._count.issues > 0 && (
                  <span className="text-danger">⚠</span>
                )}
              </p>
              <p className="truncate text-xs text-gray-500">
                {p.brandKo} · {p.category.nameKo} · {p.country.nameKo}
              </p>
            </div>
            <Link
              href={`/admin/products/${p.id}`}
              className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-gray-600"
            >
              수정
            </Link>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-danger">
                삭제
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
