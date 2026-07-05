import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "톡키체크 - 대한민국 식품 성분·안전 정보",
    short_name: "톡키체크",
    description: "대한민국 판매 식품의 제조국, 칼로리, 성분, 제조 안전 정보 확인",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f5",
    theme_color: "#0ea472",
    lang: "ko",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
