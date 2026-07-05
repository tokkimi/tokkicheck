"use client";

import { useRouter } from "next/navigation";

export function MarkAllReadButton() {
  const router = useRouter();

  async function markAll() {
    await fetch("/api/notifications/mark-all-read", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={markAll}
      className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand-dark"
    >
      모두 읽음 처리
    </button>
  );
}
