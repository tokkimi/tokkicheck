import { flagInnerSvg, COUNTRY_NAME_KO } from "@/lib/countryFlagSvg";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function CountryFlag({
  code,
  title,
  className,
}: {
  code: string;
  title?: string;
  className?: string;
}) {
  const label = title ?? COUNTRY_NAME_KO[code.toUpperCase()] ?? code;
  return (
    <svg
      viewBox="0 0 30 20"
      className={className ?? "h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-white/40"}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: `<title>${esc(label)}</title>${flagInnerSvg(code)}` }}
    />
  );
}

export function CountryFlags({
  primaryCode,
  extraCodes = [],
  primaryLabel,
  className,
  flagClassName,
}: {
  primaryCode: string;
  extraCodes?: string[];
  primaryLabel?: string;
  className?: string;
  flagClassName?: string;
}) {
  const seen = new Set<string>();
  const codes = [primaryCode, ...extraCodes].filter((c) => {
    const key = c.toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return (
    <span className={className ?? "flex items-center gap-1"}>
      {codes.map((c) => (
        <CountryFlag
          key={c}
          code={c}
          title={c.toUpperCase() === primaryCode.toUpperCase() ? primaryLabel : undefined}
          className={flagClassName}
        />
      ))}
    </span>
  );
}
