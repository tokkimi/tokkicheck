import Link from "next/link";
import { Crown } from "lucide-react";

export function PremiumUpsell({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white">
        <Crown size={22} />
      </span>
      <p className="text-base font-extrabold text-gray-900">
        프리미엄 전용 기능이에요
      </p>
      <p className="text-sm leading-relaxed text-gray-600">
        {feature}은(는) 프리미엄 회원만 이용할 수 있어요.
      </p>
      <Link
        href="/premium"
        className="mt-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white"
      >
        프리미엄 알아보기
      </Link>
    </div>
  );
}
