import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { approveAiProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function ApproveAiProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories, countries] = await Promise.all([
    prisma.aiDiscoveredProduct.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);
  if (!item) notFound();

  const matchedCategory = categories.find((c) => c.id === item.categorySlug);

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-gray-900">
        Vérification d&apos;une nouveauté IA
      </h2>
      <p className="mb-3 text-xs text-gray-500">
        Ces informations ont été collectées automatiquement par l&apos;IA :
        vérifiez impérativement leur exactitude (calories, ingrédients, origine,
        etc.) avant de publier.
      </p>
      <ProductForm
        action={approveAiProduct}
        categories={categories}
        countries={countries}
        submitLabel="Valider et publier"
        extraHiddenFields={[{ name: "aiId", value: item.id }]}
        product={{
          nameKo: item.nameKo,
          brandKo: item.brandKo,
          categoryId: matchedCategory?.id,
          imageFront: item.imageFront ?? undefined,
          calories: item.calories,
        }}
      />
    </div>
  );
}
