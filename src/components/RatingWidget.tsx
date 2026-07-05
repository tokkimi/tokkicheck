"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import Link from "next/link";

export function RatingWidget({
  productId,
  initialAvg,
  initialCount,
}: {
  productId: string;
  initialAvg: number;
  initialCount: number;
}) {
  const { data: session } = useSession();
  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);
  const [myScore, setMyScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(score: number) {
    if (!session) return;
    setSubmitting(true);
    setMyScore(score);
    try {
      const res = await fetch(`/api/products/${productId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });
      if (res.ok) {
        const data = await res.json();
        setAvg(data.ratingAvg);
        setCount(data.ratingCount);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star size={18} className="fill-amber-400 text-amber-400" />
          <span className="text-lg font-extrabold">{avg.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({count}명 참여)</span>
        </div>
      </div>
      {session ? (
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              disabled={submitting}
              onClick={() => submit(n)}
              aria-label={`${n}점`}
              className="disabled:opacity-50"
            >
              <Star
                size={26}
                className={
                  myScore && n <= myScore
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          <span className="ml-2 text-xs text-gray-400">별점 남기기</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-500">
          <Link href="/login" className="font-semibold text-brand-dark">
            로그인
          </Link>{" "}
          후 별점을 남길 수 있어요.
        </p>
      )}
    </div>
  );
}
