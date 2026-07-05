import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const schema = z.object({ templateId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!isPremiumActive(user)) {
    return Response.json({ error: "프리미엄 회원 전용 기능입니다." }, { status: 403 });
  }

  if (!rateLimit(clientKey(request, `adopt:${session.user.id}`), 10, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const template = await prisma.mealProgram.findUnique({
    where: { id: parsed.data.templateId },
    include: { items: true },
  });
  if (!template || !template.isTemplate) {
    return Response.json({ error: "템플릿을 찾을 수 없습니다." }, { status: 404 });
  }

  // 기존 개인 프로그램은 대체합니다.
  await prisma.mealProgram.deleteMany({
    where: { ownerUserId: session.user.id, isTemplate: false },
  });

  const created = await prisma.mealProgram.create({
    data: {
      ownerUserId: session.user.id,
      nameKo: template.nameKo,
      descriptionKo: template.descriptionKo,
      isTemplate: false,
      items: {
        create: template.items.map((i) => ({
          dayOfWeek: i.dayOfWeek,
          mealSlot: i.mealSlot,
          productId: i.productId,
        })),
      },
    },
  });

  return Response.json({ ok: true, id: created.id });
}
