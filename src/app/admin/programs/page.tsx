import { prisma } from "@/lib/prisma";
import {
  addProgramTemplateItem,
  createProgramTemplate,
  deleteProgramTemplate,
  deleteProgramTemplateItem,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const SLOT_LABELS: Record<string, string> = {
  BREAKFAST: "Petit-déjeuner",
  LUNCH: "Déjeuner",
  DINNER: "Dîner",
  SNACK: "Collation",
};

export default async function AdminProgramsPage() {
  const [templates, products] = await Promise.all([
    prisma.mealProgram.findMany({
      where: { isTemplate: true },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: { select: { nameKo: true } } },
          orderBy: [{ dayOfWeek: "asc" }],
        },
      },
    }),
    prisma.product.findMany({ select: { id: true, nameKo: true }, orderBy: { nameKo: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">Modèles de programmes repas</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {templates.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{t.nameKo}</p>
                {t.descriptionKo && <p className="text-xs text-gray-500">{t.descriptionKo}</p>}
              </div>
              <form action={deleteProgramTemplate}>
                <input type="hidden" name="id" value={t.id} />
                <button className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-danger">
                  Supprimer le modèle
                </button>
              </form>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              {t.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5 text-xs"
                >
                  <span>
                    {DAY_LABELS[item.dayOfWeek]} · {SLOT_LABELS[item.mealSlot]} ·{" "}
                    {item.product.nameKo}
                  </span>
                  <form action={deleteProgramTemplateItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="text-danger">Supprimer</button>
                  </form>
                </div>
              ))}
              {t.items.length === 0 && (
                <p className="text-xs text-gray-400">Aucun repas enregistré.</p>
              )}
            </div>

            <form action={addProgramTemplateItem} className="mt-3 grid grid-cols-2 gap-2">
              <input type="hidden" name="programId" value={t.id} />
              <select name="dayOfWeek" defaultValue="0" className="input">
                {DAY_LABELS.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}
              </select>
              <select name="mealSlot" defaultValue="BREAKFAST" className="input">
                {Object.entries(SLOT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select name="productId" required className="input col-span-2">
                <option value="">Choisir un produit</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameKo}
                  </option>
                ))}
              </select>
              <button className="col-span-2 rounded-xl bg-brand py-2 text-xs font-bold text-white">
                Ajouter le repas
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-bold text-gray-900">Créer un nouveau modèle</h3>
        <form action={createProgramTemplate} className="flex flex-col gap-2">
          <input name="nameKo" required placeholder="Nom du modèle (ex : équilibré sur 1 semaine)" className="input" />
          <textarea name="descriptionKo" rows={2} placeholder="Description (optionnel)" className="input" />
          <button className="rounded-xl bg-brand py-2.5 text-sm font-bold text-white">
            Créer le modèle
          </button>
        </form>
      </div>
    </div>
  );
}
