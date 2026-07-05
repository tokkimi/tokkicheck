import Link from "next/link";
import { ChevronLeft, NotebookPen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionWithPlan } from "@/lib/plan";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { SymptomsClient } from "@/components/SymptomsClient";

export const dynamic = "force-dynamic";

export default async function SymptomsPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const { userId, isPremium } = await getSessionWithPlan();

  const { productId } = await searchParams;

  const [notes, preselected] = await Promise.all([
    prisma.symptomNote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { product: { select: { id: true, nameKo: true, imageFront: true } } },
    }),
    productId
      ? prisma.product.findUnique({
          where: { id: productId },
          select: { id: true, nameKo: true, brandKo: true, imageFront: true, calories: true },
        })
      : Promise.resolve(null),
  ]);

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
          <NotebookPen size={18} className="text-brand-dark" />
          증상 기록
        </h1>
      </div>
      <p className="mb-4 px-1 text-xs text-gray-500">
        특정 제품을 먹은 뒤 나타난 반응을 기록해두면 나중에 원인을 찾는 데
        도움이 돼요.
      </p>

      {!isPremium ? (
        <PremiumUpsell feature="증상 기록" />
      ) : (
        <SymptomsClient
          initialNotes={notes.map((n) => ({
            id: n.id,
            note: n.note,
            severity: n.severity,
            createdAt: n.createdAt.toISOString(),
            product: n.product,
          }))}
          preselected={preselected}
        />
      )}
    </div>
  );
}
