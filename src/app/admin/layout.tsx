import Link from "next/link";
import { requireAdmin } from "@/lib/authz";

const tabs = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/products", label: "제품" },
  { href: "/admin/categories", label: "카테고리" },
  { href: "/admin/issues", label: "제조 안전" },
  { href: "/admin/requests", label: "등록 요청" },
  { href: "/admin/ai-queue", label: "AI 신상품" },
  { href: "/admin/users", label: "사용자" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-surface px-4 py-3">
        <p className="text-xs font-semibold text-brand-dark">관리자 페이지</p>
        <h1 className="text-lg font-extrabold text-gray-900">톡키체크 백오피스</h1>
      </div>
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-brand-soft hover:text-brand-dark"
          >
            {t.label}
          </Link>
        ))}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}
