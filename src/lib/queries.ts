import { prisma } from "@/lib/prisma";

export const productCard = {
  id: true,
  nameKo: true,
  brandKo: true,
  imageFront: true,
  calories: true,
  isNew: true,
  ratingAvg: true,
  ratingCount: true,
  category: { select: { nameKo: true, slug: true } },
  country: { select: { nameKo: true, code: true } },
  _count: { select: { issues: true } },
} as const;

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
