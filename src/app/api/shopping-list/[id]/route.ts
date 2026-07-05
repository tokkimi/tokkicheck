import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({ checked: z.boolean() });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.shoppingListItem.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) {
    return Response.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  await prisma.shoppingListItem.update({
    where: { id },
    data: { checked: parsed.data.checked },
  });
  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.shoppingListItem.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) {
    return Response.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.shoppingListItem.delete({ where: { id } });
  return Response.json({ ok: true });
}
