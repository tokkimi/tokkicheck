import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, { text: string; className: string }> = {
  PENDING: { text: "검토중", className: "bg-amber-100 text-amber-700" },
  APPROVED: { text: "승인됨", className: "bg-brand-soft text-brand-dark" },
  REJECTED: { text: "반려됨", className: "bg-red-100 text-red-700" },
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const requests = await prisma.productRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
        <div>
          <p className="text-base font-extrabold text-gray-900">
            {session.user.name}
          </p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {session.user.role === "ADMIN" && (
        <Link
          href="/admin"
          className="mt-3 flex items-center justify-between rounded-2xl border border-brand bg-brand-soft px-4 py-3 text-sm font-bold text-brand-dark"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck size={17} />
            관리자 페이지로 이동
          </span>
          <ChevronRight size={16} />
        </Link>
      )}

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">내 제품 등록 요청</h2>
        <Link
          href="/mypage/requests/new"
          className="rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white"
        >
          + 새 요청
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {requests.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            아직 등록 요청 내역이 없습니다.
          </p>
        )}
        {requests.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-border bg-surface p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{r.nameKo}</p>
                <p className="text-xs text-gray-500">{r.brandKo}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusLabel[r.status].className}`}
              >
                {statusLabel[r.status].text}
              </span>
            </div>
            {r.reviewNote && (
              <p className="mt-2 rounded-lg bg-background px-2.5 py-1.5 text-xs text-gray-600">
                관리자 메모: {r.reviewNote}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-1 text-xs text-gray-400">
        <Link href="/terms" className="underline">이용약관</Link>
        <Link href="/privacy" className="underline">개인정보처리방침</Link>
      </div>
    </div>
  );
}
