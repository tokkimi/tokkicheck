import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory, updateCategory } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">카테고리 관리</h2>

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <form
            key={c.id}
            action={updateCategory}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-2"
          >
            <input type="hidden" name="id" value={c.id} />
            <input
              name="icon"
              defaultValue={c.icon ?? ""}
              className="input w-14 text-center"
            />
            <input
              name="nameKo"
              defaultValue={c.nameKo}
              className="input flex-1"
            />
            <input
              name="order"
              type="number"
              defaultValue={c.order}
              className="input w-16"
            />
            <span className="shrink-0 text-xs text-gray-400">
              {c._count.products}개
            </span>
            <button className="shrink-0 rounded-lg border border-border px-2 py-1.5 text-xs font-semibold">
              저장
            </button>
            <button
              formAction={deleteCategory}
              className="shrink-0 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-danger"
            >
              삭제
            </button>
          </form>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-bold text-gray-900">새 카테고리</h3>
        <form action={createCategory} className="flex flex-col gap-2">
          <input name="slug" required placeholder="slug (예: snack)" className="input" />
          <input name="nameKo" required placeholder="이름 (예: 스낵·과자)" className="input" />
          <input name="icon" placeholder="아이콘 이모지 (예: 🍪)" className="input" />
          <input name="order" type="number" defaultValue={0} placeholder="정렬 순서" className="input" />
          <button className="rounded-xl bg-brand py-2.5 text-sm font-bold text-white">
            추가
          </button>
        </form>
      </div>
    </div>
  );
}
