import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { approveProductRequest } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function ApproveRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [request, categories, countries] = await Promise.all([
    prisma.productRequest.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);
  if (!request) notFound();

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-gray-900">Approuver la demande</h2>
      <p className="mb-3 text-xs text-gray-500">
        Vérifiez les informations envoyées par l&apos;utilisateur et complétez les
        champs manquants (catégorie, pays de fabrication, valeurs
        nutritionnelles, etc.) avant d&apos;approuver.
      </p>
      <ProductForm
        action={approveProductRequest}
        categories={categories}
        countries={countries}
        submitLabel="Approuver et publier"
        extraHiddenFields={[{ name: "requestId", value: request.id }]}
        product={{
          nameKo: request.nameKo,
          brandKo: request.brandKo,
          categoryId: request.categoryId ?? undefined,
          imageFront: request.imageFront ?? undefined,
          imageBack: request.imageBack,
        }}
      />
    </div>
  );
}
