import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rejectAiProduct, runAiScanNow } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "검수 대기",
  APPROVED: "게시됨",
  REJECTED: "반려됨",
};

export default async function AdminAiQueuePage() {
  const items = await prisma.aiDiscoveredProduct.findMany({
    orderBy: { discoveredAt: "desc" },
  });

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">
          AI 신상품 자동 발견 큐
        </h2>
        <form action={runAiScanNow}>
          <button className="rounded-full bg-brand-dark px-3 py-1.5 text-xs font-bold text-white">
            지금 스캔 실행
          </button>
        </form>
      </div>
      <p className="mb-3 text-xs text-gray-500">
        매주 금요일 자동 실행되는 AI 스캔이 편의점 등에서 발견한 신상품
        후보입니다. 검수 후 게시하세요.
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
                  {item.brandKo} · {item.sourceStore ?? "출처 미상"} ·{" "}
                  {item.countryNameKo ?? "제조국 미상"}
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
                  검수 후 게시
                </Link>
                <form action={rejectAiProduct} className="flex-1">
                  <input type="hidden" name="id" value={item.id} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-danger">
                    반려
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400">발견된 신상품 후보가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
