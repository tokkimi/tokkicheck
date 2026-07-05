import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center justify-between px-4">
      <div>
        <h2 className="text-[17px] font-extrabold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {href && (
        <span className="flex items-center text-xs font-medium text-gray-400">
          더보기 <ChevronRight size={14} />
        </span>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block py-1">
      {content}
    </Link>
  ) : (
    <div className="py-1">{content}</div>
  );
}
