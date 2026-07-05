// 국기 이모지는 OS/폰트에 따라 깨져 보이는 경우(Windows 등)가 있어, 대신 직접
// 그린 벡터 국기 아이콘을 사용합니다. viewBox는 30x20(3:2) 고정입니다.
const FLAG_INNER: Record<string, string> = {
  KR: `<rect width="30" height="20" fill="#ffffff"/><path d="M15 4.5a5.5 5.5 0 0 1 0 11 2.75 2.75 0 0 1 0-5.5 2.75 2.75 0 0 0 0-5.5z" fill="#cd2e3a"/><path d="M15 4.5a5.5 5.5 0 0 0 0 11 2.75 2.75 0 0 0 0-5.5 2.75 2.75 0 0 1 0-5.5z" fill="#0047a0"/>`,
  JP: `<rect width="30" height="20" fill="#ffffff"/><circle cx="15" cy="10" r="5.5" fill="#bc002d"/>`,
  FR: `<rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#ffffff"/><rect x="20" width="10" height="20" fill="#ef4135"/>`,
  TH: `<rect width="30" height="20" fill="#a51931"/><rect y="4" width="30" height="12" fill="#ffffff"/><rect y="6.5" width="30" height="7" fill="#2d2a4a"/>`,
  CN: `<rect width="30" height="20" fill="#de2910"/><circle cx="7" cy="6" r="2.4" fill="#ffde00"/>`,
  VN: `<rect width="30" height="20" fill="#da251d"/><circle cx="15" cy="10" r="3" fill="#ffff00"/>`,
  US: `<rect width="30" height="20" fill="#ffffff"/>${[0, 1, 2, 3, 4, 5, 6]
    .map(
      (i) =>
        `<rect y="${(i * 20) / 7}" width="30" height="${20 / 7}" fill="${i % 2 === 0 ? "#b22234" : "#ffffff"}"/>`
    )
    .join("")}<rect width="13" height="10.5" fill="#3c3b6e"/>`,
};

const FALLBACK = `<rect width="30" height="20" fill="#9ca3af"/>`;

export function flagInnerSvg(code: string): string {
  return FLAG_INNER[code.toUpperCase()] ?? FALLBACK;
}

export const COUNTRY_NAME_KO: Record<string, string> = {
  KR: "대한민국",
  CN: "중국",
  VN: "베트남",
  TH: "태국",
  US: "미국",
  JP: "일본",
  FR: "프랑스",
};
