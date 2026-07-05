"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-gray-600"
    >
      <LogOut size={14} />
      로그아웃
    </button>
  );
}
