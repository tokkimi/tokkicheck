"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ScanLine, Search, User } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/categories", label: "카테고리", icon: LayoutGrid },
  { href: "/scan", label: "스캔", icon: ScanLine, elevated: true },
  { href: "/search", label: "검색", icon: Search },
  { href: "/mypage", label: "마이페이지", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="하단 메뉴"
    >
      <ul className="grid grid-cols-5 items-end">
        {navItems.map(({ href, label, icon: Icon, elevated }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex justify-center">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 text-[11px] font-medium transition-colors ${
                  active ? "text-brand" : "text-gray-500"
                }`}
              >
                {elevated ? (
                  <span
                    className={`-mt-6 flex h-13 w-13 items-center justify-center rounded-full shadow-lg ring-4 ring-surface ${
                      active ? "bg-brand-dark" : "bg-brand"
                    }`}
                    style={{ height: "3.25rem", width: "3.25rem" }}
                  >
                    <Icon size={24} className="text-white" strokeWidth={2.2} />
                  </span>
                ) : (
                  <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                )}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
