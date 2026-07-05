"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; nameKo: string; icon: string | null };

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function NewRequestForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [nameKo, setNameKo] = useState("");
  const [brandKo, setBrandKo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [countryNameKo, setCountryNameKo] = useState("");
  const [note, setNote] = useState("");
  const [imageFront, setImageFront] = useState<string>("");
  const [imageBack, setImageBack] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setError("이미지 용량은 1.5MB 이하로 업로드해주세요.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setter(dataUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameKo,
        brandKo,
        categoryId,
        countryNameKo,
        imageFront,
        imageBack,
        note,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "요청 등록에 실패했습니다.");
      return;
    }
    router.push("/mypage");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        required
        placeholder="제품명"
        value={nameKo}
        onChange={(e) => setNameKo(e.target.value)}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
      />
      <input
        required
        placeholder="브랜드명"
        value={brandKo}
        onChange={(e) => setBrandKo(e.target.value)}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
      >
        <option value="">카테고리 선택 (선택사항)</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.nameKo}
          </option>
        ))}
      </select>
      <input
        placeholder="제조국 (선택사항)"
        value={countryNameKo}
        onChange={(e) => setCountryNameKo(e.target.value)}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
      />

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-surface p-3 text-center text-xs text-gray-500">
          {imageFront ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageFront}
              alt="정면 사진"
              className="h-20 w-20 rounded-lg object-cover"
            />
          ) : (
            "정면 사진 업로드"
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e, setImageFront)}
          />
        </label>
        <label className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-surface p-3 text-center text-xs text-gray-500">
          {imageBack ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageBack}
              alt="후면 사진"
              className="h-20 w-20 rounded-lg object-cover"
            />
          ) : (
            "후면 사진 업로드"
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e, setImageBack)}
          />
        </label>
      </div>

      <textarea
        placeholder="추가 설명 (선택사항)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "등록 중..." : "등록 요청 보내기"}
      </button>
    </form>
  );
}
