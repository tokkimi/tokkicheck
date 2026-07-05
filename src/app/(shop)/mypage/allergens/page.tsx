import Link from "next/link";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionWithPlan } from "@/lib/plan";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AllergenSettingsClient } from "@/components/AllergenSettingsClient";

export const dynamic = "force-dynamic";

export default async function AllergensPage() {
  const { userId, isPremium } = await getSessionWithPlan();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { allergenTags: true },
  });

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
          <ShieldAlert size={18} className="text-brand-dark" />
          알레르기 설정
        </h1>
      </div>
      <p className="mb-4 px-1 text-xs text-gray-500">
        해당하는 알레르기 유발물질을 선택하면, 제품 목록과 상세 페이지에서
        일치하는 성분이 있을 때 개인 경고를 표시해드려요.
      </p>

      {!isPremium ? (
        <PremiumUpsell feature="알레르기 개인 설정" />
      ) : (
        <AllergenSettingsClient initialTags={user?.allergenTags ?? []} />
      )}
    </div>
  );
}
