import Link from "next/link";
import { ChevronLeft, Crown, ShieldAlert, ShoppingCart, Sparkles, NotebookPen, Bell } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";
import { TrialButton } from "@/components/TrialButton";

export const dynamic = "force-dynamic";

const freeFeatures = ["제품 검색 및 상세 정보 조회", "바코드 스캔", "즐겨찾기", "식단 다이어리 (일일 칼로리 기록)"];

const premiumFeatures = [
  { icon: ShoppingCart, label: "장바구니(쇼핑리스트)", desc: "즐겨찾기·프로그램에서 바로 장보기 목록 생성" },
  { icon: Sparkles, label: "주간 식단 프로그램", desc: "검증된 제품으로 구성된 주간 식단표 이용" },
  { icon: NotebookPen, label: "증상 기록", desc: "제품별로 몸에 나타난 반응을 기록하고 추적" },
  { icon: ShieldAlert, label: "알레르기 개인 설정", desc: "내 알레르기 유발물질 등록 시 제품마다 개인 경고 표시" },
  { icon: Bell, label: "안전 알림", desc: "즐겨찾기한 제품에 제조 안전 이슈가 등록되면 즉시 알림" },
];

export default async function PremiumPage() {
  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true, premiumUntil: true, hasUsedTrial: true },
      })
    : null;
  const premium = isPremiumActive(user);

  return (
    <div className="px-4 py-4 md:mx-auto md:max-w-2xl">
      <div className="mb-1 flex items-center gap-2">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="flex items-center gap-1.5 text-lg font-extrabold text-gray-900">
          <Crown size={18} className="text-amber-500" />
          톡키체크 프리미엄
        </h1>
      </div>

      {premium ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm font-bold text-amber-800">
            이미 프리미엄을 이용 중이에요 🎉
          </p>
          {user?.premiumUntil && (
            <p className="mt-1 text-xs text-amber-700">
              {new Date(user.premiumUntil).toLocaleDateString("ko-KR")}까지 이용 가능
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-4 text-white shadow-sm">
          <p className="text-xs opacity-90">월 4,900원 · 언제든 해지 가능</p>
          <p className="mt-1 text-xl font-extrabold">더 건강한 식습관, 프리미엄으로</p>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs font-bold text-gray-500">무료로 제공되는 기능</p>
        <ul className="flex flex-col gap-1.5">
          {freeFeatures.map((f) => (
            <li key={f} className="rounded-xl bg-surface px-3 py-2 text-xs text-gray-700 border border-border">
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-bold text-amber-600">프리미엄 전용 기능</p>
        <ul className="flex flex-col gap-2">
          {premiumFeatures.map((f) => (
            <li
              key={f.label}
              className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5"
            >
              <f.icon size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">{f.label}</p>
                <p className="text-xs text-gray-600">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!premium && (
        <div className="mt-6">
          {user?.hasUsedTrial ? (
            <p className="rounded-xl bg-background px-4 py-3 text-center text-xs text-gray-500">
              무료 체험을 이미 사용하셨어요. 결제 연동 준비 중입니다 — 문의는
              관리자에게 남겨주세요.
            </p>
          ) : (
            <TrialButton />
          )}
        </div>
      )}
    </div>
  );
}
