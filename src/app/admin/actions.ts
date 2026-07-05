"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { runWeeklyAiDiscovery } from "@/lib/ai-discovery";
import { notifyFavoritedUsersOfIssue } from "@/lib/notifications";

const MAX_IMAGE_BYTES = 2_000_000;

async function fileToDataUrl(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("L'image doit faire 2 Mo maximum.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Seuls les fichiers image sont acceptés.");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  return v === "" ? null : Number(v);
}
function codesList(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
}

// ---------- Categories ----------

export async function createCategory(formData: FormData) {
  await requireAdmin();
  await prisma.category.create({
    data: {
      slug: str(formData, "slug"),
      nameKo: str(formData, "nameKo"),
      icon: str(formData, "icon") || null,
      order: Number(str(formData, "order") || "0"),
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.category.update({
    where: { id },
    data: {
      nameKo: str(formData, "nameKo"),
      icon: str(formData, "icon") || null,
      order: Number(str(formData, "order") || "0"),
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error("Impossible de supprimer : des produits appartiennent encore à cette catégorie.");
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

// ---------- Products ----------

async function buildProductData(formData: FormData) {
  const imageFrontFile = formData.get("imageFrontFile") as File | null;
  const imageBackFile = formData.get("imageBackFile") as File | null;
  const imageFrontUrl = str(formData, "imageFrontUrl");
  const imageBackUrl = str(formData, "imageBackUrl");

  const imageFrontData = await fileToDataUrl(imageFrontFile);
  const imageBackData = await fileToDataUrl(imageBackFile);

  return {
    barcode: str(formData, "barcode") || null,
    nameKo: str(formData, "nameKo"),
    brandKo: str(formData, "brandKo"),
    categoryId: str(formData, "categoryId"),
    countryId: str(formData, "countryId"),
    originCountryCodes: codesList(formData, "originCountryCodes"),
    imageFront: imageFrontData || imageFrontUrl || undefined,
    imageBack: imageBackData || imageBackUrl || null,
    calories: numOrNull(formData, "calories"),
    servingSizeG: numOrNull(formData, "servingSizeG"),
    carbsG: numOrNull(formData, "carbsG"),
    proteinG: numOrNull(formData, "proteinG"),
    fatG: numOrNull(formData, "fatG"),
    sugarG: numOrNull(formData, "sugarG"),
    sodiumMg: numOrNull(formData, "sodiumMg"),
    ingredientsKo: str(formData, "ingredientsKo") || null,
    allergensKo: str(formData, "allergensKo") || null,
    allergenTags: formData.getAll("allergenTags").map(String),
    price: numOrNull(formData, "price"),
    isNew: formData.get("isNew") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = await buildProductData(formData);
  if (!data.imageFront) {
    throw new Error("Veuillez importer une image de face ou indiquer une URL.");
  }
  const product = await prisma.product.create({
    data: { ...data, imageFront: data.imageFront },
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = await buildProductData(formData);
  await prisma.product.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/product/${id}`);
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.manufacturingIssue.deleteMany({ where: { productId: id } });
  await prisma.productRating.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// ---------- Manufacturing issues ----------

export async function createIssue(formData: FormData) {
  await requireAdmin();
  const productId = str(formData, "productId");
  const countryId = str(formData, "countryId");
  const titleKo = str(formData, "titleKo");
  await prisma.manufacturingIssue.create({
    data: {
      productId: productId || null,
      countryId: countryId || null,
      titleKo,
      descriptionKo: str(formData, "descriptionKo"),
      videoUrl: str(formData, "videoUrl"),
      sourceUrl: str(formData, "sourceUrl") || null,
      severity: Number(str(formData, "severity") || "1"),
    },
  });
  await notifyFavoritedUsersOfIssue({ productId: productId || null, countryId: countryId || null, titleKo });
  revalidatePath("/admin/issues");
  if (productId) revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function deleteIssue(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const issue = await prisma.manufacturingIssue.delete({ where: { id } });
  revalidatePath("/admin/issues");
  if (issue.productId) revalidatePath(`/admin/products/${issue.productId}`);
  revalidatePath("/");
}

// ---------- Product requests (user submissions) ----------

export async function rejectProductRequest(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.productRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewNote: str(formData, "reviewNote") || null,
      reviewedAt: new Date(),
    },
  });
  revalidatePath("/admin/requests");
}

export async function approveProductRequest(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "requestId");
  const data = await buildProductData(formData);
  if (!data.imageFront) {
    throw new Error("Veuillez importer une image de face ou indiquer une URL.");
  }
  await prisma.$transaction([
    prisma.product.create({ data: { ...data, imageFront: data.imageFront } }),
    prisma.productRequest.update({
      where: { id },
      data: { status: "APPROVED", reviewedAt: new Date() },
    }),
  ]);
  revalidatePath("/admin/requests");
  revalidatePath("/");
  redirect("/admin/requests");
}

// ---------- AI discovered products ----------

export async function rejectAiProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.aiDiscoveredProduct.update({
    where: { id },
    data: { status: "REJECTED", reviewedAt: new Date() },
  });
  revalidatePath("/admin/ai-queue");
}

export async function approveAiProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "aiId");
  const data = await buildProductData(formData);
  if (!data.imageFront) {
    throw new Error("Veuillez importer une image de face ou indiquer une URL.");
  }
  await prisma.$transaction([
    prisma.product.create({
      data: { ...data, imageFront: data.imageFront, isNew: true },
    }),
    prisma.aiDiscoveredProduct.update({
      where: { id },
      data: { status: "APPROVED", reviewedAt: new Date() },
    }),
  ]);
  revalidatePath("/admin/ai-queue");
  revalidatePath("/");
  redirect("/admin/ai-queue");
}

export async function runAiScanNow() {
  await requireAdmin();
  await runWeeklyAiDiscovery();
  revalidatePath("/admin/ai-queue");
}

// ---------- Users ----------

export async function updateUser(formData: FormData) {
  const session = await requireAdmin();
  const id = str(formData, "id");
  if (id === session.user.id) {
    throw new Error("Vous ne pouvez pas modifier votre propre compte depuis cet écran.");
  }
  const role = str(formData, "role");
  const plan = str(formData, "plan");
  const premiumUntilStr = str(formData, "premiumUntil");
  await prisma.user.update({
    where: { id },
    data: {
      name: str(formData, "name"),
      role: role === "ADMIN" ? "ADMIN" : "USER",
      banned: formData.get("banned") === "on",
      plan: plan === "PREMIUM" ? "PREMIUM" : "FREE",
      premiumUntil: premiumUntilStr ? new Date(premiumUntilStr) : null,
    },
  });
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();
  const id = str(formData, "id");
  if (id === session.user.id) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  }
  await prisma.productRating.deleteMany({ where: { userId: id } });
  await prisma.productRequest.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ---------- Meal program templates ----------

export async function createProgramTemplate(formData: FormData) {
  await requireAdmin();
  await prisma.mealProgram.create({
    data: {
      nameKo: str(formData, "nameKo"),
      descriptionKo: str(formData, "descriptionKo") || null,
      isTemplate: true,
    },
  });
  revalidatePath("/admin/programs");
}

export async function deleteProgramTemplate(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.mealProgramItem.deleteMany({ where: { programId: id } });
  await prisma.mealProgram.delete({ where: { id } });
  revalidatePath("/admin/programs");
}

export async function addProgramTemplateItem(formData: FormData) {
  await requireAdmin();
  const programId = str(formData, "programId");
  const dayOfWeek = Number(str(formData, "dayOfWeek"));
  const mealSlot = str(formData, "mealSlot");
  const productId = str(formData, "productId");
  if (!productId) throw new Error("Veuillez sélectionner un produit.");

  await prisma.mealProgramItem.create({
    data: {
      programId,
      dayOfWeek,
      mealSlot: mealSlot as "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK",
      productId,
    },
  });
  revalidatePath("/admin/programs");
}

export async function deleteProgramTemplateItem(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.mealProgramItem.delete({ where: { id } });
  revalidatePath("/admin/programs");
}
