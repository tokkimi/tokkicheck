import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, countries] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-gray-900">Nouveau produit</h2>
      <ProductForm
        action={createProduct}
        categories={categories}
        countries={countries}
        submitLabel="Créer le produit"
      />
    </div>
  );
}
