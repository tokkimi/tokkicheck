import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rejectAiProduct, runAiScanNow } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "À valider",
  APPROVED: "Publié",
  REJECTED: "Refusé",
};

export default async function AdminAiQueuePage() {
  const items = await prisma.aiDiscoveredProduct.findMany({
    orderBy: { discoveredAt: "desc" },
  });

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-gray-900">
          File des nouveautés découvertes par l&apos;IA
        </h2>
        <form action={runAiScanNow}>
          <button className="rounded-full bg-brand-dark px-3 py-1.5 text-xs font-bold text-white">
            Lancer le scan maintenant
          </button>
        </form>
      </div>
      <p className="mb-3 text-xs text-gray-500">
        Chaque vendredi, un scan automatique repère les nouveaux produits en
        supérette. Vérifiez-les avant de les publier.
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {item.nameKo}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {item.brandKo} · {item.sourceStore ?? "Source inconnue"} ·{" "}
                  {item.countryNameKo ?? "Pays inconnu"}
                </p>
                {item.rawNote && (
                  <p className="mt-1 text-xs text-gray-600">{item.rawNote}</p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                {statusLabel[item.status]}
              </span>
            </div>
            {item.status === "PENDING" && (
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href={`/admin/ai-queue/${item.id}/approve`}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white"
                >
                  Vérifier et publier
                </Link>
                <form action={rejectAiProduct} className="flex-1">
                  <input type="hidden" name="id" value={item.id} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-danger">
                    Refuser
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400">Aucune nouveauté détectée pour le moment.</p>
        )}
      </div>
    </div>
  );
}
