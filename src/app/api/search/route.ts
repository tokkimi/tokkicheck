import { auth } from "@/auth";
import { searchProducts, enrichProductsForUser } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").slice(0, 100);
  const session = await auth();
  const raw = await searchProducts(q);
  const results = await enrichProductsForUser(raw, session?.user?.id);
  return Response.json({ results });
}
