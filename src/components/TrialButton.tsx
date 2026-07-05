"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TrialButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/premium/trial", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "시작할 수 없습니다.");
      return;
    }
    router.push("/mypage");
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-sm font-bold text-white shadow-sm disabled:opacity-60"
      >
        {loading ? "시작하는 중..." : "7일 무료 체험 시작하기"}
      </button>
      {error && <p className="mt-2 text-center text-xs text-danger">{error}</p>}
    </div>
  );
}
