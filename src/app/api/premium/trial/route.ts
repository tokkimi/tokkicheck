import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const TRIAL_DAYS = 7;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (!rateLimit(clientKey(request, `trial:${session.user.id}`), 5, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return Response.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }
  if (user.hasUsedTrial) {
    return Response.json(
      { error: "무료 체험은 1회만 이용할 수 있어요." },
      { status: 409 }
    );
  }

  const premiumUntil = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: user.id },
    data: { plan: "PREMIUM", premiumUntil, hasUsedTrial: true },
  });

  return Response.json({ ok: true, premiumUntil });
}
