import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createIssue, deleteIssue } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  const [issues, countries] = await Promise.all([
    prisma.manufacturingIssue.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true, country: true },
    }),
    prisma.country.findMany({ orderBy: { nameKo: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-gray-900">제조 안전 관리</h2>
      <p className="mb-3 text-xs text-gray-500">
        특정 제품 또는 제조국 전체에 대한 안전 주의 정보를 등록합니다. 제품별
        등록은 각 제품 수정 화면에서도 가능합니다.
      </p>

      <div className="flex flex-col gap-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-2xl border border-red-200 bg-red-50 p-3"
          >
            <p className="text-sm font-bold text-red-900">{issue.titleKo}</p>
            <p className="mt-1 text-xs text-red-800">{issue.descriptionKo}</p>
            <p className="mt-1 text-xs text-gray-500">
              대상:{" "}
              {issue.product ? (
                <Link href={`/admin/products/${issue.product.id}`} className="underline">
                  {issue.product.nameKo}
                </Link>
              ) : issue.country ? (
                `${issue.country.nameKo} 전체`
              ) : (
                "미지정"
              )}
              {" · "}심각도 {issue.severity}
            </p>
            <form action={deleteIssue} className="mt-2">
              <input type="hidden" name="id" value={issue.id} />
              <button className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-danger">
                삭제
              </button>
            </form>
          </div>
        ))}
        {issues.length === 0 && (
          <p className="text-xs text-gray-400">등록된 이슈가 없습니다.</p>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-bold text-gray-900">
          제조국 단위 이슈 등록
        </h3>
        <form action={createIssue} className="flex flex-col gap-2">
          <select name="countryId" required className="input">
            <option value="">제조국 선택</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameKo}
              </option>
            ))}
          </select>
          <input name="titleKo" required placeholder="이슈 제목" className="input" />
          <textarea name="descriptionKo" required rows={2} placeholder="상세 설명" className="input" />
          <input name="videoUrl" required placeholder="영상 URL 또는 내부 경로" className="input" />
          <input name="sourceUrl" placeholder="출처 URL (선택)" className="input" />
          <select name="severity" defaultValue="1" className="input">
            <option value="1">경미</option>
            <option value="2">주의</option>
            <option value="3">심각</option>
          </select>
          <button className="rounded-xl bg-danger py-2.5 text-sm font-bold text-white">
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
