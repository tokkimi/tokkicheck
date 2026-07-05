// 식품위생법 표시 기준의 알레르기 유발물질 22종을 기반으로 한 표준 태그 목록입니다.
export const ALLERGENS = [
  "난류(계란)",
  "우유",
  "메밀",
  "땅콩",
  "대두",
  "밀",
  "고등어",
  "게",
  "새우",
  "돼지고기",
  "복숭아",
  "토마토",
  "아황산류",
  "호두",
  "닭고기",
  "소고기",
  "오징어",
  "조개류(굴·전복·홍합 포함)",
  "잣",
] as const;

export type AllergenTag = (typeof ALLERGENS)[number];

const KEYWORD_TO_TAG: Record<string, AllergenTag> = {
  계란: "난류(계란)",
  난류: "난류(계란)",
  우유: "우유",
  메밀: "메밀",
  땅콩: "땅콩",
  대두: "대두",
  밀: "밀",
  고등어: "고등어",
  게: "게",
  새우: "새우",
  돼지고기: "돼지고기",
  복숭아: "복숭아",
  토마토: "토마토",
  아황산: "아황산류",
  호두: "호두",
  닭고기: "닭고기",
  소고기: "소고기",
  쇠고기: "소고기",
  오징어: "오징어",
  굴: "조개류(굴·전복·홍합 포함)",
  전복: "조개류(굴·전복·홍합 포함)",
  홍합: "조개류(굴·전복·홍합 포함)",
  조개: "조개류(굴·전복·홍합 포함)",
  잣: "잣",
};

/** 자유 텍스트 알레르기 표기에서 표준 태그를 추출합니다 (관리자 등록/시딩용 보조 함수). */
export function parseAllergenTags(text: string | null | undefined): AllergenTag[] {
  if (!text) return [];
  const found = new Set<AllergenTag>();
  for (const [keyword, tag] of Object.entries(KEYWORD_TO_TAG)) {
    if (text.includes(keyword)) found.add(tag);
  }
  return Array.from(found);
}

export function overlappingAllergens(
  productTags: string[],
  userTags: string[]
): string[] {
  if (productTags.length === 0 || userTags.length === 0) return [];
  const userSet = new Set(userTags);
  return productTags.filter((t) => userSet.has(t));
}
