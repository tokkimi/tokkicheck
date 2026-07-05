import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const rateSchema = z.object({
  score: z.number().int().min(1).max(5),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (!rateLimit(clientKey(request, `rate:${session.user.id}`), 30, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = rateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "평점 값이 올바르지 않습니다." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return Response.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.productRating.upsert({
    where: { productId_userId: { productId: id, userId: session.user.id } },
    update: { score: parsed.data.score },
    create: { productId: id, userId: session.user.id, score: parsed.data.score },
  });

  const agg = await prisma.productRating.aggregate({
    where: { productId: id },
    _avg: { score: true },
    _count: { score: true },
  });

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ratingAvg: agg._avg.score ?? 0,
      ratingCount: agg._count.score,
    },
  });

  return Response.json({
    ratingAvg: updated.ratingAvg,
    ratingCount: updated.ratingCount,
  });
}
