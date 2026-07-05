import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rejectProductRequest } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Refusée",
};

export default async function AdminRequestsPage() {
  const requests = await prisma.productRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">
        Demandes d&apos;ajout de produit
      </h2>
      <div className="flex flex-col gap-2">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{r.nameKo}</p>
                <p className="truncate text-xs text-gray-500">
                  {r.brandKo} · {r.countryNameKo ?? "Pays inconnu"} · demandé par{" "}
                  {r.user.name}
                </p>
                {r.note && <p className="mt-1 text-xs text-gray-600">{r.note}</p>}
              </div>
              <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                {statusLabel[r.status]}
              </span>
            </div>
            {r.imageFront && (
              <div className="mt-2 flex gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.imageFront} alt="Face" className="h-16 w-16 rounded-lg object-cover" />
                {r.imageBack && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageBack} alt="Dos" className="h-16 w-16 rounded-lg object-cover" />
                )}
              </div>
            )}
            {r.status === "PENDING" && (
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href={`/admin/requests/${r.id}/approve`}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white"
                >
                  Traiter et approuver
                </Link>
                <form action={rejectProductRequest} className="flex-1">
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-danger">
                    Refuser
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-xs text-gray-400">Aucune demande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
