import Link from "next/link";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionWithPlan } from "@/lib/plan";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { ShoppingListClient } from "@/components/ShoppingListClient";

export const dynamic = "force-dynamic";

export default async function ShoppingListPage() {
  const { userId, isPremium } = await getSessionWithPlan();

  const items = isPremium
    ? await prisma.shoppingListItem.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, nameKo: true, imageFront: true } } },
      })
    : [];

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
          <ShoppingCart size={18} className="text-brand-dark" />
          장바구니
        </h1>
      </div>
      <p className="mb-4 px-1 text-xs text-gray-500">
        즐겨찾기·식단 프로그램에서 담은 제품과 직접 추가한 항목을 확인하세요.
      </p>

      {!isPremium ? (
        <PremiumUpsell feature="장바구니" />
      ) : (
        <ShoppingListClient
          initialItems={items.map((i) => ({
            id: i.id,
            checked: i.checked,
            customName: i.customName,
            product: i.product,
          }))}
        />
      )}
    </div>
  );
}
