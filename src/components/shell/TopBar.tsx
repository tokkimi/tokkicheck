import Link from "next/link";
import { Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl">🐰</span>
          <span className="text-lg font-extrabold tracking-tight text-brand-dark">
            톡키체크
          </span>
        </Link>
        <Link
          href="/search"
          aria-label="검색"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-black/5"
        >
          <Search size={20} />
        </Link>
      </div>
    </header>
  );
}
