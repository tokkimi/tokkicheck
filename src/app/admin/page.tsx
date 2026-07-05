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
    { label: "Produits au total", value: products, href: "/admin/products" },
    { label: "Catégories", value: categories, href: "/admin/categories" },
    {
      label: "Demandes en attente",
      value: pendingRequests,
      href: "/admin/requests",
      highlight: pendingRequests > 0,
    },
    {
      label: "Nouveautés IA à valider",
      value: pendingAi,
      href: "/admin/ai-queue",
      highlight: pendingAi > 0,
    },
    { label: "Utilisateurs au total", value: users, href: "/admin/users" },
    { label: "Alertes sécurité sanitaire", value: issues, href: "/admin/issues" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Vue d&apos;ensemble</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
    </div>
  );
}
