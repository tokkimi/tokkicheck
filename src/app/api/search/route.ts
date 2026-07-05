import { searchProducts } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").slice(0, 100);
  const results = await searchProducts(q);
  return Response.json({ results });
}
