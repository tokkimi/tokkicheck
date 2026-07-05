import type { AllergenTag } from "@/lib/allergens";

// Open Food Facts는 오픈 라이선스(데이터: ODbL, 사진: CC BY-SA)로 제공되는
// 커뮤니티 식품 데이터베이스입니다. 우리 DB에 없는 바코드를 스캔했을 때
// 보조 조회용으로만 사용하며, 가져온 정보는 항상 출처를 표기하고
// verified=false로 표시해 관리자 확인 전임을 알립니다.
const OFF_ALLERGEN_KO: Record<string, AllergenTag> = {
  "en:eggs": "난류(계란)",
  "en:milk": "우유",
  "en:buckwheat": "메밀",
  "en:peanuts": "땅콩",
  "en:soybeans": "대두",
  "en:gluten": "밀",
  "en:crustaceans": "새우",
  "en:molluscs": "조개류(굴·전복·홍합 포함)",
  "en:nuts": "호두",
  "en:sulphur-dioxide-and-sulphites": "아황산류",
};

const CATEGORY_KEYWORDS: { slug: string; keywords: string[] }[] = [
  { slug: "ramen", keywords: ["noodle", "ramen", "instant-noodles", "면", "라면"] },
  { slug: "snack", keywords: ["snack", "chip", "cookie", "biscuit", "candy", "chocolate", "과자", "스낵"] },
  { slug: "beverage", keywords: ["beverage", "drink", "juice", "soda", "water", "tea", "coffee", "음료"] },
  { slug: "dairy", keywords: ["dairy", "milk", "yogurt", "yoghurt", "cheese", "우유", "유제품"] },
  { slug: "frozen", keywords: ["frozen", "dumpling", "냉동"] },
  { slug: "bakery", keywords: ["bread", "bakery", "pastry", "cake", "빵"] },
  { slug: "icecream", keywords: ["ice-cream", "ice-creams", "아이스크림"] },
  { slug: "sauce", keywords: ["sauce", "condiment", "seasoning", "소스", "조미료"] },
  { slug: "convenience", keywords: ["ready-meal", "meal", "rice", "convenience", "도시락"] },
  { slug: "health", keywords: ["supplement", "vitamin", "health", "건강기능식품"] },
  { slug: "pet", keywords: ["pet-food", "cat-food", "dog-food", "반려동물"] },
];

export type OffProduct = {
  barcode: string;
  nameKo: string;
  brandKo: string;
  categorySlug: string;
  imageFront: string | null;
  calories: number | null;
  servingSizeG: number | null;
  carbsG: number | null;
  proteinG: number | null;
  fatG: number | null;
  sugarG: number | null;
  sodiumMg: number | null;
  ingredientsKo: string | null;
  allergensKo: string | null;
  allergenTags: AllergenTag[];
};

function guessCategorySlug(categoriesTags: string[], name: string): string {
  const haystack = (categoriesTags.join(" ") + " " + name).toLowerCase();
  for (const { slug, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((k) => haystack.includes(k))) return slug;
  }
  return "etc";
}

function parseServingSize(serving: string | undefined | null): number | null {
  if (!serving) return null;
  const match = serving.match(/([\d.]+)\s*g/i);
  return match ? Math.round(parseFloat(match[1])) : null;
}

function mapAllergens(tags: string[] | undefined): { ko: string | null; tags: AllergenTag[] } {
  if (!tags || tags.length === 0) return { ko: null, tags: [] };
  const koLabels = new Set<AllergenTag>();
  for (const tag of tags) {
    const mapped = OFF_ALLERGEN_KO[tag];
    if (mapped) koLabels.add(mapped);
  }
  const list = Array.from(koLabels);
  return { ko: list.length > 0 ? `${list.join(", ")} 함유 (Open Food Facts 데이터 기준)` : null, tags: list };
}

/**
 * Open Food Facts에서 바코드로 제품을 조회합니다. 실패/네트워크 오류/미등록
 * 바코드는 모두 null을 반환해 스캔 흐름이 항상 안전하게 "찾을 수 없음"으로
 * 이어지도록 합니다.
 */
export async function lookupOpenFoodFacts(barcode: string): Promise<OffProduct | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=product_name,product_name_ko,brands,categories_tags,image_front_url,image_url,ingredients_text,ingredients_text_ko,allergens_tags,nutriments,serving_size`,
      { signal: controller.signal, headers: { "User-Agent": "tokkicheck - Korean food safety app" } }
    );
    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const nameKo: string | undefined = p.product_name_ko || p.product_name;
    if (!nameKo) return null;

    const nutriments = p.nutriments ?? {};
    const { ko: allergensKo, tags: allergenTags } = mapAllergens(p.allergens_tags);

    return {
      barcode,
      nameKo,
      brandKo: p.brands ? String(p.brands).split(",")[0].trim() : "정보 없음",
      categorySlug: guessCategorySlug(p.categories_tags ?? [], nameKo),
      imageFront: p.image_front_url || p.image_url || null,
      calories:
        typeof nutriments["energy-kcal_100g"] === "number"
          ? Math.round(nutriments["energy-kcal_100g"])
          : null,
      servingSizeG: parseServingSize(p.serving_size) ?? 100,
      carbsG: typeof nutriments["carbohydrates_100g"] === "number" ? nutriments["carbohydrates_100g"] : null,
      proteinG: typeof nutriments["proteins_100g"] === "number" ? nutriments["proteins_100g"] : null,
      fatG: typeof nutriments["fat_100g"] === "number" ? nutriments["fat_100g"] : null,
      sugarG: typeof nutriments["sugars_100g"] === "number" ? nutriments["sugars_100g"] : null,
      sodiumMg:
        typeof nutriments["sodium_100g"] === "number" ? Math.round(nutriments["sodium_100g"] * 1000) : null,
      ingredientsKo: p.ingredients_text_ko || p.ingredients_text || null,
      allergensKo,
      allergenTags,
    };
  } catch {
    return null;
  }
}
