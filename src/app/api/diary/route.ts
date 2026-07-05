import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const createSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive().max(50),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (!rateLimit(clientKey(request, `diary:${session.user.id}`), 60, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "입력값을 확인해주세요." }, { status: 400 });
  }

  const { productId, quantity, date } = parsed.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return Response.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }

  const loggedAt = date ? new Date(`${date}T12:00:00.000Z`) : new Date();
  const calories = Math.round((product.calories ?? 0) * quantity);

  const entry = await prisma.foodLogEntry.create({
    data: {
      userId: session.user.id,
      productId,
      quantity,
      calories,
      loggedAt,
    },
  });

  return Response.json({ ok: true, id: entry.id }, { status: 201 });
}
