import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type PlanInfo = {
  plan: "FREE" | "PREMIUM";
  premiumUntil: Date | null;
};

/**
 * 결제 연동 전까지는 로그인한 모든 사용자에게 프리미엄 기능을 열어둡니다.
 * 실제 결제 시스템(Stripe 등)을 연결하면 아래 주석 처리된 원래 로직으로
 * 되돌려서 plan 필드 기준으로 다시 제한하세요.
 */
export function isPremiumActive(user: PlanInfo | null | undefined): boolean {
  return Boolean(user);

  // 실제 결제 연동 후 사용할 원래 로직:
  // if (!user) return false;
  // if (user.plan !== "PREMIUM") return false;
  // if (user.premiumUntil && user.premiumUntil.getTime() < Date.now()) return false;
  // return true;
}

/**
 * 현재 로그인한 사용자와 프리미엄 여부를 함께 반환합니다 (프리미엄 전용 페이지용).
 * 로그인하지 않은 경우 /login으로 직접 리다이렉트합니다 — proxy.ts(구
 * middleware)에만 의존하지 않는 이중 방어입니다.
 */
export async function getSessionWithPlan() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
