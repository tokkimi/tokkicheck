# 톡키체크 (tokkicheck)

대한민국에서 판매되는 식품을 카테고리별로 정리하고, 제조국·칼로리·성분·제조
안전 정보를 확인할 수 있는 앱 형태의 웹서비스입니다.

## 스택

- **Next.js 16** (App Router, Turbopack, Server Actions) + TypeScript
- **Tailwind CSS v4**
- **Prisma 7** + SQLite (`better-sqlite3` 드라이버 어댑터) — 운영 환경에서는
  Postgres 등으로 쉽게 교체 가능 (`prisma/schema.prisma`의 `datasource`와
  `src/lib/prisma.ts`의 어댑터만 교체)
- **Auth.js (NextAuth v5)** — 이메일/비밀번호 로그인, JWT 세션, 역할 기반 접근
  제어(USER/ADMIN)
- **@zxing/browser** — 카메라 바코드 스캔
- **lucide-react** — 아이콘

## 시작하기

```bash
npm install
npx prisma migrate dev   # 최초 1회: DB 생성 + 마이그레이션
npm run db:seed          # 데모 카테고리/제품/계정 시딩
npm run dev
```

`.env` 파일에 다음 값이 필요합니다 (로컬 개발용 기본값은 이미 채워져 있음):

```
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="..."          # openssl rand -base64 32 로 생성 권장
NEXTAUTH_URL="http://localhost:3000"
CRON_SECRET="..."          # 주간 AI 스캔 엔드포인트 보호용
ANTHROPIC_API_KEY="..."    # (선택) 주간 AI 신상품 스캔에 사용, 없으면 스캔은 안전하게 스킵됨
```

### 데모 계정

- 관리자: `admin@tokkicheck.kr` / `Admin1234!`
- 일반 사용자: `user@tokkicheck.kr` / `User1234!`

## 주요 기능

- 카테고리별 제품 목록, 신상품 섹션, 인기 랭킹, 검색
- 제품 상세: 정면/후면(영양성분표) 이미지 전환, 칼로리·탄단지·나트륨·원재료·
  알레르기 정보, 평점
- **제조 안전 주의 배너**: 특정 제품 또는 제조국 전체에 이슈 등록 가능,
  클릭 시 관련 영상으로 연결 (관리자가 실제 영상 URL 등록)
- 바코드 스캔(`/scan`): 카메라로 바코드를 읽어 제품 상세로 즉시 이동, 미등록
  제품은 등록 요청으로 안내
- 회원가입/로그인, 사용자 제품 등록 요청 → 관리자 승인 큐
- **관리자 백오피스** (`/admin`): 제품/카테고리/제조안전 이슈 CRUD, 사용자
  등록 요청 승인/반려, AI 신상품 큐 검수, 사용자 관리(역할 변경·정지·삭제)
- **주간 AI 신상품 스캔**: 매주 금요일 `/api/cron/weekly-ai-scan` 실행
  (Vercel Cron 설정은 `vercel.json` 참고). `ANTHROPIC_API_KEY`가 설정된 경우
  LLM이 후보를 제안하고, **항상 관리자 검수 큐에만 적재되며 자동 게시되지
  않습니다**. 관리자 페이지에서 "지금 스캔 실행" 버튼으로 수동 실행도 가능.
- 이용약관 / 개인정보처리방침 페이지
- 보안: bcrypt 비밀번호 해시, 레이트 리미팅(로그인/가입/요청/평점), 보안 헤더
  (CSP, X-Frame-Options 등), 관리자 라우트는 `proxy.ts` + 서버 액션 이중 검증

## 알고 있는 제약사항 (다음 단계)

- 제품 데이터는 **데모용 가상 브랜드/이미지**입니다 (`prisma/seed-data.ts`).
  실제 제품은 관리자 페이지에서 사진과 함께 직접 등록하세요.
- 제품 이미지는 실사 사진이 아닌 벡터 목업(`scripts/generate-product-art.ts`)
  입니다. 실제 서비스에서는 관리자 업로드 시 배경 제거(누끼) API 연동을
  추가하는 것을 권장합니다.
- 카메라 스캔은 **바코드 인식**입니다. 바코드가 없는 임의의 사진으로 제품을
  찾는 순수 이미지 인식은 별도의 비전 모델/임베딩 검색 구축이 필요합니다.
- 주간 AI 스캔은 `ANTHROPIC_API_KEY` 없이도 안전하게(아무 것도 추가하지
  않고) 동작하며, 실제 운영 시엔 편의점/유통사 신제품 피드 등 실데이터
  소스를 크롤링하는 파이프라인으로 교체하는 것을 권장합니다.

## 배포

Vercel 배포 시 `vercel.json`에 정의된 cron이 자동 등록됩니다. `CRON_SECRET`
환경변수를 설정하면 Vercel이 자동으로 `Authorization: Bearer <CRON_SECRET>`
헤더를 실어 보내며, 라우트 핸들러가 이를 검증합니다.
