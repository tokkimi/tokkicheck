import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import { auth } from "@/auth";
import { getFavoriteProducts, withAllergenWarning } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const favoriteProducts = await getFavoriteProducts(session.user.id);
  const products = await withAllergenWarning(favoriteProducts, session.user.id);

  return (
    <div className="px-4 py-4">
      <div className="mb-1 flex items-center gap-2">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="flex items-center gap-1.5 text-lg font-extrabold text-gray-900">
          <Heart size={18} className="fill-danger text-danger" />
          즐겨찾기
        </h1>
      </div>
      <p className="mb-4 px-1 text-xs text-gray-500">
        총 {products.length}개 제품을 즐겨찾기에 담았어요.
      </p>

      {products.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          아직 즐겨찾기한 제품이 없습니다. 제품 상세에서 하트 버튼을
          눌러보세요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
