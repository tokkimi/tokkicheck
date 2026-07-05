import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";
import { ALLERGENS } from "@/lib/allergens";

const schema = z.object({
  tags: z.array(z.enum(ALLERGENS)).max(ALLERGENS.length),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!isPremiumActive(user)) {
    return Response.json({ error: "프리미엄 회원 전용 기능입니다." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { allergenTags: parsed.data.tags },
  });

  return Response.json({ ok: true });
}
