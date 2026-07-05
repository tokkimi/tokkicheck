import { getProductByBarcode } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = (searchParams.get("barcode") ?? "").trim().slice(0, 40);
  if (!barcode) {
    return Response.json({ error: "barcode가 필요합니다." }, { status: 400 });
  }
  const product = await getProductByBarcode(barcode);
  if (!product) {
    return Response.json({ found: false });
  }
  return Response.json({ found: true, id: product.id });
}
