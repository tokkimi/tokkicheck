import { getProductByBarcode } from "@/lib/queries";
import { lookupOpenFoodFacts } from "@/lib/openFoodFacts";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = (searchParams.get("barcode") ?? "").trim().slice(0, 40);
  if (!barcode) {
    return Response.json({ error: "barcode가 필요합니다." }, { status: 400 });
  }

  const product = await getProductByBarcode(barcode);
  if (product) {
    return Response.json({ found: true, id: product.id });
  }

  const imported = await importFromOpenFoodFacts(barcode);
  if (imported) {
    return Response.json({ found: true, id: imported.id });
  }

  return Response.json({ found: false });
}

// 로컬 DB에 없는 바코드는 Open Food Facts(오픈 라이선스 커뮤니티 식품
// 데이터베이스)에서 보조 조회 후, 있으면 verified=false로 자동 등록합니다.
// 실제 매장/집에서 스캔한 실제 제품이 우리 자체 데모용 바코드 범위 밖에
// 있어도 곧바로 결과를 찾을 수 있도록 하기 위함입니다.
async function importFromOpenFoodFacts(barcode: string) {
  const off = await lookupOpenFoodFacts(barcode);
  if (!off) return null;

  const [category, country] = await Promise.all([
    prisma.category.findUnique({ where: { slug: off.categorySlug } }),
    prisma.country.findUnique({ where: { code: "KR" } }),
  ]);
  if (!category || !country) return null;

  try {
    return await prisma.product.create({
      data: {
        barcode: off.barcode,
        nameKo: off.nameKo,
        brandKo: off.brandKo,
        categoryId: category.id,
        countryId: country.id,
        imageFront: off.imageFront || "/products/placeholder.svg",
        imageCredit: "Open Food Facts 커뮤니티 데이터 (CC BY-SA / ODbL)",
        verified: false,
        isNew: true,
        calories: off.calories,
        servingSizeG: off.servingSizeG,
        carbsG: off.carbsG,
        proteinG: off.proteinG,
        fatG: off.fatG,
        sugarG: off.sugarG,
        sodiumMg: off.sodiumMg,
        ingredientsKo: off.ingredientsKo,
        allergensKo: off.allergensKo,
        allergenTags: off.allergenTags,
      },
      select: { id: true },
    });
  } catch {
    // 동시 스캔 등으로 barcode unique 제약에 걸린 경우, 방금 다른 요청이
    // 만든 레코드를 그대로 재사용합니다.
    return prisma.product.findUnique({ where: { barcode: off.barcode }, select: { id: true } });
  }
}
