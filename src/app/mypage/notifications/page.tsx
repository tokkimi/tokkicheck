import Link from "next/link";
import { AlertTriangle, Bell, ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionWithPlan } from "@/lib/plan";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { MarkAllReadButton } from "@/components/MarkAllReadButton";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const { userId, isPremium } = await getSessionWithPlan();
  if (!userId) return null;

  const notifications = isPremium
    ? await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="px-4 py-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/mypage"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="뒤로 가기"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="flex items-center gap-1.5 text-lg font-extrabold text-gray-900">
            <Bell size={18} className="text-brand-dark" />
            알림
          </h1>
        </div>
        {hasUnread && <MarkAllReadButton />}
      </div>
      <p className="mb-4 px-1 text-xs text-gray-500">
        즐겨찾기한 제품에 제조 안전 이슈가 등록되면 여기로 알려드려요.
      </p>

      {!isPremium ? (
        <PremiumUpsell feature="안전 알림" />
      ) : notifications.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          아직 알림이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <Link
              key={n.id}
              href={n.productId ? `/product/${n.productId}` : "/mypage/notifications"}
              className={`flex items-start gap-2.5 rounded-2xl border p-3 ${
                n.read ? "border-border bg-surface" : "border-red-200 bg-red-50"
              }`}
            >
              <AlertTriangle size={16} className={n.read ? "mt-0.5 text-gray-400" : "mt-0.5 text-danger"} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold ${n.read ? "text-gray-700" : "text-red-900"}`}>
                  {n.titleKo}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{n.bodyKo}</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-danger" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
