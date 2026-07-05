import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { NewRequestForm } from "@/components/NewRequestForm";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function NewProductRequestPage() {
  await requireUser("/mypage/requests/new");
  const categories = await getCategories();

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-extrabold text-gray-900">
          제품 등록 요청
        </h1>
      </div>
      <p className="mb-4 text-xs text-gray-500">
        새로 발견한 제품을 등록해주세요. 관리자 검토 후 목록에 게시됩니다.
      </p>
      <NewRequestForm categories={categories} />
    </div>
  );
}
