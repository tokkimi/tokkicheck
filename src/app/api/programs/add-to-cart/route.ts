import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!isPremiumActive(user)) {
    return Response.json({ error: "프리미엄 회원 전용 기능입니다." }, { status: 403 });
  }

  const program = await prisma.mealProgram.findFirst({
    where: { ownerUserId: session.user.id, isTemplate: false },
    include: { items: true },
  });
  if (!program || program.items.length === 0) {
    return Response.json({ error: "프로그램에 담긴 제품이 없어요." }, { status: 400 });
  }

  const uniqueProductIds = Array.from(new Set(program.items.map((i) => i.productId)));
  const existing = await prisma.shoppingListItem.findMany({
    where: { userId: session.user.id, productId: { in: uniqueProductIds }, checked: false },
    select: { productId: true },
  });
  const existingIds = new Set(existing.map((e) => e.productId));
  const toAdd = uniqueProductIds.filter((id) => !existingIds.has(id));

  if (toAdd.length > 0) {
    await prisma.shoppingListItem.createMany({
      data: toAdd.map((productId) => ({ userId: session.user.id, productId })),
    });
  }

  return Response.json({ ok: true, added: toAdd.length });
}
