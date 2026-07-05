import { prisma } from "@/lib/prisma";
import {
  addProgramTemplateItem,
  createProgramTemplate,
  deleteProgramTemplate,
  deleteProgramTemplateItem,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const SLOT_LABELS: Record<string, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
  SNACK: "간식",
};

export default async function AdminProgramsPage() {
  const [templates, products] = await Promise.all([
    prisma.mealProgram.findMany({
      where: { isTemplate: true },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: { select: { nameKo: true } } },
          orderBy: [{ dayOfWeek: "asc" }],
        },
      },
    }),
    prisma.product.findMany({ select: { id: true, nameKo: true }, orderBy: { nameKo: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">식단 프로그램 템플릿 관리</h2>

      <div className="flex flex-col gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{t.nameKo}</p>
                {t.descriptionKo && <p className="text-xs text-gray-500">{t.descriptionKo}</p>}
              </div>
              <form action={deleteProgramTemplate}>
                <input type="hidden" name="id" value={t.id} />
                <button className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-danger">
                  템플릿 삭제
                </button>
              </form>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              {t.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5 text-xs"
                >
                  <span>
                    {DAY_LABELS[item.dayOfWeek]}요일 · {SLOT_LABELS[item.mealSlot]} ·{" "}
                    {item.product.nameKo}
                  </span>
                  <form action={deleteProgramTemplateItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="text-danger">삭제</button>
                  </form>
                </div>
              ))}
              {t.items.length === 0 && (
                <p className="text-xs text-gray-400">등록된 식사가 없습니다.</p>
              )}
            </div>

            <form action={addProgramTemplateItem} className="mt-3 grid grid-cols-2 gap-2">
              <input type="hidden" name="programId" value={t.id} />
              <select name="dayOfWeek" defaultValue="0" className="input">
                {DAY_LABELS.map((d, i) => (
                  <option key={d} value={i}>
                    {d}요일
                  </option>
                ))}
              </select>
              <select name="mealSlot" defaultValue="BREAKFAST" className="input">
                {Object.entries(SLOT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select name="productId" required className="input col-span-2">
                <option value="">제품 선택</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameKo}
                  </option>
                ))}
              </select>
              <button className="col-span-2 rounded-xl bg-brand py-2 text-xs font-bold text-white">
                식사 추가
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-bold text-gray-900">새 템플릿 만들기</h3>
        <form action={createProgramTemplate} className="flex flex-col gap-2">
          <input name="nameKo" required placeholder="템플릿 이름 (예: 균형식 1주)" className="input" />
          <textarea name="descriptionKo" rows={2} placeholder="설명 (선택)" className="input" />
          <button className="rounded-xl bg-brand py-2.5 text-sm font-bold text-white">
            템플릿 생성
          </button>
        </form>
      </div>
    </div>
  );
}
