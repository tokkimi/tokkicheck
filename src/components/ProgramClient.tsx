"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { ProductSearchPicker, type PickerProduct } from "@/components/ProductSearchPicker";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const SLOTS: { key: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"; label: string }[] = [
  { key: "BREAKFAST", label: "아침" },
  { key: "LUNCH", label: "점심" },
  { key: "DINNER", label: "저녁" },
  { key: "SNACK", label: "간식" },
];

type Product = { id: string; nameKo: string; imageFront: string };
type Item = { id: string; dayOfWeek: number; mealSlot: string; product: Product };
type Template = { id: string; nameKo: string; descriptionKo: string | null; items: Item[] };

export function ProgramClient({
  templates,
  initialProgram,
}: {
  templates: Template[];
  initialProgram: { id: string; nameKo: string; items: Item[] } | null;
}) {
  const router = useRouter();
  const [program, setProgram] = useState(initialProgram);
  const [activeDay, setActiveDay] = useState(0);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const itemsForDay = useMemo(
    () => (program?.items ?? []).filter((i) => i.dayOfWeek === activeDay),
    [program, activeDay]
  );

  async function adopt(templateId: string) {
    const res = await fetch("/api/programs/adopt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId }),
    });
    if (res.ok) {
      router.refresh();
      setMessage("템플릿을 내 프로그램으로 가져왔어요.");
    }
  }

  async function addItem(product: PickerProduct) {
    if (!pickerSlot) return;
    const res = await fetch("/api/programs/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, dayOfWeek: activeDay, mealSlot: pickerSlot }),
    });
    if (res.ok) {
      const data = await res.json();
      setProgram((prev) => {
        const base = prev ?? { id: data.programId, nameKo: "내 식단 프로그램", items: [] };
        return {
          ...base,
          items: [
            ...base.items,
            { id: data.id, dayOfWeek: activeDay, mealSlot: pickerSlot, product },
          ],
        };
      });
    }
    setPickerSlot(null);
  }

  async function removeItem(id: string) {
    setProgram((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : prev));
    await fetch(`/api/programs/items/${id}`, { method: "DELETE" });
  }

  async function addAllToCart() {
    const res = await fetch("/api/programs/add-to-cart", { method: "POST" });
    const data = await res.json();
    setMessage(res.ok ? `장바구니에 ${data.added}개 제품을 담았어요.` : data.error);
  }

  return (
    <div>
      {templates.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold text-gray-500">템플릿 둘러보기</p>
          <div className="flex flex-col gap-2">
            {templates.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-surface p-3">
                <p className="text-sm font-bold text-gray-900">{t.nameKo}</p>
                {t.descriptionKo && <p className="text-xs text-gray-500">{t.descriptionKo}</p>}
                <p className="mt-1 text-[11px] text-gray-400">{t.items.length}개 식사 구성</p>
                <button
                  onClick={() => adopt(t.id)}
                  className="mt-2 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white"
                >
                  이 템플릿 채택하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900">{program?.nameKo ?? "내 식단 프로그램"}</p>
        {program && program.items.length > 0 && (
          <button
            onClick={addAllToCart}
            className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-dark"
          >
            <ShoppingCart size={12} />
            전체 장바구니 담기
          </button>
        )}
      </div>
      {message && <p className="mt-1 text-xs text-brand-dark">{message}</p>}

      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
        {DAYS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${
              activeDay === i ? "bg-brand text-white" : "bg-surface text-gray-500 border border-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {SLOTS.map((slot) => {
          const item = itemsForDay.find((i) => i.mealSlot === slot.key);
          return (
            <div key={slot.key} className="rounded-2xl border border-border bg-surface p-3">
              <p className="mb-2 text-xs font-bold text-gray-500">{slot.label}</p>
              {item ? (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.imageFront} alt={item.product.nameKo} className="h-full w-full object-contain" />
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
                    {item.product.nameKo}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5"
                    aria-label="삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : pickerSlot === slot.key ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">제품 선택</span>
                    <button onClick={() => setPickerSlot(null)} aria-label="닫기">
                      <X size={14} />
                    </button>
                  </div>
                  <ProductSearchPicker onSelect={addItem} />
                </div>
              ) : (
                <button
                  onClick={() => setPickerSlot(slot.key)}
                  className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-border py-2 text-xs text-gray-400"
                >
                  <Plus size={14} />
                  제품 추가
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
