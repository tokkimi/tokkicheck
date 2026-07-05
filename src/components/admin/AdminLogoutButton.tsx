"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminLogoutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={
        className ??
        "flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-black/5"
      }
    >
      <LogOut size={14} />
      Déconnexion
    </button>
  );
}
