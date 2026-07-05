export function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
      {children}
    </div>
  );
}
