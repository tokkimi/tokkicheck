import { prisma } from "@/lib/prisma";

export async function getOrCreateUserProgram(userId: string) {
  const existing = await prisma.mealProgram.findFirst({
    where: { ownerUserId: userId, isTemplate: false },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;

  return prisma.mealProgram.create({
    data: { ownerUserId: userId, nameKo: "내 식단 프로그램", isTemplate: false },
  });
}
