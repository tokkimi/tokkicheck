import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "이용약관 | 톡키체크" };

export default function TermsPage() {
  return (
    <div className="px-4 py-4">
      <Link
        href="/mypage"
        className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={20} />
      </Link>
      <h1 className="mb-4 text-xl font-extrabold text-gray-900">이용약관</h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-gray-700">
        <Section title="제1조 (목적)">
          이 약관은 톡키체크(이하 &quot;서비스&quot;)가 제공하는 식품 성분·제조
          정보 조회 서비스의 이용조건 및 절차, 이용자와 서비스 운영자의
          권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </Section>
        <Section title="제2조 (서비스의 내용)">
          서비스는 대한민국에서 판매되는 식품의 제조국, 칼로리, 성분,
          알레르기 정보 및 제조 안전 관련 공개 정보를 제공하며, 이용자는
          제품 등록을 요청할 수 있습니다. 서비스가 제공하는 정보는 참고용이며,
          최종적인 성분·안전 확인은 제품 실물 포장의 표기 사항을 우선합니다.
        </Section>
        <Section title="제3조 (회원가입 및 계정)">
          이용자는 정확한 정보로 회원가입을 해야 하며, 계정 정보 관리 책임은
          이용자 본인에게 있습니다. 타인의 정보를 도용하거나 허위 정보를
          등록해서는 안 됩니다.
        </Section>
        <Section title="제4조 (이용자의 의무)">
          이용자는 제품 등록 요청 시 허위 사실을 기재하거나 타인의 지식재산권을
          침해하는 콘텐츠를 게시해서는 안 됩니다. 이를 위반하여 발생하는
          책임은 이용자 본인에게 있습니다.
        </Section>
        <Section title="제5조 (제조 안전 정보에 관한 고지)">
          서비스에서 제공하는 제조 안전 주의 정보는 공개된 보도자료, 정부
          발표, 제보 등을 바탕으로 하며, 관련 사실관계가 변경되거나 확인될
          경우 사전 고지 없이 수정·삭제될 수 있습니다.
        </Section>
        <Section title="제6조 (서비스 운영자의 권리)">
          운영자는 부정확하거나 검증되지 않은 등록 요청을 반려할 수 있으며,
          서비스 품질 향상을 위해 언제든지 서비스 내용을 변경할 수 있습니다.
        </Section>
        <Section title="제7조 (면책)">
          운영자는 이용자가 서비스에서 제공하는 정보를 신뢰하여 발생한
          손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
        </Section>
        <p className="text-xs text-gray-400">시행일: 2026년 7월 5일</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-1 text-sm font-bold text-gray-900">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
