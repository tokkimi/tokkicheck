import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const note = await prisma.symptomNote.findUnique({ where: { id } });
  if (!note || note.userId !== session.user.id) {
    return Response.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.symptomNote.delete({ where: { id } });
  return Response.json({ ok: true });
}
