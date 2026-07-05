import { prisma } from "@/lib/prisma";
import { overlappingAllergens } from "@/lib/allergens";

export const productCard = {
  id: true,
  nameKo: true,
  brandKo: true,
  imageFront: true,
  calories: true,
  isNew: true,
  ratingAvg: true,
  ratingCount: true,
  allergenTags: true,
  category: { select: { nameKo: true, slug: true } },
  country: { select: { nameKo: true, code: true } },
  _count: { select: { issues: true } },
} as const;

type WithId = { id: string };
type WithAllergenTags = { allergenTags: string[] };

export async function withFavoriteFlag<T extends WithId>(
  products: T[],
  userId?: string | null
): Promise<(T & { isFavorited: boolean })[]> {
  if (!userId || products.length === 0) {
    return products.map((p) => ({ ...p, isFavorited: false }));
  }
  const favorites = await prisma.favorite.findMany({
    where: { userId, productId: { in: products.map((p) => p.id) } },
    select: { productId: true },
  });
  const favoritedIds = new Set(favorites.map((f) => f.productId));
  return products.map((p) => ({ ...p, isFavorited: favoritedIds.has(p.id) }));
}

export async function withAllergenWarning<T extends WithAllergenTags>(
  products: T[],
  userId?: string | null
): Promise<(T & { allergenWarning: string[] })[]> {
  if (!userId || products.length === 0) {
    return products.map((p) => ({ ...p, allergenWarning: [] }));
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { allergenTags: true } });
  if (!user || user.allergenTags.length === 0) {
    return products.map((p) => ({ ...p, allergenWarning: [] }));
  }
  return products.map((p) => ({
    ...p,
    allergenWarning: overlappingAllergens(p.allergenTags, user.allergenTags),
  }));
}

/** 즐겨찾기 여부 + 개인 알레르기 경고를 함께 계산합니다. */
export async function enrichProductsForUser<T extends WithId & WithAllergenTags>(
  products: T[],
  userId?: string | null
) {
  const withFav = await withFavoriteFlag(products, userId);
  return withAllergenWarning(withFav, userId);
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export function getNewArrivals(take = 10) {
  return prisma.product.findMany({
    where: { isNew: true },
    orderBy: { publishedAt: "desc" },
    take,
    select: productCard,
  });
}

export function getTopRanked(take = 10) {
  return prisma.product.findMany({
    orderBy: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
    take,
    select: productCard,
  });
}

export function getFlaggedProducts(take = 6) {
  return prisma.product.findMany({
    where: { issues: { some: {} } },
    orderBy: { updatedAt: "desc" },
    take,
    select: productCard,
  });
}

export function getProductsByCategory(categorySlug: string) {
  return prisma.product.findMany({
    where: { category: { slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    select: productCard,
  });
}

export async function getDiaryEntries(userId: string, dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);
  return prisma.foodLogEntry.findMany({
    where: { userId, loggedAt: { gte: start, lte: end } },
    orderBy: { loggedAt: "asc" },
    include: {
      product: { select: { id: true, nameKo: true, brandKo: true, imageFront: true, calories: true } },
    },
  });
}

export async function getFavoriteProducts(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { product: { select: productCard } },
  });
  return favorites.map((f) => ({ ...f.product, isFavorited: true }));
}

export function getProgramTemplates() {
  return prisma.mealProgram.findMany({
    where: { isTemplate: true },
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        include: { product: { select: { id: true, nameKo: true, imageFront: true } } },
      },
    },
  });
}

export function getUserProgram(userId: string) {
  return prisma.mealProgram.findFirst({
    where: { ownerUserId: userId, isTemplate: false },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { id: true, nameKo: true, imageFront: true } } },
      },
    },
  });
}

export function getProductDetail(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      country: true,
      issues: { orderBy: { createdAt: "desc" } },
    },
  });
}

export function getProductByBarcode(barcode: string) {
  return prisma.product.findUnique({
    where: { barcode },
    select: { id: true },
  });
}

export function searchProducts(query: string, take = 30) {
  if (!query.trim()) return Promise.resolve([]);
  return prisma.product.findMany({
    where: {
      OR: [
        { nameKo: { contains: query } },
        { brandKo: { contains: query } },
      ],
    },
    take,
    select: productCard,
  });
}
