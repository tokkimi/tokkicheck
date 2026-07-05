import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rejectProductRequest } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "검토중",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

export default async function AdminRequestsPage() {
  const requests = await prisma.productRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">
        사용자 제품 등록 요청
      </h2>
      <div className="flex flex-col gap-2">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{r.nameKo}</p>
                <p className="truncate text-xs text-gray-500">
                  {r.brandKo} · {r.countryNameKo ?? "제조국 미상"} · 요청자{" "}
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
                <img src={r.imageFront} alt="정면" className="h-16 w-16 rounded-lg object-cover" />
                {r.imageBack && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageBack} alt="후면" className="h-16 w-16 rounded-lg object-cover" />
                )}
              </div>
            )}
            {r.status === "PENDING" && (
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href={`/admin/requests/${r.id}/approve`}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white"
                >
                  승인 처리
                </Link>
                <form action={rejectProductRequest} className="flex-1">
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-danger">
                    반려
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-xs text-gray-400">등록 요청이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
