import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { categories, countries, products } from "./seed-data";
import { parseAllergenTags } from "../src/lib/allergens";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const issueByBarcode: Record<
  string,
  { titleKo: string; descriptionKo: string; severity: number }
> = {
  "8801000000035": {
    titleKo: "비위생적 제조 공정 신고 접수",
    descriptionKo:
      "해당 제품의 생산 공장에서 위생 기준 미달 공정이 소비자 신고로 접수되어 조사 중입니다. 세부 내용은 아래 영상을 확인하세요.",
    severity: 2,
  },
  "8801000000073": {
    titleKo: "원산지 표시 위반 적발 이력",
    descriptionKo:
      "제조사가 원재료 원산지를 허위로 표기한 사실이 관계 당국에 적발된 이력이 있습니다.",
    severity: 3,
  },
  "8801000000165": {
    titleKo: "보관 위생 기준 미달 지적",
    descriptionKo:
      "냉동 보관 과정에서 위생 기준을 충족하지 못한 사례가 언론 보도를 통해 확인되었습니다.",
    severity: 2,
  },
  "8801000000226": {
    titleKo: "첨가물 과다 사용 논란",
    descriptionKo:
      "일부 로트에서 허용 기준치를 초과하는 첨가물이 검출되어 논란이 된 바 있습니다.",
    severity: 2,
  },
};

async function main() {
  console.log("시딩 시작...");

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameKo: c.nameKo, icon: c.icon, order: c.order },
      create: c,
    });
  }

  const countryMap = new Map<string, string>();
  for (const c of countries) {
    const row = await prisma.country.upsert({
      where: { code: c.code },
      update: { nameKo: c.nameKo },
      create: c,
    });
    countryMap.set(c.code, row.id);
  }

  const categoryRows = await prisma.category.findMany();
  const categoryMap = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const adminPassword = await bcrypt.hash("Admin1234!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tokkicheck.kr" },
    update: {},
    create: {
      email: "admin@tokkicheck.kr",
      password: adminPassword,
      name: "관리자",
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("User1234!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "user@tokkicheck.kr" },
    update: {},
    create: {
      email: "user@tokkicheck.kr",
      password: userPassword,
      name: "홍길동",
      role: "USER",
    },
  });

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    const countryId = countryMap.get(p.countryCode);
    if (!categoryId || !countryId) continue;

    const product = await prisma.product.upsert({
      where: { barcode: p.barcode },
      update: { allergenTags: parseAllergenTags(p.allergensKo) },
      create: {
        barcode: p.barcode,
        nameKo: p.nameKo,
        brandKo: p.brandKo,
        categoryId,
        countryId,
        imageFront: `/products/${p.barcode}-front.svg`,
        imageBack: `/products/${p.barcode}-back.svg`,
        calories: p.calories,
        servingSizeG: p.servingSizeG,
        carbsG: p.carbsG,
        proteinG: p.proteinG,
        fatG: p.fatG,
        sugarG: p.sugarG,
        sodiumMg: p.sodiumMg,
        ingredientsKo: p.ingredientsKo,
        allergensKo: p.allergensKo,
        allergenTags: parseAllergenTags(p.allergensKo),
        price: p.price,
        isNew: p.isNew,
        ratingAvg: 3.2 + Math.random() * 1.6,
        ratingCount: Math.floor(Math.random() * 400) + 5,
      },
    });

    const issue = issueByBarcode[p.barcode];
    if (issue) {
      const existing = await prisma.manufacturingIssue.findFirst({
        where: { productId: product.id },
      });
      if (!existing) {
        await prisma.manufacturingIssue.create({
          data: {
            productId: product.id,
            titleKo: issue.titleKo,
            descriptionKo: issue.descriptionKo,
            severity: issue.severity,
            videoUrl: "/notices/production-video-placeholder",
            sourceUrl: null,
          },
        });
      }
    }
  }

  const existingRequest = await prisma.productRequest.findFirst({
    where: { userId: demoUser.id },
  });
  if (!existingRequest) {
    await prisma.productRequest.create({
      data: {
        userId: demoUser.id,
        nameKo: "흑임자 라떼",
        brandKo: "카페모먼트",
        countryNameKo: "대한민국",
        note: "동네 편의점에서 새로 나온 제품이에요. 등록 부탁드려요!",
        status: "PENDING",
      },
    });
  }

  const templateBarcodes = {
    BREAKFAST: "8801000000172",
    LUNCH: "8801000000240",
    DINNER: "8801000000257",
    SNACK: "8801000000271",
  } as const;

  const existingTemplate = await prisma.mealProgram.findFirst({
    where: { isTemplate: true },
  });
  if (!existingTemplate) {
    const template = await prisma.mealProgram.create({
      data: {
        nameKo: "균형식 1주 (기본 템플릿)",
        descriptionKo: "아침·점심·저녁·간식을 검증된 제품으로 구성한 기본 식단입니다.",
        isTemplate: true,
      },
    });

    for (let day = 0; day < 7; day++) {
      for (const [mealSlot, barcode] of Object.entries(templateBarcodes)) {
        const product = await prisma.product.findUnique({ where: { barcode } });
        if (!product) continue;
        await prisma.mealProgramItem.create({
          data: {
            programId: template.id,
            dayOfWeek: day,
            mealSlot: mealSlot as "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK",
            productId: product.id,
          },
        });
      }
    }
  }

  const existingAi = await prisma.aiDiscoveredProduct.findFirst();
  if (!existingAi) {
    await prisma.aiDiscoveredProduct.create({
      data: {
        nameKo: "유자 마들렌",
        brandKo: "베이크스토리",
        categorySlug: "bakery",
        countryNameKo: "대한민국",
        sourceStore: "CU",
        rawNote: "AI가 편의점 신제품 목록에서 발견한 후보입니다. 검수 후 게시하세요.",
        status: "PENDING",
      },
    });
  }

  console.log("완료:", {
    admin: admin.email,
    demoUser: demoUser.email,
    products: products.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
