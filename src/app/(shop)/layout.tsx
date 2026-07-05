import { AppShell } from "@/components/shell/AppShell";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
