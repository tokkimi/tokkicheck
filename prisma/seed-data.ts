// 시딩용 데이터입니다. 앞부분(가상 브랜드)은 기능 데모용이며, 아래
// realProducts 배열은 공개된 자료를 바탕으로 조사한 실제 브랜드/제품명을
// 사용합니다. 단, 실사 이미지 대신 벡터 목업 이미지를 사용하고, 영양성분은
// 정밀 계측치가 아닌 공개 정보 기반의 근사치이므로 관리자 페이지에서 실제
// 라벨과 대조해 검증 후 사용해야 합니다. 제조 안전 이슈는 실제 브랜드에는
// 절대 연결하지 않습니다(가상 브랜드에만 존재).

export type CategoryDef = {
  slug: string;
  nameKo: string;
  icon: string;
  order: number;
};

export const categories: CategoryDef[] = [
  { slug: "snack", nameKo: "스낵·과자", icon: "🍪", order: 1 },
  { slug: "ramen", nameKo: "라면·면류", icon: "🍜", order: 2 },
  { slug: "beverage", nameKo: "음료", icon: "🥤", order: 3 },
  { slug: "dairy", nameKo: "유제품", icon: "🥛", order: 4 },
  { slug: "frozen", nameKo: "냉동식품", icon: "🧊", order: 5 },
  { slug: "bakery", nameKo: "빵·베이커리", icon: "🥐", order: 6 },
  { slug: "icecream", nameKo: "아이스크림", icon: "🍦", order: 7 },
  { slug: "sauce", nameKo: "소스·조미료", icon: "🧂", order: 8 },
  { slug: "convenience", nameKo: "편의점 간편식", icon: "🍱", order: 9 },
  { slug: "health", nameKo: "건강기능식품", icon: "💊", order: 10 },
  { slug: "pet", nameKo: "반려동물 식품", icon: "🐾", order: 11 },
];

export type CountryDef = {
  code: string;
  nameKo: string;
};

export const countries: CountryDef[] = [
  { code: "KR", nameKo: "대한민국" },
  { code: "CN", nameKo: "중국" },
  { code: "VN", nameKo: "베트남" },
  { code: "TH", nameKo: "태국" },
  { code: "US", nameKo: "미국" },
  { code: "JP", nameKo: "일본" },
  { code: "FR", nameKo: "프랑스" },
];

export type ProductDef = {
  barcode: string;
  nameKo: string;
  brandKo: string;
  categorySlug: string;
  countryCode: string;
  calories: number;
  servingSizeG: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  sugarG: number;
  sodiumMg: number;
  ingredientsKo: string;
  allergensKo: string;
  price: number;
  isNew: boolean;
  hasIssue?: boolean;
};

