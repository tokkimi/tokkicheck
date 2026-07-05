"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export type PickerProduct = {
  id: string;
  nameKo: string;
  brandKo: string;
  imageFront: string;
  calories: number | null;
};

export function ProductSearchPicker({
  onSelect,
  placeholder = "제품명 검색",
}: {
  onSelect: (product: PickerProduct) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PickerProduct[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.results);
    setSearching(false);
  }

  return (
    <div>
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:border-brand"
        />
      </div>
      <div className="mt-2 flex max-h-56 flex-col gap-1 overflow-y-auto">
        {searching && <p className="py-2 text-center text-xs text-gray-400">검색 중...</p>}
        {results.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="flex items-center gap-2 rounded-xl px-2 py-2 text-left hover:bg-background"
          >
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageFront} alt={p.nameKo} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-gray-900">{p.nameKo}</p>
              <p className="text-[11px] text-gray-500">{p.brandKo}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
