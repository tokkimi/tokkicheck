"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

type SearchProduct = Parameters<typeof ProductCard>[0]["product"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!trimmedQuery) {
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
      const data = await res.json();
      setResults(data.results);
      setLoading(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trimmedQuery]);

  const visibleResults = trimmedQuery ? results : [];

  return (
    <div className="px-4 py-4">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setLoading(true);
          }}
          placeholder="제품명 또는 브랜드로 검색"
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-10 pr-9 text-sm outline-none focus:border-brand"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="지우기"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-4">
        {loading && <p className="text-center text-sm text-gray-400">검색 중...</p>}
        {!loading && trimmedQuery && visibleResults.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            검색 결과가 없습니다. 제품 등록을 요청해보세요.
          </p>
        )}
        {!loading && visibleResults.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleResults.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
