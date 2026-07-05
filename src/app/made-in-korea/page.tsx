import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/auth";
import { getMadeInKoreaProducts, enrichProductsForUser } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MadeInKoreaPage() {
  const session = await auth();
  const productsRaw = await getMadeInKoreaProducts();
  const products = await enrichProductsForUser(productsRaw, session?.user?.id);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-1 flex items-center gap-2 text-xl font-extrabold text-gray-900">
        <span>🇰🇷</span>
        메이드 인 코리아
      </h1>
      <p className="mb-4 text-xs text-gray-500">
        대한민국에서 제조된 제품 {products.length}개
      </p>
      {products.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          아직 등록된 제품이 없습니다.
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
