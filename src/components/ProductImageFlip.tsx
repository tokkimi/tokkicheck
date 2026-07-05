"use client";

import { useState } from "react";

export function ProductImageFlip({
  front,
  back,
  alt,
}: {
  front: string;
  back: string | null;
  alt: string;
}) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={side === "front" ? front : back ?? front}
          alt={`${alt} ${side === "front" ? "정면" : "후면"}`}
          className="h-full w-full object-contain p-4"
        />
      </div>
      {back && (
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => setSide("front")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              side === "front"
                ? "bg-brand text-white"
                : "bg-surface text-gray-500 border border-border"
            }`}
          >
            정면
          </button>
          <button
            onClick={() => setSide("back")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              side === "back"
                ? "bg-brand text-white"
                : "bg-surface text-gray-500 border border-border"
            }`}
          >
            후면 (영양성분)
          </button>
        </div>
      )}
    </div>
  );
}
