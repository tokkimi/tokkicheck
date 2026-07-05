import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPremiumActive } from "@/lib/plan";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const createSchema = z.object({
  productId: z.string().min(1),
  note: z.string().trim().min(1).max(500),
  severity: z.number().int().min(1).max(3),
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

  if (!rateLimit(clientKey(request, `symptom:${session.user.id}`), 30, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "입력값을 확인해주세요." }, { status: 400 });
  }

  const { productId, note, severity } = parsed.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return Response.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }

  const entry = await prisma.symptomNote.create({
    data: { userId: session.user.id, productId, note, severity },
  });

  return Response.json({ ok: true, id: entry.id }, { status: 201 });
}
