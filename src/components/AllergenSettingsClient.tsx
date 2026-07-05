"use client";

import { useState } from "react";
import { ALLERGENS } from "@/lib/allergens";

export function AllergenSettingsClient({ initialTags }: { initialTags: string[] }) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(tag: string) {
    setSaved(false);
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/allergens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {ALLERGENS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold ${
              tags.includes(tag)
                ? "border-brand bg-brand-soft text-brand-dark"
                : "border-border bg-surface text-gray-600"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? "저장 중..." : saved ? "저장됨 ✓" : "저장하기"}
      </button>
    </div>
  );
}
