"use client";

import { useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { ProductSearchPicker } from "@/components/ProductSearchPicker";

type Item = {
  id: string;
  checked: boolean;
  customName: string | null;
  product: { id: string; nameKo: string; imageFront: string } | null;
};

export function ShoppingListClient({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [adding, setAdding] = useState(false);
  const [customText, setCustomText] = useState("");

  async function toggle(id: string, checked: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked } : i)));
    await fetch(`/api/shopping-list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked }),
    });
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/shopping-list/${id}`, { method: "DELETE" });
  }

  async function addProduct(product: { id: string; nameKo: string; imageFront: string }) {
    const res = await fetch("/api/shopping-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    const data = await res.json();
    if (res.ok && !data.duplicate) {
      setItems((prev) => [
        { id: data.id, checked: false, customName: null, product },
        ...prev,
      ]);
    }
    setAdding(false);
  }

  async function addCustom() {
    if (!customText.trim()) return;
    const res = await fetch("/api/shopping-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customName: customText.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems((prev) => [
        { id: data.id, checked: false, customName: customText.trim(), product: null },
        ...prev,
      ]);
    }
    setCustomText("");
    setAdding(false);
  }

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <div>
      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-gray-500"
        >
          <Plus size={16} />
          항목 추가
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-border bg-surface p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">항목 추가</p>
            <button onClick={() => setAdding(false)} aria-label="닫기">
              <X size={16} />
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="직접 입력 (예: 우유 1L)"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              onClick={addCustom}
              className="rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white"
            >
              추가
            </button>
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-2 text-xs text-gray-500">또는 제품 검색</p>
            <ProductSearchPicker onSelect={addProduct} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            장바구니가 비어있어요. 즐겨찾기 제품이나 직접 입력으로 담아보세요.
          </p>
        )}
        {unchecked.map((item) => (
          <ShoppingRow key={item.id} item={item} onToggle={toggle} onRemove={remove} />
        ))}
        {checked.length > 0 && (
          <>
            <p className="mt-2 text-xs font-semibold text-gray-400">담은 항목</p>
            {checked.map((item) => (
              <ShoppingRow key={item.id} item={item} onToggle={toggle} onRemove={remove} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ShoppingRow({
  item,
  onToggle,
  onRemove,
}: {
  item: Item;
  onToggle: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
}) {
  const label = item.product?.nameKo ?? item.customName ?? "";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2.5">
      <button
        onClick={() => onToggle(item.id, !item.checked)}
        aria-label={item.checked ? "완료 취소" : "완료 표시"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          item.checked ? "border-brand bg-brand text-white" : "border-border text-transparent"
        }`}
      >
        <Check size={13} />
      </button>
      {item.product && (
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.product.imageFront} alt={label} className="h-full w-full object-contain" />
        </div>
      )}
      <p className={`min-w-0 flex-1 truncate text-sm font-semibold ${item.checked ? "text-gray-400 line-through" : "text-gray-900"}`}>
        {label}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5"
        aria-label="삭제"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