export const products: ProductDef[] = [
  { barcode: "8801000000011", nameKo: "초코쿠키파이", brandKo: "달콤제과", categorySlug: "snack", countryCode: "KR", calories: 360, servingSizeG: 100, carbsG: 58, proteinG: 4.5, fatG: 13, sugarG: 32, sodiumMg: 220, ingredientsKo: "밀가루, 설탕, 코코아분말, 식물성유지, 초콜릿가공품, 계란", allergensKo: "밀, 대두, 우유, 계란 함유", price: 1500, isNew: false },
  { barcode: "8801000000028", nameKo: "매운맛 감자칩", brandKo: "바삭칩스", categorySlug: "snack", countryCode: "KR", calories: 500, servingSizeG: 100, carbsG: 52, proteinG: 6, fatG: 30, sugarG: 3, sodiumMg: 480, ingredientsKo: "감자, 식물성유지, 고추가루, 조미분말", allergensKo: "대두 함유 가능", price: 2000, isNew: false },
  { barcode: "8801000000035", nameKo: "옥수수스낵", brandKo: "고소한농장", categorySlug: "snack", countryCode: "CN", calories: 480, servingSizeG: 100, carbsG: 60, proteinG: 5, fatG: 22, sugarG: 8, sodiumMg: 390, ingredientsKo: "옥수수분, 팜유, 조미료, 색소", allergensKo: "대두 함유", price: 1200, isNew: true, hasIssue: true },
  { barcode: "8801000000042", nameKo: "버터쿠키", brandKo: "황금버터", categorySlug: "snack", countryCode: "US", calories: 520, servingSizeG: 100, carbsG: 60, proteinG: 5.5, fatG: 27, sugarG: 30, sodiumMg: 260, ingredientsKo: "밀가루, 버터, 설탕, 계란", allergensKo: "밀, 우유, 계란 함유", price: 4500, isNew: false },
  { barcode: "8801000000059", nameKo: "매콤 김치라면", brandKo: "한끼라면", categorySlug: "ramen", countryCode: "KR", calories: 505, servingSizeG: 120, carbsG: 78, proteinG: 10, fatG: 16, sugarG: 4, sodiumMg: 1790, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건조야채, 김치분말", allergensKo: "밀, 대두, 돼지고기 함유", price: 1300, isNew: false },
  { barcode: "8801000000066", nameKo: "된장 비빔면", brandKo: "촌장식탁", categorySlug: "ramen", countryCode: "KR", calories: 450, servingSizeG: 110, carbsG: 70, proteinG: 9, fatG: 12, sugarG: 6, sodiumMg: 1450, ingredientsKo: "면(밀가루), 된장분말, 참기름, 야채플레이크", allergensKo: "밀, 대두 함유", price: 1400, isNew: true },
  { barcode: "8801000000073", nameKo: "우육탕면", brandKo: "대륙식품", categorySlug: "ramen", countryCode: "CN", calories: 470, servingSizeG: 115, carbsG: 66, proteinG: 11, fatG: 18, sugarG: 3, sodiumMg: 1900, ingredientsKo: "면, 우육분말, 향신료, 팜유", allergensKo: "밀, 소고기, 대두 함유", price: 1100, isNew: false, hasIssue: true },
  { barcode: "8801000000080", nameKo: "쌀국수 컵면", brandKo: "메콩키친", categorySlug: "ramen", countryCode: "VN", calories: 380, servingSizeG: 90, carbsG: 72, proteinG: 6, fatG: 5, sugarG: 2, sodiumMg: 1350, ingredientsKo: "쌀면, 건조새우, 향신채소분말", allergensKo: "새우 함유", price: 1600, isNew: false },
  { barcode: "8801000000097", nameKo: "제로 탄산수", brandKo: "청량샘", categorySlug: "beverage", countryCode: "KR", calories: 0, servingSizeG: 250, carbsG: 0, proteinG: 0, fatG: 0, sugarG: 0, sodiumMg: 10, ingredientsKo: "탄산수, 구연산, 천연향료", allergensKo: "해당없음", price: 1000, isNew: false },
  { barcode: "8801000000103", nameKo: "복숭아 아이스티", brandKo: "티하우스", categorySlug: "beverage", countryCode: "KR", calories: 90, servingSizeG: 340, carbsG: 22, proteinG: 0, fatG: 0, sugarG: 21, sodiumMg: 15, ingredientsKo: "정제수, 설탕, 홍차추출물, 복숭아향", allergensKo: "해당없음", price: 1800, isNew: true },
  { barcode: "8801000000110", nameKo: "바나나맛 우유음료", brandKo: "목장고을", categorySlug: "dairy", countryCode: "KR", calories: 180, servingSizeG: 240, carbsG: 27, proteinG: 6, fatG: 4.5, sugarG: 26, sodiumMg: 95, ingredientsKo: "원유, 설탕, 바나나향, 정제수", allergensKo: "우유 함유", price: 1600, isNew: false },
  { barcode: "8801000000127", nameKo: "그릭 요거트", brandKo: "목장고을", categorySlug: "dairy", countryCode: "KR", calories: 120, servingSizeG: 100, carbsG: 6, proteinG: 10, fatG: 5, sugarG: 5, sodiumMg: 55, ingredientsKo: "원유, 유산균배양물", allergensKo: "우유 함유", price: 2200, isNew: false },
  { barcode: "8801000000134", nameKo: "체다치즈 슬라이스", brandKo: "황금목장", categorySlug: "dairy", countryCode: "US", calories: 330, servingSizeG: 100, carbsG: 4, proteinG: 18, fatG: 27, sugarG: 2, sodiumMg: 1120, ingredientsKo: "치즈, 유화제, 색소", allergensKo: "우유 함유", price: 5900, isNew: false },
  { barcode: "8801000000141", nameKo: "냉동 만두", brandKo: "손맛만두", categorySlug: "frozen", countryCode: "KR", calories: 260, servingSizeG: 100, carbsG: 28, proteinG: 10, fatG: 11, sugarG: 2, sodiumMg: 560, ingredientsKo: "돼지고기, 배추, 밀가루, 두부, 마늘", allergensKo: "밀, 대두, 돼지고기 함유", price: 6500, isNew: false },
  { barcode: "8801000000158", nameKo: "냉동 볶음밥", brandKo: "간편한끼", categorySlug: "frozen", countryCode: "KR", calories: 210, servingSizeG: 100, carbsG: 32, proteinG: 5, fatG: 6, sugarG: 1, sodiumMg: 480, ingredientsKo: "쌀, 계란, 야채, 참기름", allergensKo: "계란 함유", price: 4200, isNew: true },
  { barcode: "8801000000165", nameKo: "냉동 새우튀김", brandKo: "바다별미", categorySlug: "frozen", countryCode: "VN", calories: 240, servingSizeG: 100, carbsG: 20, proteinG: 12, fatG: 12, sugarG: 1, sodiumMg: 390, ingredientsKo: "새우, 튀김옷(밀가루, 전분), 식물성유", allergensKo: "새우, 밀 함유", price: 7900, isNew: false, hasIssue: true },
  { barcode: "8801000000172", nameKo: "우유 식빵", brandKo: "아침빵집", categorySlug: "bakery", countryCode: "KR", calories: 265, servingSizeG: 100, carbsG: 48, proteinG: 9, fatG: 4, sugarG: 6, sodiumMg: 420, ingredientsKo: "밀가루, 우유, 설탕, 이스트", allergensKo: "밀, 우유 함유", price: 3200, isNew: false },
  { barcode: "8801000000189", nameKo: "소보로빵", brandKo: "아침빵집", categorySlug: "bakery", countryCode: "KR", calories: 340, servingSizeG: 100, carbsG: 50, proteinG: 6, fatG: 13, sugarG: 20, sodiumMg: 260, ingredientsKo: "밀가루, 설탕, 버터, 계란", allergensKo: "밀, 우유, 계란 함유", price: 2000, isNew: true },
  { barcode: "8801000000196", nameKo: "바닐라 아이스크림", brandKo: "설빙목장", categorySlug: "icecream", countryCode: "KR", calories: 207, servingSizeG: 100, carbsG: 24, proteinG: 3.5, fatG: 11, sugarG: 21, sodiumMg: 65, ingredientsKo: "원유, 설탕, 바닐라향", allergensKo: "우유 함유", price: 5500, isNew: false },
  { barcode: "8801000000202", nameKo: "초코바 아이스크림", brandKo: "달콤공장", categorySlug: "icecream", countryCode: "KR", calories: 260, servingSizeG: 80, carbsG: 27, proteinG: 3, fatG: 15, sugarG: 22, sodiumMg: 55, ingredientsKo: "원유, 코코아가공품, 설탕, 식물성유지", allergensKo: "우유, 대두 함유", price: 1500, isNew: false },
  { barcode: "8801000000219", nameKo: "고추장", brandKo: "전통장맛", categorySlug: "sauce", countryCode: "KR", calories: 220, servingSizeG: 100, carbsG: 45, proteinG: 4, fatG: 1, sugarG: 20, sodiumMg: 2100, ingredientsKo: "고춧가루, 찹쌀, 메주가루, 물엿", allergensKo: "대두 함유", price: 6800, isNew: false },
  { barcode: "8801000000226", nameKo: "굴소스", brandKo: "대양수산", categorySlug: "sauce", countryCode: "CN", calories: 90, servingSizeG: 100, carbsG: 18, proteinG: 3, fatG: 0.5, sugarG: 12, sodiumMg: 2900, ingredientsKo: "굴추출물, 설탕, 전분, 캐러멜색소", allergensKo: "굴(조개류) 함유", price: 3500, isNew: false, hasIssue: true },
  { barcode: "8801000000233", nameKo: "스리라차 소스", brandKo: "칠리팜", categorySlug: "sauce", countryCode: "TH", calories: 100, servingSizeG: 100, carbsG: 20, proteinG: 2, fatG: 0.5, sugarG: 15, sodiumMg: 1400, ingredientsKo: "고추, 마늘, 식초, 설탕", allergensKo: "해당없음", price: 4200, isNew: true },
  { barcode: "8801000000240", nameKo: "삼각김밥 참치마요", brandKo: "든든한끼", categorySlug: "convenience", countryCode: "KR", calories: 220, servingSizeG: 110, carbsG: 32, proteinG: 6, fatG: 7, sugarG: 2, sodiumMg: 430, ingredientsKo: "쌀, 참치, 마요네즈, 김", allergensKo: "계란, 대두, 참치 함유", price: 1600, isNew: true },
  { barcode: "8801000000257", nameKo: "도시락 제육볶음", brandKo: "든든한끼", categorySlug: "convenience", countryCode: "KR", calories: 620, servingSizeG: 350, carbsG: 70, proteinG: 22, fatG: 24, sugarG: 8, sodiumMg: 980, ingredientsKo: "쌀, 돼지고기, 고추장양념, 야채", allergensKo: "대두, 돼지고기 함유", price: 5500, isNew: false },
  { barcode: "8801000000264", nameKo: "샌드위치 에그마요", brandKo: "모닝델리", categorySlug: "convenience", countryCode: "KR", calories: 350, servingSizeG: 150, carbsG: 34, proteinG: 12, fatG: 18, sugarG: 4, sodiumMg: 520, ingredientsKo: "식빵, 계란, 마요네즈, 야채", allergensKo: "밀, 계란, 대두 함유", price: 3200, isNew: true },
  { barcode: "8801000000271", nameKo: "단백질 프로틴바", brandKo: "헬스랩", categorySlug: "health", countryCode: "US", calories: 200, servingSizeG: 60, carbsG: 20, proteinG: 20, fatG: 6, sugarG: 4, sodiumMg: 190, ingredientsKo: "유청단백분말, 아몬드, 대체당", allergensKo: "우유, 대두, 아몬드 함유", price: 3800, isNew: false },
  { barcode: "8801000000288", nameKo: "홍삼 스틱", brandKo: "고려산삼원", categorySlug: "health", countryCode: "KR", calories: 30, servingSizeG: 10, carbsG: 6, proteinG: 0.5, fatG: 0, sugarG: 4, sodiumMg: 5, ingredientsKo: "홍삼농축액, 정제수, 올리고당", allergensKo: "해당없음", price: 45000, isNew: true },
  { barcode: "8801000000295", nameKo: "멀티비타민 젤리", brandKo: "데일리케어", categorySlug: "health", countryCode: "JP", calories: 15, servingSizeG: 5, carbsG: 3.5, proteinG: 0, fatG: 0, sugarG: 2, sodiumMg: 2, ingredientsKo: "젤라틴, 비타민혼합물, 과즙농축액", allergensKo: "돼지고기(젤라틴) 함유", price: 12000, isNew: false },

  // 아래부터는 실제 시판 브랜드/제품명을 사용한 데이터입니다. 영양성분은 공개
  // 정보 기반 근사치이며, 제조 안전 이슈(hasIssue)는 절대 부여하지 않습니다.
  { barcode: "8801000001001", nameKo: "신라면", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 500, servingSizeG: 120, carbsG: 79, proteinG: 10, fatG: 16, sugarG: 4, sodiumMg: 1790, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건조야채, 고춧가루", allergensKo: "밀, 대두, 소고기 함유", price: 950, isNew: false },
  { barcode: "8801000001018", nameKo: "불닭볶음면", brandKo: "삼양식품", categorySlug: "ramen", countryCode: "KR", calories: 530, servingSizeG: 140, carbsG: 82, proteinG: 9, fatG: 16, sugarG: 6, sodiumMg: 1400, ingredientsKo: "면(밀가루, 팜유), 볶음소스, 고추분말, 마늘분말", allergensKo: "밀, 대두 함유", price: 1350, isNew: true },
  { barcode: "8801000001025", nameKo: "진라면 매운맛", brandKo: "오뚜기", categorySlug: "ramen", countryCode: "KR", calories: 500, servingSizeG: 120, carbsG: 78, proteinG: 9, fatG: 15, sugarG: 3, sodiumMg: 1600, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건조야채", allergensKo: "밀, 대두 함유", price: 900, isNew: false },
  { barcode: "8801000001032", nameKo: "팔도비빔면", brandKo: "팔도", categorySlug: "ramen", countryCode: "KR", calories: 470, servingSizeG: 120, carbsG: 73, proteinG: 9, fatG: 13, sugarG: 15, sodiumMg: 1450, ingredientsKo: "면(밀가루), 비빔장, 참기름, 야채플레이크", allergensKo: "밀, 대두 함유", price: 1000, isNew: false },
  { barcode: "8801000001049", nameKo: "안성탕면", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 505, servingSizeG: 125, carbsG: 79, proteinG: 10, fatG: 16, sugarG: 3, sodiumMg: 1790, ingredientsKo: "면(밀가루, 팜유), 된장분말스프, 건조야채", allergensKo: "밀, 대두 함유", price: 950, isNew: false },
  { barcode: "8801000001056", nameKo: "새우깡", brandKo: "농심", categorySlug: "snack", countryCode: "KR", calories: 450, servingSizeG: 100, carbsG: 64, proteinG: 8, fatG: 17, sugarG: 6, sodiumMg: 850, ingredientsKo: "밀가루, 새우, 팜유, 정제염", allergensKo: "밀, 새우, 대두 함유", price: 1700, isNew: false },
  { barcode: "8801000001063", nameKo: "초코파이", brandKo: "오리온", categorySlug: "snack", countryCode: "KR", calories: 295, servingSizeG: 100, carbsG: 47, proteinG: 4, fatG: 10, sugarG: 28, sodiumMg: 135, ingredientsKo: "밀가루, 설탕, 초콜릿가공품, 마시멜로, 계란", allergensKo: "밀, 대두, 우유, 계란 함유", price: 4500, isNew: false },
  { barcode: "8801000001070", nameKo: "포카칩 오리지널", brandKo: "오리온", categorySlug: "snack", countryCode: "KR", calories: 536, servingSizeG: 100, carbsG: 54, proteinG: 6, fatG: 33, sugarG: 3, sodiumMg: 450, ingredientsKo: "감자, 식물성유지, 정제염", allergensKo: "해당없음", price: 2100, isNew: false },
  { barcode: "8801000001087", nameKo: "허니버터칩", brandKo: "해태제과", categorySlug: "snack", countryCode: "KR", calories: 501, servingSizeG: 100, carbsG: 57, proteinG: 5.5, fatG: 28, sugarG: 14, sodiumMg: 380, ingredientsKo: "감자, 식물성유지, 벌꿀분말, 버터향", allergensKo: "우유 함유", price: 1900, isNew: true },
  { barcode: "8801000001094", nameKo: "꼬깔콘 고소한맛", brandKo: "롯데웰푸드", categorySlug: "snack", countryCode: "KR", calories: 500, servingSizeG: 100, carbsG: 64, proteinG: 5, fatG: 24, sugarG: 12, sodiumMg: 320, ingredientsKo: "옥수수분, 식물성유지, 설탕", allergensKo: "대두 함유", price: 1700, isNew: false },
  { barcode: "8801000001100", nameKo: "코카콜라", brandKo: "코카콜라", categorySlug: "beverage", countryCode: "KR", calories: 150, servingSizeG: 355, carbsG: 39, proteinG: 0, fatG: 0, sugarG: 39, sodiumMg: 15, ingredientsKo: "정제수, 설탕, 이산화탄소, 카라멜색소, 인산, 카페인", allergensKo: "해당없음", price: 2000, isNew: false },
  { barcode: "8801000001117", nameKo: "칠성사이다", brandKo: "롯데칠성음료", categorySlug: "beverage", countryCode: "KR", calories: 95, servingSizeG: 250, carbsG: 24, proteinG: 0, fatG: 0, sugarG: 24, sodiumMg: 10, ingredientsKo: "정제수, 설탕, 탄산가스, 구연산", allergensKo: "해당없음", price: 1500, isNew: false },
  { barcode: "8801000001124", nameKo: "비타500", brandKo: "광동제약", categorySlug: "beverage", countryCode: "KR", calories: 63, servingSizeG: 100, carbsG: 15, proteinG: 0, fatG: 0, sugarG: 14, sodiumMg: 10, ingredientsKo: "정제수, 비타민C, 과당, 구연산", allergensKo: "해당없음", price: 1000, isNew: false },
  { barcode: "8801000001131", nameKo: "게토레이", brandKo: "게토레이", categorySlug: "beverage", countryCode: "US", calories: 130, servingSizeG: 500, carbsG: 32, proteinG: 0, fatG: 0, sugarG: 31, sodiumMg: 230, ingredientsKo: "정제수, 설탕, 구연산, 전해질(나트륨, 칼륨)", allergensKo: "해당없음", price: 2000, isNew: false },
  { barcode: "8801000001148", nameKo: "서울우유", brandKo: "서울우유협동조합", categorySlug: "dairy", countryCode: "KR", calories: 130, servingSizeG: 200, carbsG: 9, proteinG: 6.5, fatG: 7, sugarG: 9, sodiumMg: 95, ingredientsKo: "원유 100%", allergensKo: "우유 함유", price: 1900, isNew: false },
  { barcode: "8801000001155", nameKo: "바나나맛우유", brandKo: "빙그레", categorySlug: "dairy", countryCode: "KR", calories: 190, servingSizeG: 240, carbsG: 30, proteinG: 5, fatG: 4.5, sugarG: 29, sodiumMg: 85, ingredientsKo: "원유, 설탕, 바나나향, 정제수", allergensKo: "우유 함유", price: 1700, isNew: false },
  { barcode: "8801000001162", nameKo: "상하치즈", brandKo: "매일유업", categorySlug: "dairy", countryCode: "KR", calories: 330, servingSizeG: 100, carbsG: 2, proteinG: 20, fatG: 27, sugarG: 1, sodiumMg: 1000, ingredientsKo: "자연치즈, 유화제", allergensKo: "우유 함유", price: 6900, isNew: true },
  { barcode: "8801000001179", nameKo: "메로나", brandKo: "빙그레", categorySlug: "icecream", countryCode: "KR", calories: 160, servingSizeG: 80, carbsG: 33, proteinG: 1, fatG: 2.5, sugarG: 26, sodiumMg: 20, ingredientsKo: "정제수, 설탕, 멜론농축액, 크림", allergensKo: "우유 함유", price: 1200, isNew: false },
  { barcode: "8801000001186", nameKo: "부라보콘", brandKo: "해태제과", categorySlug: "icecream", countryCode: "KR", calories: 220, servingSizeG: 100, carbsG: 28, proteinG: 3, fatG: 10, sugarG: 20, sodiumMg: 70, ingredientsKo: "원유, 땅콩, 초콜릿가공품, 웨하스", allergensKo: "우유, 땅콩, 밀 함유", price: 1800, isNew: false },
  { barcode: "8801000001193", nameKo: "죠스바", brandKo: "롯데웰푸드", categorySlug: "icecream", countryCode: "KR", calories: 90, servingSizeG: 80, carbsG: 21, proteinG: 0.5, fatG: 0.5, sugarG: 18, sodiumMg: 15, ingredientsKo: "정제수, 설탕, 사과농축액, 포도농축액", allergensKo: "해당없음", price: 700, isNew: false },
  { barcode: "8801000001209", nameKo: "삼립 호빵", brandKo: "SPC삼립", categorySlug: "bakery", countryCode: "KR", calories: 220, servingSizeG: 90, carbsG: 42, proteinG: 6, fatG: 3, sugarG: 12, sodiumMg: 250, ingredientsKo: "밀가루, 팥앙금, 설탕, 이스트", allergensKo: "밀 함유", price: 1500, isNew: false },
  { barcode: "8801000001216", nameKo: "삼립 크림빵", brandKo: "SPC삼립", categorySlug: "bakery", countryCode: "KR", calories: 260, servingSizeG: 80, carbsG: 38, proteinG: 5, fatG: 9, sugarG: 15, sodiumMg: 220, ingredientsKo: "밀가루, 크림, 설탕, 계란", allergensKo: "밀, 우유, 계란 함유", price: 1600, isNew: true },
  { barcode: "8801000001223", nameKo: "비비고 왕교자", brandKo: "CJ제일제당", categorySlug: "frozen", countryCode: "KR", calories: 250, servingSizeG: 100, carbsG: 27, proteinG: 9, fatG: 11, sugarG: 1, sodiumMg: 500, ingredientsKo: "돼지고기, 배추, 두부, 밀가루, 마늘", allergensKo: "밀, 대두, 돼지고기 함유", price: 7900, isNew: true },
  { barcode: "8801000001230", nameKo: "풀무원 만두", brandKo: "풀무원", categorySlug: "frozen", countryCode: "KR", calories: 240, servingSizeG: 100, carbsG: 26, proteinG: 9, fatG: 10, sugarG: 1, sodiumMg: 480, ingredientsKo: "돼지고기, 부추, 당면, 밀가루", allergensKo: "밀, 대두, 돼지고기 함유", price: 6900, isNew: false },
  { barcode: "8801000001247", nameKo: "햇반", brandKo: "CJ제일제당", categorySlug: "convenience", countryCode: "KR", calories: 310, servingSizeG: 210, carbsG: 68, proteinG: 5, fatG: 0.5, sugarG: 0, sodiumMg: 5, ingredientsKo: "쌀 100%", allergensKo: "해당없음", price: 1500, isNew: false },
  { barcode: "8801000001254", nameKo: "오뚜기 케찹", brandKo: "오뚜기", categorySlug: "sauce", countryCode: "KR", calories: 110, servingSizeG: 100, carbsG: 27, proteinG: 1, fatG: 0.2, sugarG: 23, sodiumMg: 950, ingredientsKo: "토마토농축물, 설탕, 식초, 정제염", allergensKo: "토마토 함유", price: 3200, isNew: false },
  { barcode: "8801000001261", nameKo: "백설 고추장", brandKo: "CJ제일제당", categorySlug: "sauce", countryCode: "KR", calories: 215, servingSizeG: 100, carbsG: 45, proteinG: 4, fatG: 1, sugarG: 18, sodiumMg: 2000, ingredientsKo: "고춧가루, 찹쌀, 메주가루, 물엿", allergensKo: "대두 함유", price: 5900, isNew: false },
  { barcode: "8801000001278", nameKo: "청정원 마요네즈", brandKo: "대상", categorySlug: "sauce", countryCode: "KR", calories: 680, servingSizeG: 100, carbsG: 3, proteinG: 1, fatG: 75, sugarG: 2, sodiumMg: 520, ingredientsKo: "식용유, 계란노른자, 식초, 정제염", allergensKo: "계란 함유", price: 4800, isNew: true },
  { barcode: "8801000001285", nameKo: "정관장 홍삼정", brandKo: "KGC인삼공사", categorySlug: "health", countryCode: "KR", calories: 90, servingSizeG: 30, carbsG: 20, proteinG: 1, fatG: 0, sugarG: 15, sodiumMg: 5, ingredientsKo: "6년근 홍삼농축액", allergensKo: "해당없음", price: 89000, isNew: false },
  { barcode: "8801000001292", nameKo: "락토핏 골드", brandKo: "종근당건강", categorySlug: "health", countryCode: "KR", calories: 6, servingSizeG: 2, carbsG: 1.2, proteinG: 0.3, fatG: 0, sugarG: 0.5, sodiumMg: 2, ingredientsKo: "프락토올리고당, 유산균분말", allergensKo: "우유 함유 가능", price: 32000, isNew: true },
  { barcode: "8801000001308", nameKo: "로얄캐닌 어덜트 독푸드", brandKo: "로얄캐닌", categorySlug: "pet", countryCode: "FR", calories: 365, servingSizeG: 100, carbsG: 40, proteinG: 25, fatG: 15, sugarG: 2, sodiumMg: 300, ingredientsKo: "닭고기, 쌀, 옥수수, 동물성지방", allergensKo: "닭고기 함유", price: 68000, isNew: true },
  { barcode: "8801000001315", nameKo: "로얄캐닌 어덜트 캣푸드", brandKo: "로얄캐닌", categorySlug: "pet", countryCode: "FR", calories: 380, servingSizeG: 100, carbsG: 33, proteinG: 32, fatG: 18, sugarG: 1, sodiumMg: 350, ingredientsKo: "닭고기, 어분, 쌀, 동물성지방", allergensKo: "닭고기 함유", price: 39000, isNew: true },
  { barcode: "8801000001322", nameKo: "네츄럴코어 반려동물 트릿", brandKo: "네츄럴코어", categorySlug: "pet", countryCode: "KR", calories: 250, servingSizeG: 100, carbsG: 10, proteinG: 45, fatG: 8, sugarG: 3, sodiumMg: 400, ingredientsKo: "닭가슴살, 고구마, 글리세린", allergensKo: "닭고기 함유", price: 8900, isNew: false },
  { barcode: "8801000001339", nameKo: "우리와 캣푸드", brandKo: "우리와", categorySlug: "pet", countryCode: "KR", calories: 70, servingSizeG: 80, carbsG: 2, proteinG: 10, fatG: 3, sugarG: 0.5, sodiumMg: 150, ingredientsKo: "참치, 닭고기, 정제수", allergensKo: "닭고기, 참치 함유", price: 2500, isNew: true },

  // 대규모 2차 확장 — 편의점/마트에서 흔히 볼 수 있는 실제 브랜드 50종을 추가.
  { barcode: "8801000002001", nameKo: "너구리", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 490, servingSizeG: 120, carbsG: 78, proteinG: 9, fatG: 15, sugarG: 4, sodiumMg: 1760, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건다시마, 건조야채", allergensKo: "밀, 대두 함유", price: 1400, isNew: false },
  { barcode: "8801000002018", nameKo: "짜파게티", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 585, servingSizeG: 140, carbsG: 89, proteinG: 11, fatG: 18, sugarG: 9, sodiumMg: 1000, ingredientsKo: "면(밀가루, 팜유), 짜장분말, 조미유", allergensKo: "밀, 대두 함유", price: 1400, isNew: false },
  { barcode: "8801000002025", nameKo: "삼양라면", brandKo: "삼양식품", categorySlug: "ramen", countryCode: "KR", calories: 500, servingSizeG: 120, carbsG: 80, proteinG: 9, fatG: 15, sugarG: 3, sodiumMg: 1500, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건조야채", allergensKo: "밀, 대두, 소고기 함유", price: 900, isNew: false },
  { barcode: "8801000002032", nameKo: "신라면 블랙", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 500, servingSizeG: 134, carbsG: 65, proteinG: 15, fatG: 19, sugarG: 3, sodiumMg: 1700, ingredientsKo: "면(밀가루, 팜유), 사골농축액, 소고기, 건조야채", allergensKo: "밀, 대두, 소고기, 돼지고기 함유", price: 1700, isNew: true },
  { barcode: "8801000002049", nameKo: "육개장 사발면", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 380, servingSizeG: 86, carbsG: 58, proteinG: 8, fatG: 12, sugarG: 2, sodiumMg: 1450, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건조파, 고춧가루", allergensKo: "밀, 대두, 소고기 함유", price: 1200, isNew: false },
  { barcode: "8801000002056", nameKo: "왕뚜껑", brandKo: "농심", categorySlug: "ramen", countryCode: "KR", calories: 460, servingSizeG: 110, carbsG: 68, proteinG: 9, fatG: 16, sugarG: 3, sodiumMg: 1600, ingredientsKo: "면(밀가루, 팜유), 분말스프, 건조야채", allergensKo: "밀, 대두 함유", price: 1400, isNew: false },
  { barcode: "8801000002063", nameKo: "참깨라면", brandKo: "오뚜기", categorySlug: "ramen", countryCode: "KR", calories: 500, servingSizeG: 121, carbsG: 76, proteinG: 10, fatG: 17, sugarG: 3, sodiumMg: 1650, ingredientsKo: "면(밀가루, 팜유), 참깨분말스프, 건조야채", allergensKo: "밀, 대두, 참깨 함유", price: 1100, isNew: true },
  { barcode: "8801000002070", nameKo: "자갈치", brandKo: "농심", categorySlug: "snack", countryCode: "KR", calories: 470, servingSizeG: 100, carbsG: 60, proteinG: 6, fatG: 22, sugarG: 2, sodiumMg: 700, ingredientsKo: "밀가루, 새우, 팜유, 조미분말", allergensKo: "밀, 새우, 대두 함유", price: 1700, isNew: false },
  { barcode: "8801000002087", nameKo: "오징어땅콩", brandKo: "농심", categorySlug: "snack", countryCode: "KR", calories: 480, servingSizeG: 100, carbsG: 58, proteinG: 10, fatG: 22, sugarG: 3, sodiumMg: 480, ingredientsKo: "땅콩, 밀가루, 오징어분말, 팜유", allergensKo: "밀, 대두, 땅콩, 오징어 함유", price: 1800, isNew: false },
  { barcode: "8801000002094", nameKo: "바나나킥", brandKo: "농심", categorySlug: "snack", countryCode: "KR", calories: 500, servingSizeG: 75, carbsG: 65, proteinG: 5, fatG: 24, sugarG: 20, sodiumMg: 250, ingredientsKo: "옥수수분, 바나나분말, 팜유, 설탕", allergensKo: "대두, 우유 함유", price: 1700, isNew: false },
  { barcode: "8801000002100", nameKo: "스윙칩 오리지널", brandKo: "오리온", categorySlug: "snack", countryCode: "KR", calories: 540, servingSizeG: 110, carbsG: 52, proteinG: 6, fatG: 34, sugarG: 2, sodiumMg: 420, ingredientsKo: "감자, 식물성유지, 정제염", allergensKo: "해당없음", price: 2100, isNew: false },
  { barcode: "8801000002117", nameKo: "예감 오리지널", brandKo: "오리온", categorySlug: "snack", countryCode: "KR", calories: 480, servingSizeG: 100, carbsG: 62, proteinG: 6, fatG: 22, sugarG: 3, sodiumMg: 500, ingredientsKo: "감자전분, 밀가루, 식물성유지", allergensKo: "밀, 대두 함유", price: 1900, isNew: false },
  { barcode: "8801000002124", nameKo: "홈런볼 초코", brandKo: "해태제과", categorySlug: "snack", countryCode: "KR", calories: 500, servingSizeG: 130, carbsG: 58, proteinG: 6, fatG: 26, sugarG: 24, sodiumMg: 200, ingredientsKo: "밀가루, 초콜릿가공품, 설탕, 계란", allergensKo: "밀, 대두, 우유, 계란 함유", price: 2500, isNew: true },
  { barcode: "8801000002131", nameKo: "빼빼로 오리지널", brandKo: "롯데웰푸드", categorySlug: "snack", countryCode: "KR", calories: 250, servingSizeG: 54, carbsG: 35, proteinG: 3, fatG: 10, sugarG: 18, sodiumMg: 105, ingredientsKo: "밀가루, 초콜릿가공품, 설탕", allergensKo: "밀, 대두, 우유 함유", price: 1600, isNew: false },
  { barcode: "8801000002148", nameKo: "카스타드", brandKo: "롯데웰푸드", categorySlug: "snack", countryCode: "KR", calories: 375, servingSizeG: 100, carbsG: 50, proteinG: 7, fatG: 17, sugarG: 30, sodiumMg: 225, ingredientsKo: "밀가루, 계란, 설탕, 마가린", allergensKo: "밀, 계란, 우유 함유", price: 3200, isNew: false },
  { barcode: "8801000002155", nameKo: "몽쉘", brandKo: "롯데웰푸드", categorySlug: "snack", countryCode: "KR", calories: 430, servingSizeG: 100, carbsG: 55, proteinG: 5, fatG: 21, sugarG: 30, sodiumMg: 220, ingredientsKo: "밀가루, 초콜릿가공품, 크림, 설탕", allergensKo: "밀, 대두, 우유, 계란 함유", price: 4500, isNew: true },
  { barcode: "8801000002162", nameKo: "죠리퐁", brandKo: "오리온", categorySlug: "snack", countryCode: "KR", calories: 400, servingSizeG: 100, carbsG: 78, proteinG: 9, fatG: 6, sugarG: 25, sodiumMg: 300, ingredientsKo: "보리, 콩, 설탕, 물엿", allergensKo: "대두 함유", price: 2000, isNew: false },
  { barcode: "8801000002179", nameKo: "박카스", brandKo: "동아제약", categorySlug: "beverage", countryCode: "KR", calories: 45, servingSizeG: 100, carbsG: 11, proteinG: 0, fatG: 0, sugarG: 10, sodiumMg: 15, ingredientsKo: "정제수, 타우린, 카페인, 니코틴산아미드", allergensKo: "해당없음", price: 900, isNew: false },
  { barcode: "8801000002186", nameKo: "핫식스", brandKo: "롯데칠성음료", categorySlug: "beverage", countryCode: "KR", calories: 55, servingSizeG: 250, carbsG: 13, proteinG: 0, fatG: 0, sugarG: 12, sodiumMg: 100, ingredientsKo: "정제수, taurine, 카페인, 비타민C", allergensKo: "해당없음", price: 1800, isNew: true },
  { barcode: "8801000002193", nameKo: "초록매실", brandKo: "롯데칠성음료", categorySlug: "beverage", countryCode: "KR", calories: 90, servingSizeG: 235, carbsG: 22, proteinG: 0, fatG: 0, sugarG: 20, sodiumMg: 20, ingredientsKo: "정제수, 매실농축액, 설탕, 매실과육", allergensKo: "복숭아 함유 가능", price: 1200, isNew: false },
  { barcode: "8801000002209", nameKo: "옥수수수염차", brandKo: "광동제약", categorySlug: "beverage", countryCode: "KR", calories: 0, servingSizeG: 500, carbsG: 0, proteinG: 0, fatG: 0, sugarG: 0, sodiumMg: 10, ingredientsKo: "정제수, 옥수수수염추출액", allergensKo: "해당없음", price: 1600, isNew: false },
  { barcode: "8801000002216", nameKo: "델몬트 오렌지주스", brandKo: "롯데칠성음료", categorySlug: "beverage", countryCode: "KR", calories: 90, servingSizeG: 200, carbsG: 22, proteinG: 0.5, fatG: 0, sugarG: 20, sodiumMg: 10, ingredientsKo: "오렌지과즙, 정제수, 설탕", allergensKo: "해당없음", price: 1900, isNew: true },
  { barcode: "8801000002223", nameKo: "야쿠르트", brandKo: "hy(한국야쿠르트)", categorySlug: "beverage", countryCode: "KR", calories: 55, servingSizeG: 65, carbsG: 13, proteinG: 0.5, fatG: 0, sugarG: 12, sodiumMg: 20, ingredientsKo: "정제수, 탈지분유, 설탕, 유산균", allergensKo: "우유 함유", price: 400, isNew: false },
  { barcode: "8801000002230", nameKo: "아침햇살", brandKo: "웅진식품", categorySlug: "beverage", countryCode: "KR", calories: 225, servingSizeG: 500, carbsG: 55, proteinG: 1, fatG: 0, sugarG: 15, sodiumMg: 10, ingredientsKo: "정제수, 쌀추출액, 설탕", allergensKo: "해당없음", price: 1800, isNew: false },
  { barcode: "8801000002247", nameKo: "베지밀", brandKo: "정식품", categorySlug: "dairy", countryCode: "KR", calories: 110, servingSizeG: 190, carbsG: 12, proteinG: 6, fatG: 4, sugarG: 8, sodiumMg: 95, ingredientsKo: "대두, 정제수, 설탕", allergensKo: "대두 함유", price: 1300, isNew: false },
  { barcode: "8801000002254", nameKo: "매일두유 99.9", brandKo: "매일유업", categorySlug: "dairy", countryCode: "KR", calories: 90, servingSizeG: 190, carbsG: 8, proteinG: 7, fatG: 3.5, sugarG: 0, sodiumMg: 85, ingredientsKo: "대두 99.9%, 정제수", allergensKo: "대두 함유", price: 1400, isNew: true },
  { barcode: "8801000002261", nameKo: "요플레 오리지널", brandKo: "hy(한국야쿠르트)", categorySlug: "dairy", countryCode: "KR", calories: 90, servingSizeG: 85, carbsG: 15, proteinG: 3, fatG: 2, sugarG: 13, sodiumMg: 45, ingredientsKo: "원유, 설탕, 과일과즙, 유산균", allergensKo: "우유 함유", price: 1200, isNew: false },
  { barcode: "8801000002278", nameKo: "덴마크 하이 그릭요거트", brandKo: "매일유업", categorySlug: "dairy", countryCode: "KR", calories: 130, servingSizeG: 100, carbsG: 7, proteinG: 10, fatG: 6, sugarG: 6, sodiumMg: 55, ingredientsKo: "원유, 유산균배양물", allergensKo: "우유 함유", price: 2500, isNew: true },
  { barcode: "8801000002285", nameKo: "월드콘", brandKo: "롯데웰푸드", categorySlug: "icecream", countryCode: "KR", calories: 320, servingSizeG: 160, carbsG: 38, proteinG: 4, fatG: 16, sugarG: 26, sodiumMg: 90, ingredientsKo: "원유, 땅콩, 초콜릿가공품, 웨하스콘", allergensKo: "우유, 땅콩, 밀 함유", price: 1900, isNew: false },
  { barcode: "8801000002292", nameKo: "스크류바", brandKo: "롯데웰푸드", categorySlug: "icecream", countryCode: "KR", calories: 90, servingSizeG: 70, carbsG: 20, proteinG: 0, fatG: 0.5, sugarG: 17, sodiumMg: 15, ingredientsKo: "정제수, 설탕, 포도농축액, 사과산", allergensKo: "해당없음", price: 700, isNew: false },
  { barcode: "8801000002308", nameKo: "붕어싸만코", brandKo: "빙그레", categorySlug: "icecream", countryCode: "KR", calories: 330, servingSizeG: 160, carbsG: 42, proteinG: 5, fatG: 16, sugarG: 30, sodiumMg: 100, ingredientsKo: "원유, 팥앙금, 크림, 밀가루", allergensKo: "밀, 우유, 대두 함유", price: 2000, isNew: true },
  { barcode: "8801000002315", nameKo: "투게더", brandKo: "빙그레", categorySlug: "icecream", countryCode: "KR", calories: 190, servingSizeG: 100, carbsG: 20, proteinG: 3, fatG: 11, sugarG: 17, sodiumMg: 55, ingredientsKo: "원유, 크림, 설탕", allergensKo: "우유 함유", price: 6500, isNew: false },
  { barcode: "8801000002322", nameKo: "누가바", brandKo: "해태제과", categorySlug: "icecream", countryCode: "KR", calories: 190, servingSizeG: 80, carbsG: 23, proteinG: 2, fatG: 10, sugarG: 20, sodiumMg: 50, ingredientsKo: "정제수, 설탕, 땅콩, 식물성유지", allergensKo: "땅콩 함유", price: 1000, isNew: false },
  { barcode: "8801000002339", nameKo: "오뚜기 3분카레", brandKo: "오뚜기", categorySlug: "frozen", countryCode: "KR", calories: 220, servingSizeG: 200, carbsG: 30, proteinG: 4, fatG: 9, sugarG: 6, sodiumMg: 900, ingredientsKo: "정제수, 카레분말, 감자, 당근, 돼지고기", allergensKo: "밀, 돼지고기 함유", price: 2500, isNew: false },
  { barcode: "8801000002346", nameKo: "오뚜기 3분짜장", brandKo: "오뚜기", categorySlug: "frozen", countryCode: "KR", calories: 260, servingSizeG: 200, carbsG: 40, proteinG: 5, fatG: 9, sugarG: 8, sodiumMg: 950, ingredientsKo: "정제수, 춘장, 돼지고기, 양파, 전분", allergensKo: "밀, 대두, 돼지고기 함유", price: 2500, isNew: false },
  { barcode: "8801000002353", nameKo: "CJ고메 만두", brandKo: "CJ제일제당", categorySlug: "frozen", countryCode: "KR", calories: 245, servingSizeG: 100, carbsG: 26, proteinG: 9, fatG: 11, sugarG: 1, sodiumMg: 480, ingredientsKo: "돼지고기, 배추, 부추, 밀가루", allergensKo: "밀, 대두, 돼지고기 함유", price: 7500, isNew: true },
  { barcode: "8801000002360", nameKo: "동원 개성왕만두", brandKo: "동원F&B", categorySlug: "frozen", countryCode: "KR", calories: 230, servingSizeG: 100, carbsG: 25, proteinG: 8, fatG: 10, sugarG: 1, sodiumMg: 460, ingredientsKo: "돼지고기, 두부, 당면, 밀가루", allergensKo: "밀, 대두, 돼지고기 함유", price: 6800, isNew: false },
  { barcode: "8801000002377", nameKo: "스팸 클래식", brandKo: "CJ제일제당", categorySlug: "convenience", countryCode: "KR", calories: 300, servingSizeG: 100, carbsG: 2, proteinG: 13, fatG: 27, sugarG: 0, sodiumMg: 1200, ingredientsKo: "돼지고기, 전분, 정제염, 아질산나트륨", allergensKo: "돼지고기 함유", price: 5900, isNew: false },
  { barcode: "8801000002384", nameKo: "오뚜기 컵밥 제육덮밥", brandKo: "오뚜기", categorySlug: "convenience", countryCode: "KR", calories: 380, servingSizeG: 310, carbsG: 65, proteinG: 10, fatG: 8, sugarG: 6, sodiumMg: 900, ingredientsKo: "쌀, 돼지고기, 고추장양념, 양파", allergensKo: "대두, 돼지고기 함유", price: 3200, isNew: true },
  { barcode: "8801000002391", nameKo: "햇반 컵반 소고기미역국", brandKo: "CJ제일제당", categorySlug: "convenience", countryCode: "KR", calories: 400, servingSizeG: 280, carbsG: 70, proteinG: 12, fatG: 8, sugarG: 2, sodiumMg: 850, ingredientsKo: "쌀, 소고기, 미역, 마늘", allergensKo: "소고기, 대두 함유", price: 4500, isNew: false },
  { barcode: "8801000002407", nameKo: "오뚜기 마요네즈", brandKo: "오뚜기", categorySlug: "sauce", countryCode: "KR", calories: 700, servingSizeG: 100, carbsG: 2, proteinG: 1, fatG: 78, sugarG: 2, sodiumMg: 480, ingredientsKo: "식용유, 난황, 식초, 정제염", allergensKo: "계란 함유", price: 4200, isNew: false },
  { barcode: "8801000002414", nameKo: "샘표 진간장", brandKo: "샘표", categorySlug: "sauce", countryCode: "KR", calories: 60, servingSizeG: 100, carbsG: 8, proteinG: 6, fatG: 0, sugarG: 2, sodiumMg: 5500, ingredientsKo: "대두, 밀, 정제염", allergensKo: "밀, 대두 함유", price: 4500, isNew: false },
  { barcode: "8801000002421", nameKo: "해찬들 태양초 고추장", brandKo: "CJ제일제당", categorySlug: "sauce", countryCode: "KR", calories: 210, servingSizeG: 100, carbsG: 44, proteinG: 4, fatG: 1, sugarG: 17, sodiumMg: 1900, ingredientsKo: "태양초 고춧가루, 찹쌀, 메주가루", allergensKo: "대두 함유", price: 6200, isNew: true },
  { barcode: "8801000002438", nameKo: "오뚜기 돈까스소스", brandKo: "오뚜기", categorySlug: "sauce", countryCode: "KR", calories: 110, servingSizeG: 100, carbsG: 24, proteinG: 1, fatG: 0.5, sugarG: 15, sodiumMg: 850, ingredientsKo: "정제수, 설탕, 토마토페이스트, 향신료", allergensKo: "밀, 토마토 함유", price: 3300, isNew: false },
  { barcode: "8801000002445", nameKo: "임팩타민", brandKo: "대웅제약", categorySlug: "health", countryCode: "KR", calories: 15, servingSizeG: 4, carbsG: 3, proteinG: 0, fatG: 0, sugarG: 2, sodiumMg: 20, ingredientsKo: "비타민C, 비타민B군, 아연", allergensKo: "해당없음", price: 25000, isNew: true },
  { barcode: "8801000002452", nameKo: "한삼인 홍삼정", brandKo: "농협 한삼인", categorySlug: "health", countryCode: "KR", calories: 85, servingSizeG: 30, carbsG: 18, proteinG: 0.5, fatG: 0, sugarG: 14, sodiumMg: 5, ingredientsKo: "6년근 홍삼농축액, 올리고당", allergensKo: "해당없음", price: 79000, isNew: false },
  { barcode: "8801000002469", nameKo: "뉴트리코어 오메가3", brandKo: "뉴트리코어", categorySlug: "health", countryCode: "KR", calories: 20, servingSizeG: 2, carbsG: 0, proteinG: 0, fatG: 2, sugarG: 0, sodiumMg: 0, ingredientsKo: "정제어유, 젤라틴, 비타민E", allergensKo: "고등어 함유 가능", price: 28000, isNew: true },
  { barcode: "8801000002476", nameKo: "하림펫푸드 더리얼 독푸드", brandKo: "하림펫푸드", categorySlug: "pet", countryCode: "KR", calories: 370, servingSizeG: 100, carbsG: 38, proteinG: 26, fatG: 16, sugarG: 1, sodiumMg: 320, ingredientsKo: "닭고기, 현미, 고구마, 연어유", allergensKo: "닭고기 함유", price: 32000, isNew: true },
  { barcode: "8801000002483", nameKo: "하림펫푸드 더리얼 캣푸드", brandKo: "하림펫푸드", categorySlug: "pet", countryCode: "KR", calories: 385, servingSizeG: 100, carbsG: 30, proteinG: 34, fatG: 18, sugarG: 1, sodiumMg: 340, ingredientsKo: "닭고기, 연어, 현미, 어유", allergensKo: "닭고기 함유", price: 29000, isNew: true },
  { barcode: "8801000002490", nameKo: "네츄럴코어 츄르", brandKo: "네츄럴코어", categorySlug: "pet", countryCode: "KR", calories: 12, servingSizeG: 15, carbsG: 2, proteinG: 1, fatG: 0.3, sugarG: 1, sodiumMg: 40, ingredientsKo: "참치, 정제수, 타우린", allergensKo: "참치 함유", price: 6900, isNew: false },
];
