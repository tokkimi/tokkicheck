import { runWeeklyAiDiscovery } from "@/lib/ai-discovery";

// Vercel Cron은 CRON_SECRET 환경 변수가 설정되어 있으면 요청에
// `Authorization: Bearer <CRON_SECRET>` 헤더를 자동으로 포함합니다.
// 다른 스케줄러(GitHub Actions 등)를 사용할 경우 동일한 헤더를 수동으로 설정하세요.
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  const result = await runWeeklyAiDiscovery();
  return Response.json({ ok: true, ...result, ranAt: new Date().toISOString() });
}
