import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";
import { getOrCreateUserProgram } from "@/lib/programs";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const schema = z.object({
  productId: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  mealSlot: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
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

  if (!rateLimit(clientKey(request, `program-item:${session.user.id}`), 60, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "입력값을 확인해주세요." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) {
    return Response.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }

  const program = await getOrCreateUserProgram(session.user.id);
  const item = await prisma.mealProgramItem.create({
    data: {
      programId: program.id,
      dayOfWeek: parsed.data.dayOfWeek,
      mealSlot: parsed.data.mealSlot,
      productId: parsed.data.productId,
    },
  });

  return Response.json({ ok: true, id: item.id, programId: program.id }, { status: 201 });
}
