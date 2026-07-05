import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * 로그인 여부를 페이지 자체에서 직접 확인합니다. proxy.ts(구 middleware)에만
 * 의존하지 않는 이중 방어 — 배포 환경에 따라 proxy가 실행되지 않는 경우를
 * 대비합니다.
 */
export async function requireUser(callbackUrl?: string) {
  const session = await auth();
  if (!session?.user) {
    redirect(callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}
