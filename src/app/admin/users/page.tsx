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
      <h2 className="mb-3 text-base font-bold text-gray-900">사용자 관리</h2>
      <div className="flex flex-col gap-2">
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
                  className="input w-28"
                >
                  <option value="USER">일반</option>
                  <option value="ADMIN">관리자</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {u.email} · 요청 {u._count.requests}건 · 평점 {u._count.ratings}건
              </p>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    name="banned"
                    defaultChecked={u.banned}
                    disabled={isSelf}
                  />
                  이용 정지
                </label>
                <div className="flex gap-2">
                  <button
                    disabled={isSelf}
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40"
                  >
                    저장
                  </button>
                  <button
                    formAction={deleteUser}
                    disabled={isSelf}
                    className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-danger disabled:opacity-40"
                  >
                    삭제
                  </button>
                </div>
              </div>
              {isSelf && (
                <p className="mt-1 text-[11px] text-gray-400">
                  본인 계정은 수정/삭제할 수 없습니다.
                </p>
              )}
            </form>
          );
        })}
      </div>
    </div>
  );
}
