/** ISO 3166-1 alpha-2 국가 코드를 국기 이모지로 변환합니다 (예: "KR" -> "🇰🇷"). */
export function countryCodeToFlag(code: string): string {
  const upper = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "🏳️";
  const codePoints = [...upper].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/** 주 제조국+ 원산지 구성 코드들을 중복 없이 국기로 나열합니다. */
export function countryFlags(primaryCode: string, extraCodes: string[] = []): string {
  const codes = [primaryCode, ...extraCodes];
  const seen = new Set<string>();
  const unique = codes.filter((c) => {
    const key = c.toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.map(countryCodeToFlag).join(" ");
}
