import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const toggleSchema = z.object({
  productId: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (!rateLimit(clientKey(request, `fav:${session.user.id}`), 60, 60 * 1000)) {
    return Response.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  const { productId } = parsed.data;

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return Response.json({ favorited: false });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return Response.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.favorite.create({
    data: { userId: session.user.id, productId },
  });
  return Response.json({ favorited: true });
}
