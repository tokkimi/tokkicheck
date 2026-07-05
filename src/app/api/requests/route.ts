import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productRequestSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (!rateLimit(clientKey(request, `req:${session.user.id}`), 10, 60 * 60 * 1000)) {
    return Response.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = productRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 400 }
    );
  }

  const { nameKo, brandKo, categoryId, countryNameKo, imageFront, imageBack, note } =
    parsed.data;

  if ((imageFront && imageFront.length > 2_000_000) || (imageBack && imageBack.length > 2_000_000)) {
    return Response.json({ error: "이미지 용량이 너무 큽니다." }, { status: 413 });
  }

  const created = await prisma.productRequest.create({
    data: {
      userId: session.user.id,
      nameKo,
      brandKo,
      categoryId: categoryId || null,
      countryNameKo: countryNameKo || null,
      imageFront: imageFront || null,
      imageBack: imageBack || null,
      note: note || null,
    },
  });

  return Response.json({ ok: true, id: created.id }, { status: 201 });
}
