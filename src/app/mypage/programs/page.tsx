import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { getSessionWithPlan } from "@/lib/plan";
import { getProgramTemplates, getUserProgram } from "@/lib/queries";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { ProgramClient } from "@/components/ProgramClient";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const { userId, isPremium } = await getSessionWithPlan();
  if (!userId) return null;

  const [templates, userProgram] = await Promise.all([
    getProgramTemplates(),
    getUserProgram(userId),
  ]);

  return (
    <div className="px-4 py-4">
      <div className="mb-1 flex items-center gap-2">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="flex items-center gap-1.5 text-lg font-extrabold text-gray-900">
          <Sparkles size={18} className="text-brand-dark" />
          식단 프로그램
        </h1>
      </div>
      <p className="mb-4 px-1 text-xs text-gray-500">
        검증된 제품으로 나만의 주간 식단을 구성해보세요.
      </p>

      {!isPremium ? (
        <PremiumUpsell feature="식단 프로그램" />
      ) : (
        <ProgramClient
          templates={templates.map((t) => ({
            id: t.id,
            nameKo: t.nameKo,
            descriptionKo: t.descriptionKo,
            items: t.items.map((i) => ({
              id: i.id,
              dayOfWeek: i.dayOfWeek,
              mealSlot: i.mealSlot,
              product: i.product,
            })),
          }))}
          initialProgram={
            userProgram
              ? {
                  id: userProgram.id,
                  nameKo: userProgram.nameKo,
                  items: userProgram.items.map((i) => ({
                    id: i.id,
                    dayOfWeek: i.dayOfWeek,
                    mealSlot: i.mealSlot,
                    product: i.product,
                  })),
                }
              : null
          }
        />
      )}
    </div>
  );
}
