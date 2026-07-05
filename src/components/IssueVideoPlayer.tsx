"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayCircle, X } from "lucide-react";
import { getVideoKind, getEmbedSrc } from "@/lib/videoEmbed";

export function IssueVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const [open, setOpen] = useState(false);
  const kind = getVideoKind(videoUrl);

  // 내부 경로(데모 안내 페이지 등)는 앱 안에서 그대로 이동합니다.
  if (kind === "internal") {
    return (
      <Link
        href={videoUrl}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-xs font-bold text-white"
      >
        <PlayCircle size={14} />
        제조 공정 영상 보기
      </Link>
    );
  }

  // 유튜브/비메오/직접 영상 파일은 외부로 이동하지 않고 화면 안에서 바로 재생합니다.
  if (kind === "youtube" || kind === "vimeo" || kind === "file") {
    if (!open) {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-xs font-bold text-white"
        >
          <PlayCircle size={14} />
          제조 공정 영상 보기
        </button>
      );
    }
    const embedSrc = kind === "file" ? null : getEmbedSrc(videoUrl);
    return (
      <div className="mt-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          {kind === "file" ? (
            <video src={videoUrl} controls autoPlay className="h-full w-full" />
          ) : embedSrc ? (
            <iframe
              src={embedSrc}
              title="제조 공정 영상"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-gray-600"
        >
          <X size={14} />
          영상 닫기
        </button>
      </div>
    );
  }

  // 임베드가 불가능한 일반 외부 링크만 새 탭으로 엽니다.
  return (
    <Link
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-xs font-bold text-white"
    >
      <PlayCircle size={14} />
      제조 공정 영상 보기
    </Link>
  );
}
