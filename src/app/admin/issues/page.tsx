import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createIssue, deleteIssue } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  const [issues, countries] = await Promise.all([
    prisma.manufacturingIssue.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true, country: true },
    }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-gray-900">Sécurité sanitaire</h2>
      <p className="mb-3 text-xs text-gray-500">
        Enregistrez une alerte pour un produit précis ou pour l&apos;ensemble d&apos;un
        pays de fabrication. L&apos;enregistrement par produit est aussi possible
        depuis la fiche de modification du produit.
      </p>

      <div className="flex flex-col gap-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-2xl border border-red-200 bg-red-50 p-3"
          >
            <p className="text-sm font-bold text-red-900">{issue.titleKo}</p>
            <p className="mt-1 text-xs text-red-800">{issue.descriptionKo}</p>
            <p className="mt-1 text-xs text-gray-500">
              Cible :{" "}
              {issue.product ? (
                <Link href={`/admin/products/${issue.product.id}`} className="underline">
                  {issue.product.nameKo}
                </Link>
              ) : issue.country ? (
                `${issue.country.nameKo} (tous les produits)`
              ) : (
                "Non spécifié"
              )}
              {" · "}Gravité {issue.severity}
            </p>
            <form action={deleteIssue} className="mt-2">
              <input type="hidden" name="id" value={issue.id} />
              <button className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-danger">
                Supprimer
              </button>
            </form>
          </div>
        ))}
        {issues.length === 0 && (
          <p className="text-xs text-gray-400">Aucune alerte enregistrée.</p>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-bold text-gray-900">
          Alerte pour un pays de fabrication entier
        </h3>
        <form action={createIssue} className="flex flex-col gap-2">
          <select name="countryId" required className="input">
            <option value="">Choisir un pays</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameKo}
              </option>
            ))}
          </select>
          <input name="titleKo" required placeholder="Titre de l'alerte" className="input" />
          <textarea name="descriptionKo" required rows={2} placeholder="Description détaillée" className="input" />
          <input name="videoUrl" required placeholder="URL de la vidéo ou chemin interne" className="input" />
          <input name="sourceUrl" placeholder="URL de la source (optionnel)" className="input" />
          <select name="severity" defaultValue="1" className="input">
            <option value="1">Mineur</option>
            <option value="2">Attention</option>
            <option value="3">Grave</option>
          </select>
          <button className="rounded-xl bg-danger py-2.5 text-sm font-bold text-white">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
