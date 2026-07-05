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
];
