"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export function FavoriteButton({
  productId,
  initialFavorited,
  size = 16,
  className = "",
}: {
  productId: string;
  initialFavorited: boolean;
  size?: number;
  className?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push("/login");
      return;
    }
    if (pending) return;
    setPending(true);
    const next = !favorited;
    setFavorited(next);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) setFavorited(!next);
      else {
        const data = await res.json();
        setFavorited(data.favorited);
      }
    } catch {
      setFavorited(!next);
    } finally {
      setPending(false);
      router.refresh();
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={favorited}
      className={`flex items-center justify-center rounded-full transition-colors ${className}`}
    >
      <Heart
        size={size}
        className={favorited ? "fill-danger text-danger" : "text-gray-400"}
      />
    </button>
  );
}
