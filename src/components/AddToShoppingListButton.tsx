"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingCart } from "lucide-react";

export function AddToShoppingListButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "added" | "premium-required">("idle");

  async function add() {
    if (!session) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/shopping-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.status === 403) {
      setState("premium-required");
      return;
    }
    if (res.ok) setState("added");
  }

  if (state === "premium-required") {
    return (
      <a
        href="/premium"
        className="flex items-center justify-center gap-1.5 rounded-2xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-semibold text-amber-700"
      >
        <ShoppingCart size={14} />
        장바구니는 프리미엄 전용이에요 · 알아보기
      </a>
    );
  }

  return (
    <button
      onClick={add}
      disabled={state === "added"}
      className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-surface py-2.5 text-xs font-semibold text-gray-600 disabled:text-brand-dark"
    >
      <ShoppingCart size={14} />
      {state === "added" ? "장바구니에 담았어요" : "장바구니에 담기"}
    </button>
  );
}
