import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory, updateCategory } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">Gestion des catégories</h2>

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <form
            key={c.id}
            action={updateCategory}
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-2"
          >
            <input type="hidden" name="id" value={c.id} />
            <input
              name="icon"
              defaultValue={c.icon ?? ""}
              className="input w-14 text-center"
            />
            <input
              name="nameKo"
              defaultValue={c.nameKo}
              className="input min-w-[8rem] flex-1"
            />
            <input
              name="order"
              type="number"
              defaultValue={c.order}
              className="input w-16"
            />
            <span className="shrink-0 text-xs text-gray-400">
              {c._count.products} produit(s)
            </span>
            <button className="shrink-0 rounded-lg border border-border px-2 py-1.5 text-xs font-semibold">
              Enregistrer
            </button>
            <button
              formAction={deleteCategory}
              className="shrink-0 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-danger"
            >
              Supprimer
            </button>
          </form>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-bold text-gray-900">Nouvelle catégorie</h3>
        <form action={createCategory} className="flex flex-col gap-2">
          <input name="slug" required placeholder="slug (ex : snack)" className="input" />
          <input name="nameKo" required placeholder="Nom (ex : 스낵·과자)" className="input" />
          <input name="icon" placeholder="Icône emoji (ex : 🍪)" className="input" />
          <input name="order" type="number" defaultValue={0} placeholder="Ordre d'affichage" className="input" />
          <button className="rounded-xl bg-brand py-2.5 text-sm font-bold text-white">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
