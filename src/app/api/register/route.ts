import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "register"), 5, 10 * 60 * 1000)) {
    return Response.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json(
      { error: "이미 가입된 이메일입니다." },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return Response.json({ ok: true }, { status: 201 });
}
