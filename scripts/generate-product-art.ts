// 데모 제품 이미지를 생성합니다 (실사 사진 대신 정면/후면 벡터 목업, 배경 투명 = 누끼 처리).
// 실제 서비스에서는 관리자 페이지에서 실사 이미지를 업로드/자동 배경제거 파이프라인으로 교체합니다.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { products, type ProductDef } from "../prisma/seed-data";

const categoryColor: Record<string, [string, string]> = {
  snack: ["#f59e0b", "#fbbf24"],
  ramen: ["#ef4444", "#f87171"],
  beverage: ["#0ea5e9", "#38bdf8"],
  dairy: ["#3b82f6", "#60a5fa"],
  frozen: ["#06b6d4", "#22d3ee"],
  bakery: ["#f97316", "#fb923c"],
  icecream: ["#ec4899", "#f472b6"],
  sauce: ["#84cc16", "#a3e635"],
  convenience: ["#8b5cf6", "#a78bfa"],
  health: ["#10b981", "#34d399"],
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapText(text: string, max: number): string[] {
  const words = text.split(/(?=[가-힣])/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + w).length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur += w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function frontSvg(p: ProductDef, icon: string): string {
  const [c1, c2] = categoryColor[p.categorySlug] ?? ["#64748b", "#94a3b8"];
  const lines = wrapText(p.nameKo, 7);
  const nameSvg = lines
    .map((l, i) => `<tspan x="150" dy="${i === 0 ? 0 : 34}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect x="20" y="16" width="260" height="368" rx="28" fill="url(#g)" filter="url(#shadow)"/>
  <rect x="20" y="16" width="260" height="368" rx="28" fill="black" opacity="0.04"/>
  <circle cx="150" cy="120" r="54" fill="white" opacity="0.18"/>
  <text x="150" y="130" font-size="56" text-anchor="middle" font-family="sans-serif">${icon}</text>
  <text x="150" y="46" font-size="16" fill="white" opacity="0.9" text-anchor="middle" font-family="sans-serif">${esc(p.brandKo)}</text>
  <text x="150" y="230" font-size="28" font-weight="800" fill="white" text-anchor="middle" font-family="sans-serif">${nameSvg}</text>
  <rect x="40" y="330" width="220" height="34" rx="17" fill="white" opacity="0.92"/>
  <text x="150" y="353" font-size="17" font-weight="700" fill="#1f2937" text-anchor="middle" font-family="sans-serif">${p.calories} kcal</text>
</svg>`;
}

function backSvg(p: ProductDef, countryKo: string): string {
  const [c1] = categoryColor[p.categorySlug] ?? ["#64748b", "#94a3b8"];
  const ingLines = wrapText(p.ingredientsKo, 18);
  const ingSvg = ingLines
    .map((l, i) => `<tspan x="34" dy="${i === 0 ? 0 : 18}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect x="20" y="16" width="260" height="368" rx="28" fill="#ffffff" stroke="${c1}" stroke-width="4" filter="url(#shadow2)"/>
  <text x="150" y="50" font-size="20" font-weight="800" fill="#111827" text-anchor="middle" font-family="sans-serif">영양성분표</text>
  <line x1="34" y1="62" x2="266" y2="62" stroke="#111827" stroke-width="2"/>
  <text x="34" y="84" font-size="13" fill="#374151" font-family="sans-serif">1회 제공량 ${p.servingSizeG}g 기준</text>
  <line x1="34" y1="92" x2="266" y2="92" stroke="#e5e7eb"/>
  <text x="34" y="114" font-size="14" fill="#111827" font-family="sans-serif">열량</text>
  <text x="266" y="114" font-size="14" fill="#111827" text-anchor="end" font-family="sans-serif">${p.calories} kcal</text>
  <text x="34" y="136" font-size="13" fill="#374151" font-family="sans-serif">탄수화물</text>
  <text x="266" y="136" font-size="13" fill="#374151" text-anchor="end" font-family="sans-serif">${p.carbsG} g</text>
  <text x="34" y="156" font-size="13" fill="#374151" font-family="sans-serif">  당류</text>
  <text x="266" y="156" font-size="13" fill="#374151" text-anchor="end" font-family="sans-serif">${p.sugarG} g</text>
  <text x="34" y="176" font-size="13" fill="#374151" font-family="sans-serif">단백질</text>
  <text x="266" y="176" font-size="13" fill="#374151" text-anchor="end" font-family="sans-serif">${p.proteinG} g</text>
  <text x="34" y="196" font-size="13" fill="#374151" font-family="sans-serif">지방</text>
  <text x="266" y="196" font-size="13" fill="#374151" text-anchor="end" font-family="sans-serif">${p.fatG} g</text>
  <text x="34" y="216" font-size="13" fill="#374151" font-family="sans-serif">나트륨</text>
  <text x="266" y="216" font-size="13" fill="#374151" text-anchor="end" font-family="sans-serif">${p.sodiumMg} mg</text>
  <line x1="34" y1="228" x2="266" y2="228" stroke="#e5e7eb"/>
  <text x="34" y="248" font-size="12" font-weight="700" fill="#111827" font-family="sans-serif">원재료명</text>
  <text x="34" y="266" font-size="11.5" fill="#4b5563" font-family="sans-serif">${ingSvg}</text>
  <text x="34" y="356" font-size="12" font-weight="700" fill="#b91c1c" font-family="sans-serif">알레르기 정보</text>
  <text x="34" y="374" font-size="11.5" fill="#b91c1c" font-family="sans-serif">${esc(p.allergensKo)}</text>
  <text x="34" y="390" font-size="10" fill="#6b7280" font-family="sans-serif">제조국: ${esc(countryKo)}</text>
</svg>`;
}

const iconByCategory: Record<string, string> = {
  snack: "🍪", ramen: "🍜", beverage: "🥤", dairy: "🥛", frozen: "🧊",
  bakery: "🥐", icecream: "🍦", sauce: "🧂", convenience: "🍱", health: "💊",
};

const countryByCode: Record<string, string> = {
  KR: "대한민국", CN: "중국", VN: "베트남", TH: "태국", US: "미국", JP: "일본",
};

const outDir = join(process.cwd(), "public", "products");
mkdirSync(outDir, { recursive: true });

for (const p of products) {
  const icon = iconByCategory[p.categorySlug] ?? "🍽️";
  const front = frontSvg(p, icon);
  const back = backSvg(p, countryByCode[p.countryCode] ?? p.countryCode);
  writeFileSync(join(outDir, `${p.barcode}-front.svg`), front, "utf8");
  writeFileSync(join(outDir, `${p.barcode}-back.svg`), back, "utf8");
}

console.log(`생성 완료: ${products.length * 2}개 이미지 (${outDir})`);
