import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-xl md:max-w-none md:shadow-none">
      <TopBar />
      <main className="mx-auto w-full max-w-md flex-1 md:max-w-6xl">{children}</main>
      <BottomNav />
    </div>
  );
}
