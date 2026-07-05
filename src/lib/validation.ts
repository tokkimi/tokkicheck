import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요.").max(50),
  email: z.string().trim().email("올바른 이메일을 입력해주세요.").max(255),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(72)
    .regex(/[a-zA-Z]/, "비밀번호에 영문자를 포함해주세요.")
    .regex(/[0-9]/, "비밀번호에 숫자를 포함해주세요."),
});

export const productRequestSchema = z.object({
  nameKo: z.string().trim().min(1).max(100),
  brandKo: z.string().trim().min(1).max(100),
  categoryId: z.string().trim().max(50).optional().or(z.literal("")),
  countryNameKo: z.string().trim().max(50).optional().or(z.literal("")),
  imageFront: z.string().trim().max(2000).optional().or(z.literal("")),
  imageBack: z.string().trim().max(2000).optional().or(z.literal("")),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});
