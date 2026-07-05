"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { ProductSearchPicker, type PickerProduct } from "@/components/ProductSearchPicker";

type Product = PickerProduct;

type Entry = {
  id: string;
  quantity: number;
  calories: number;
  loggedAt: string;
  product: Product;
};

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateKo(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

export function DiaryClient({
  date,
  initialEntries,
  calorieGoal,
}: {
  date: string;
  initialEntries: Entry[];
  calorieGoal: number;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(() => entries.reduce((sum, e) => sum + e.calories, 0), [entries]);
  const ratio = Math.min(100, Math.round((total / calorieGoal) * 100));

  function goToDate(nextDate: string) {
    router.push(`/mypage/diary?date=${nextDate}`);
  }

  async function confirmAdd() {
    if (!selected) return;
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selected.id, quantity, date }),
    });
    if (res.ok) {
      const data = await res.json();
      setEntries((prev) => [
        ...prev,
        {
          id: data.id,
          quantity,
          calories: Math.round((selected.calories ?? 0) * quantity),
          loggedAt: new Date().toISOString(),
          product: selected,
        },
      ]);
      setAdding(false);
      setSelected(null);
      setQuantity(1);
    }
  }

  async function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/diary/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => goToDate(shiftDate(date, -1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
          aria-label="이전 날짜"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-gray-800">{formatDateKo(date)}</span>
        <button
          onClick={() => goToDate(shiftDate(date, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
          aria-label="다음 날짜"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-extrabold text-gray-900">{total}</span>
          <span className="text-xs text-gray-500">목표 {calorieGoal} kcal</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background">
          <div
            className={`h-full rounded-full ${ratio >= 100 ? "bg-danger" : "bg-brand"}`}
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            이 날짜에 기록된 식사가 없어요.
          </p>
        )}
        {entries.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2.5"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={e.product.imageFront}
                alt={e.product.nameKo}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">{e.product.nameKo}</p>
              <p className="text-xs text-gray-500">
                {e.quantity}인분 · {e.calories} kcal
              </p>
            </div>
            <button
              onClick={() => removeEntry(e.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5"
              aria-label="삭제"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-gray-500"
        >
          <Plus size={16} />
          식사 추가하기
        </button>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">식사 추가</p>
            <button onClick={() => setAdding(false)} aria-label="닫기">
              <X size={16} />
            </button>
          </div>

          {!selected ? (
            <div className="mt-2">
              <ProductSearchPicker onSelect={setSelected} />
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.imageFront} alt={selected.nameKo} className="h-full w-full object-contain" />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-bold text-gray-900">
                  {selected.nameKo}
                </p>
                <button onClick={() => setSelected(null)} className="text-xs text-gray-400 underline">
                  변경
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">인분 수</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(0.5, q - 0.5))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 0.5)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="mt-1 text-right text-xs text-gray-500">
                {Math.round((selected.calories ?? 0) * quantity)} kcal
              </p>
              <button
                onClick={confirmAdd}
                className="mt-3 w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white"
              >
                추가하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
