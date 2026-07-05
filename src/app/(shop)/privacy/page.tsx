import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "개인정보처리방침 | 톡키체크" };

export default function PrivacyPage() {
  return (
    <div className="px-4 py-4">
      <Link
        href="/mypage"
        className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={20} />
      </Link>
      <h1 className="mb-4 text-xl font-extrabold text-gray-900">
        개인정보처리방침
      </h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-gray-700">
        <Section title="1. 수집하는 개인정보 항목">
          회원가입 시 이름, 이메일 주소, 비밀번호(암호화 저장)를 수집합니다.
          제품 등록 요청 시 이용자가 업로드한 제품 사진이 함께 저장됩니다.
        </Section>
        <Section title="2. 개인정보의 수집 및 이용 목적">
          회원 식별 및 로그인, 제품 등록 요청 처리 및 검수, 부정 이용 방지를
          위한 접근 로그(IP) 확인 목적으로 이용합니다.
        </Section>
        <Section title="3. 개인정보의 보유 및 이용 기간">
          회원 탈퇴 시 관련 법령에 따라 보관이 필요한 경우를 제외하고 지체
          없이 파기합니다.
        </Section>
        <Section title="4. 개인정보의 제3자 제공">
          이용자의 개인정보는 원칙적으로 외부에 제공하지 않으며, 법령에 근거가
          있거나 이용자의 동의가 있는 경우에 한하여 제공될 수 있습니다.
        </Section>
        <Section title="5. 비밀번호 및 계정 보안">
          비밀번호는 복호화가 불가능한 방식(단방향 암호화)으로 저장되며,
          로그인 시도는 비정상적인 반복 요청을 방지하기 위해 횟수가 제한될 수
          있습니다.
        </Section>
        <Section title="6. 이용자의 권리">
          이용자는 언제든지 마이페이지를 통해 본인의 등록 요청 내역을 조회할
          수 있으며, 계정 삭제 등 개인정보 처리 관련 문의는 운영자에게 요청할
          수 있습니다.
        </Section>
        <Section title="7. 관리자의 개인정보 접근">
          서비스 운영을 위해 관리자는 등록 요청 검수, 신고 처리, 부정 이용 방지
          목적으로만 최소한의 회원 정보에 접근하며, 이 목적을 벗어나 이용하지
          않습니다.
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
