"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CameraOff, ScanLine } from "lucide-react";
import type { IScannerControls } from "@zxing/browser";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "denied" | "not-found">("idle");
  const [lastCode, setLastCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        if (cancelled || !videoRef.current) return;

        setStatus("scanning");
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          async (result) => {
            if (!result || cancelled) return;
            const code = result.getText();
            if (code === lastCode) return;
            setLastCode(code);

            const res = await fetch(
              `/api/products/lookup?barcode=${encodeURIComponent(code)}`
            );
            const data = await res.json();
            if (data.found) {
              controlsRef.current?.stop();
              router.push(`/product/${data.id}`);
            } else {
              setStatus("not-found");
            }
          }
        );
        controlsRef.current = controls;
      } catch {
        if (!cancelled) setStatus("denied");
      }
    }

    start();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center px-4 py-4">
      <h1 className="mb-1 flex items-center gap-2 self-start text-xl font-extrabold text-gray-900">
        <ScanLine size={22} className="text-brand" />
        제품 스캔
      </h1>
      <p className="mb-4 self-start text-xs text-gray-500">
        제품 포장의 바코드를 카메라에 비춰주세요.
      </p>

      <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />
        {status === "scanning" && (
          <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-brand" />
        )}
        {status === "denied" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-center text-white">
            <CameraOff size={28} />
            <p className="px-6 text-sm">
              카메라 접근 권한이 필요합니다. 브라우저 설정에서 카메라 권한을
              허용해주세요.
            </p>
          </div>
        )}
      </div>

      {status === "not-found" && lastCode && (
        <div className="mt-4 w-full max-w-xs rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-sm font-semibold text-gray-800">
            등록되지 않은 제품이에요
          </p>
          <p className="mt-1 text-xs text-gray-500">바코드: {lastCode}</p>
          <Link
            href="/mypage/requests/new"
            className="mt-3 inline-block rounded-full bg-brand px-4 py-2 text-xs font-bold text-white"
          >
            제품 등록 요청하기
          </Link>
        </div>
      )}
    </div>
  );
}
