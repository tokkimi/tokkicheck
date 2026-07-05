import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, pendingRequests, pendingAi, users, issues] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.productRequest.count({ where: { status: "PENDING" } }),
      prisma.aiDiscoveredProduct.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.manufacturingIssue.count(),
    ]);

  const cards = [
    { label: "전체 제품", value: products, href: "/admin/products" },
    { label: "카테고리", value: categories, href: "/admin/categories" },
    {
      label: "대기중인 등록 요청",
      value: pendingRequests,
      href: "/admin/requests",
      highlight: pendingRequests > 0,
    },
    {
      label: "AI 신상품 검수 대기",
      value: pendingAi,
      href: "/admin/ai-queue",
      highlight: pendingAi > 0,
    },
    { label: "전체 사용자", value: users, href: "/admin/users" },
    { label: "제조 안전 이슈", value: issues, href: "/admin/issues" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className={`rounded-2xl border p-4 shadow-sm ${
            c.highlight
              ? "border-danger/30 bg-red-50"
              : "border-border bg-surface"
          }`}
        >
          <p className="text-xs text-gray-500">{c.label}</p>
          <p
            className={`mt-1 text-2xl font-extrabold ${
              c.highlight ? "text-danger" : "text-gray-900"
            }`}
          >
            {c.value}
          </p>
        </Link>
      ))}
    </div>
  );
}
