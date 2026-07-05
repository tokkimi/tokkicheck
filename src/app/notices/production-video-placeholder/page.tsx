import Link from "next/link";
import { ChevronLeft, PlayCircle } from "lucide-react";

export default function ProductionVideoPlaceholderPage() {
  return (
    <div className="px-4 py-4">
      <Link
        href="/"
        className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={20} />
      </Link>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-6 py-10 text-center">
        <PlayCircle size={40} className="text-brand" />
        <h1 className="text-lg font-extrabold text-gray-900">
          제조 공정 영상 (샘플 안내)
        </h1>
        <p className="text-sm leading-relaxed text-gray-600">
          실제 서비스에서는 이 배너를 클릭하면 관리자가 등록한 실제 제조
          공정 문제를 다루는 영상(뉴스 보도, 현장 영상 등)으로 연결됩니다.
          <br />
          현재는 데모 데이터이므로 안내 페이지가 표시됩니다.
        </p>
        <p className="text-xs text-gray-400">
          관리자 페이지의 제조 안전 관리 메뉴에서 실제 영상 URL을 등록할 수
          있습니다.
        </p>
      </div>
    </div>
  );
}
