import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}
