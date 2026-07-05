import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteUser, updateUser } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { requests: true, ratings: true } } },
  });

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">Gestion des utilisateurs</h2>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {users.map((u) => {
          const isSelf = u.id === session?.user.id;
          return (
            <form
              key={u.id}
              action={updateUser}
              className="rounded-2xl border border-border bg-surface p-3"
            >
              <input type="hidden" name="id" value={u.id} />
              <div className="flex items-center justify-between gap-2">
                <input
                  name="name"
                  defaultValue={u.name}
                  disabled={isSelf}
                  className="input flex-1"
                />
                <select
                  name="role"
                  defaultValue={u.role}
                  disabled={isSelf}
                  className="input w-32"
                >
                  <option value="USER">Utilisateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {u.email} · {u._count.requests} demande(s) · {u._count.ratings} avis
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-0.5 text-[11px] font-semibold text-gray-500">
                  Forfait
                  <select
                    name="plan"
                    defaultValue={u.plan}
                    disabled={isSelf}
                    className="input"
                  >
                    <option value="FREE">GRATUIT</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </label>
                <label className="flex flex-col gap-0.5 text-[11px] font-semibold text-gray-500">
                  Expiration premium (vide = illimité)
                  <input
                    type="date"
                    name="premiumUntil"
                    disabled={isSelf}
                    defaultValue={
                      u.premiumUntil
                        ? new Date(u.premiumUntil).toISOString().slice(0, 10)
                        : ""
                    }
                    className="input"
                  />
                </label>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    name="banned"
                    defaultChecked={u.banned}
                    disabled={isSelf}
                  />
                  Compte suspendu
                </label>
                <div className="flex gap-2">
                  <button
                    disabled={isSelf}
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40"
                  >
                    Enregistrer
                  </button>
                  <button
                    formAction={deleteUser}
                    disabled={isSelf}
                    className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-danger disabled:opacity-40"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              {isSelf && (
                <p className="mt-1 text-[11px] text-gray-400">
                  Vous ne pouvez pas modifier/supprimer votre propre compte ici.
                </p>
              )}
            </form>
          );
        })}
      </div>
    </div>
  );
}
