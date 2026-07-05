import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type PlanInfo = {
  plan: "FREE" | "PREMIUM";
  premiumUntil: Date | null;
};

export function isPremiumActive(user: PlanInfo | null | undefined): boolean {
  if (!user) return false;
  if (user.plan !== "PREMIUM") return false;
  if (user.premiumUntil && user.premiumUntil.getTime() < Date.now()) return false;
  return true;
}

/** 현재 로그인한 사용자와 프리미엄 여부를 함께 반환합니다 (프리미엄 전용 페이지용). */
export async function getSessionWithPlan() {
  const session = await auth();
  if (!session?.user) return { session: null, userId: null, isPremium: false };

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, premiumUntil: true },
  });

  return {
    session,
    userId: session.user.id,
    isPremium: isPremiumActive(dbUser),
  };
}
