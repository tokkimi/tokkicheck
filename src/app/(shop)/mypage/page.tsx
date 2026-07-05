import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Crown,
  Heart,
  NotebookPen,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";
import { requireUser } from "@/lib/authz";
import { LogoutButton } from "@/components/LogoutButton";

const menuItems = [
  { href: "/mypage/favorites", label: "즐겨찾기", icon: Heart },
  { href: "/mypage/diary", label: "식단 다이어리", icon: CalendarDays },
  { href: "/mypage/shopping-list", label: "장바구니", icon: ShoppingCart, premium: true },
  { href: "/mypage/programs", label: "식단 프로그램", icon: Sparkles, premium: true },
  { href: "/mypage/symptoms", label: "증상 기록", icon: NotebookPen, premium: true },
  { href: "/mypage/allergens", label: "알레르기 설정", icon: ShieldAlert, premium: true },
  { href: "/mypage/notifications", label: "알림", icon: Bell, premium: true },
];

export const dynamic = "force-dynamic";

const statusLabel: Record<string, { text: string; className: string }> = {
  PENDING: { text: "검토중", className: "bg-amber-100 text-amber-700" },
  APPROVED: { text: "승인됨", className: "bg-brand-soft text-brand-dark" },
  REJECTED: { text: "반려됨", className: "bg-red-100 text-red-700" },
};

export default async function MyPage() {
  const session = await requireUser("/mypage");

  const requests = await prisma.productRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, premiumUntil: true },
  });
  const isPremium = isPremiumActive(dbUser);
  const unreadCount = isPremium
    ? await prisma.notification.count({ where: { userId: session.user.id, read: false } })
    : 0;

  return (
    <div className="px-4 py-4 md:mx-auto md:max-w-2xl">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
        <div>
          <p className="flex items-center gap-1.5 text-base font-extrabold text-gray-900">
            {session.user.name}
            {isPremium && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                <Crown size={11} /> 프리미엄
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {!isPremium && (
        <Link
          href="/premium"
          className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Crown size={17} />
            프리미엄으로 업그레이드
          </span>
          <ChevronRight size={16} />
        </Link>
      )}

      <div className="mt-4 grid grid-cols-4 gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-surface py-3 text-center shadow-sm"
          >
            {item.premium && !isPremium && (
              <Crown size={10} className="absolute right-1.5 top-1.5 text-amber-500" />
            )}
            {item.href === "/mypage/notifications" && unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
            <item.icon size={19} className="text-brand-dark" />
            <span className="text-[10.5px] font-semibold text-gray-700">
              {item.label}
            </span>
          </Link>
        ))}
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
