import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShieldAlert,
  Inbox,
  Sparkles,
  CalendarDays,
  Users,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/lib/authz";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const tabs = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: Layers },
  { href: "/admin/issues", label: "Sécurité sanitaire", icon: ShieldAlert },
  { href: "/admin/requests", label: "Demandes d'ajout", icon: Inbox },
  { href: "/admin/ai-queue", label: "Nouveautés IA", icon: Sparkles },
  { href: "/admin/programs", label: "Programmes repas", icon: CalendarDays },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-dvh md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-semibold text-brand-dark">Administration</p>
          <h1 className="text-lg font-extrabold text-gray-900">톡키체크 back-office</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-brand-soft hover:text-brand-dark"
            >
              <t.icon size={17} />
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-black/5"
          >
            <ExternalLink size={14} />
            Voir le site public
          </Link>
          <AdminLogoutButton className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-black/5" />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-dvh flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
          <div>
            <p className="text-xs font-semibold text-brand-dark">Administration</p>
            <h1 className="text-lg font-extrabold text-gray-900">톡키체크 back-office</h1>
          </div>
          <AdminLogoutButton />
        </div>
        {/* Mobile tab strip */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2 md:hidden">
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
        {/* Desktop header */}
        <div className="hidden items-center justify-between border-b border-border bg-surface px-8 py-4 md:flex">
          <p className="text-sm font-semibold text-gray-500">
            Panneau d&apos;administration
          </p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-dark"
          >
            <ExternalLink size={14} />
            Voir le site public
          </Link>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
