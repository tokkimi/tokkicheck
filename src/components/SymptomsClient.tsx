"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { ProductSearchPicker, type PickerProduct } from "@/components/ProductSearchPicker";

type Note = {
  id: string;
  note: string;
  severity: number;
  createdAt: string;
  product: { id: string; nameKo: string; imageFront: string };
};

const severityLabel: Record<number, { text: string; className: string }> = {
  1: { text: "가벼움", className: "bg-emerald-100 text-emerald-700" },
  2: { text: "보통", className: "bg-amber-100 text-amber-700" },
  3: { text: "심함", className: "bg-red-100 text-red-700" },
};

export function SymptomsClient({
  initialNotes,
  preselected,
}: {
  initialNotes: Note[];
  preselected: PickerProduct | null;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [adding, setAdding] = useState(Boolean(preselected));
  const [selected, setSelected] = useState<PickerProduct | null>(preselected);
  const [note, setNote] = useState("");
  const [severity, setSeverity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!selected || !note.trim()) return;
    setError(null);
    const res = await fetch("/api/symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selected.id, note, severity }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "등록에 실패했습니다.");
      return;
    }
    setNotes((prev) => [
      {
        id: data.id,
        note,
        severity,
        createdAt: new Date().toISOString(),
        product: selected,
      },
      ...prev,
    ]);
    setAdding(false);
    setSelected(null);
    setNote("");
    setSeverity(1);
  }

  async function remove(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/symptoms/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-gray-500"
        >
          <Plus size={16} />
          증상 기록 추가
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-border bg-surface p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">증상 기록</p>
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
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="어떤 증상이 있었나요? (예: 먹고 30분 뒤 두드러기)"
                className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <div className="mt-2 flex gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`flex-1 rounded-xl border py-1.5 text-xs font-semibold ${
                      severity === s
                        ? "border-brand bg-brand-soft text-brand-dark"
                        : "border-border text-gray-500"
                    }`}
                  >
                    {severityLabel[s].text}
                  </button>
                ))}
              </div>
              {error && <p className="mt-2 text-xs text-danger">{error}</p>}
              <button
                onClick={submit}
                disabled={!note.trim()}
                className="mt-3 w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                기록하기
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {notes.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            아직 기록된 증상이 없습니다.
          </p>
        )}
        {notes.map((n) => (
          <div key={n.id} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.product.imageFront} alt={n.product.nameKo} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-gray-900">{n.product.nameKo}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${severityLabel[n.severity].className}`}>
                    {severityLabel[n.severity].text}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{n.note}</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <button
                onClick={() => remove(n.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5"
                aria-label="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
