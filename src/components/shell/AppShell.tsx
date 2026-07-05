import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-xl md:my-0 md:border-x md:border-border">
      <TopBar />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
