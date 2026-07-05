"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ScanLine, Search, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/categories", label: "카테고리", icon: LayoutGrid },
  { href: "/scan", label: "스캔", icon: ScanLine },
  { href: "/search", label: "검색", icon: Search },
  { href: "/mypage", label: "마이페이지", icon: User },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="톡키체크" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-gray-900">톡키</span>
            <span className="text-[#c9714f]">체크</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 md:flex" aria-label="메뉴">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-soft text-brand-dark"
                      : "text-gray-600 hover:bg-black/5"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
          <Link
            href="/search"
            aria-label="검색"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-black/5 md:hidden"
          >
            <Search size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
