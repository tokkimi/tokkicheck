import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createIssue, deleteIssue, updateProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

const severityLabel: Record<number, string> = {
  1: "Mineur",
  2: "Attention",
  3: "Grave",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, countries] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { issues: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">Modifier le produit</h2>
      <ProductForm
        action={updateProduct}
        categories={categories}
        countries={countries}
        product={product}
        submitLabel="Enregistrer"
      />

      <div className="mt-8 border-t border-border pt-5">
        <h3 className="mb-3 text-sm font-bold text-danger">
          Gestion des alertes de sécurité sanitaire
        </h3>

        <div className="mb-4 flex flex-col gap-2">
          {product.issues.length === 0 && (
            <p className="text-xs text-gray-400">Aucune alerte enregistrée.</p>
          )}
          {product.issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-bold text-red-900">{issue.titleKo}</p>
              <p className="mt-1 text-xs text-red-800">{issue.descriptionKo}</p>
              <p className="mt-1 text-xs text-gray-500">
                Vidéo : {issue.videoUrl} · {severityLabel[issue.severity] ?? issue.severity}
              </p>
              <form action={deleteIssue} className="mt-2">
                <input type="hidden" name="id" value={issue.id} />
                <button className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-danger">
                  Supprimer
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={createIssue} className="flex flex-col gap-2">
          <input type="hidden" name="productId" value={product.id} />
          <input
            name="titleKo"
            required
            placeholder="Titre de l'alerte (ex : procédé de fabrication non hygiénique signalé)"
            className="input"
          />
          <textarea
            name="descriptionKo"
            required
            rows={2}
            placeholder="Description détaillée"
            className="input"
          />
          <input
            name="videoUrl"
            required
            placeholder="URL de la vidéo (YouTube, etc.) ou chemin interne"
            className="input"
          />
          <input
            name="sourceUrl"
            placeholder="URL de la source (optionnel)"
            className="input"
          />
          <select name="severity" defaultValue="1" className="input">
            <option value="1">Mineur</option>
            <option value="2">Attention</option>
            <option value="3">Grave</option>
          </select>
          <button className="rounded-xl bg-danger py-2.5 text-sm font-bold text-white">
            Enregistrer l&apos;alerte
          </button>
        </form>
      </div>
    </div>
  );
}
