import { prisma } from "@/lib/prisma";

/**
 * 제품 또는 제조국 단위로 제조 안전 이슈가 등록되면, 해당 제품을 즐겨찾기한
 * 프리미엄 회원에게 알림을 생성합니다.
 */
export async function notifyFavoritedUsersOfIssue(params: {
  productId?: string | null;
  countryId?: string | null;
  titleKo: string;
}) {
  const { productId, countryId, titleKo } = params;

  const productIds = productId
    ? [productId]
    : countryId
      ? (
          await prisma.product.findMany({
            where: { countryId },
            select: { id: true },
          })
        ).map((p) => p.id)
      : [];

  if (productIds.length === 0) return;

  const favorites = await prisma.favorite.findMany({
    where: {
      productId: { in: productIds },
      user: { plan: "PREMIUM" },
    },
    select: { userId: true, productId: true, product: { select: { nameKo: true } } },
  });

  if (favorites.length === 0) return;

  await prisma.notification.createMany({
    data: favorites.map((f) => ({
      userId: f.userId,
      productId: f.productId,
      titleKo: "즐겨찾기 제품 안전 알림",
      bodyKo: `즐겨찾기한 "${f.product.nameKo}"에 제조 안전 주의 정보가 등록되었어요: ${titleKo}`,
    })),
  });
}
