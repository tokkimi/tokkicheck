import { prisma } from "@/lib/prisma";

type DiscoveredCandidate = {
  nameKo: string;
  brandKo: string;
  categorySlug?: string;
  countryNameKo?: string;
  sourceStore?: string;
  calories?: number;
  rawNote: string;
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

/**
 * 실제 운영 환경에서는 편의점/마트 신제품 공지, 유통 데이터 피드 등 실제 소스를
 * 크롤링/수집한 뒤 LLM으로 구조화하는 파이프라인으로 교체해야 합니다.
 * 여기서는 ANTHROPIC_API_KEY가 설정된 경우 LLM에게 브레인스토밍을 요청하고,
 * 결과는 반드시 관리자 검수 큐(AiDiscoveredProduct)에만 적재합니다(자동 게시 없음).
 */
async function callClaudeForCandidates(): Promise<DiscoveredCandidate[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return [];

  const categories = await prisma.category.findMany({ select: { slug: true, nameKo: true } });

  const prompt = `당신은 한국 편의점/마트 신상품 조사 보조원입니다. 아래 카테고리 중에서
이번 주(금요일 기준) 새로 출시되었을 법한 한국 식품 신상품 후보를 최대 5개
제안하세요. 실제 신제품을 확신할 수 없다면 추측임을 rawNote에 명시하세요.
카테고리 slug 목록: ${categories.map((c) => c.slug).join(", ")}

각 항목은 다음 JSON 형식의 배열로만 응답하세요 (설명 없이 JSON만):
[{"nameKo": string, "brandKo": string, "categorySlug": string, "countryNameKo": string, "sourceStore": string, "calories": number, "rawNote": string}]`;

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const text = data?.content?.[0]?.text ?? "[]";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.nameKo === "string" && typeof item.brandKo === "string")
      .slice(0, 5);
  } catch {
    return [];
  }
}

export async function runWeeklyAiDiscovery(): Promise<{ inserted: number; skipped: string }> {
  const candidates = await callClaudeForCandidates();

  if (candidates.length === 0) {
    return {
      inserted: 0,
      skipped: process.env.ANTHROPIC_API_KEY
        ? "AI가 이번 주 후보를 찾지 못했습니다."
        : "ANTHROPIC_API_KEY가 설정되지 않아 AI 분석을 건너뛰었습니다.",
    };
  }

  let inserted = 0;
  for (const c of candidates) {
    const existing = await prisma.aiDiscoveredProduct.findFirst({
      where: { nameKo: c.nameKo, brandKo: c.brandKo, status: "PENDING" },
    });
    if (existing) continue;

    await prisma.aiDiscoveredProduct.create({
      data: {
        nameKo: c.nameKo,
        brandKo: c.brandKo,
        categorySlug: c.categorySlug,
        countryNameKo: c.countryNameKo ?? "대한민국",
        sourceStore: c.sourceStore,
        calories: c.calories,
        rawNote: `${c.rawNote} (AI 자동 수집 · 게시 전 관리자 검수 필요)`,
      },
    });
    inserted += 1;
  }

  return { inserted, skipped: "" };
}
