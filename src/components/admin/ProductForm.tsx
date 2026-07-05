import { ALLERGENS } from "@/lib/allergens";

type Category = { id: string; nameKo: string; icon: string | null };
type Country = { id: string; nameKo: string; code: string };

type ProductDefaults = {
  id?: string;
  barcode?: string | null;
  nameKo?: string;
  brandKo?: string;
  categoryId?: string;
  countryId?: string;
  imageFront?: string;
  imageBack?: string | null;
  calories?: number | null;
  servingSizeG?: number | null;
  carbsG?: number | null;
  proteinG?: number | null;
  fatG?: number | null;
  sugarG?: number | null;
  sodiumMg?: number | null;
  ingredientsKo?: string | null;
  allergensKo?: string | null;
  allergenTags?: string[];
  price?: number | null;
  isNew?: boolean;
};

export function ProductForm({
  action,
  categories,
  countries,
  product,
  submitLabel,
  extraHiddenFields,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  countries: Country[];
  product?: ProductDefaults;
  submitLabel: string;
  extraHiddenFields?: { name: string; value: string }[];
}) {
  return (
    <form action={action} className="flex flex-col gap-3">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      {extraHiddenFields?.map((f) => (
        <input key={f.name} type="hidden" name={f.name} value={f.value} />
      ))}

      <div className="grid grid-cols-2 gap-3">
        <Field label="제품명">
          <input
            name="nameKo"
            required
            defaultValue={product?.nameKo}
            className="input"
          />
        </Field>
        <Field label="브랜드명">
          <input
            name="brandKo"
            required
            defaultValue={product?.brandKo}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="카테고리">
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className="input"
          >
            <option value="">선택</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.nameKo}
              </option>
            ))}
          </select>
        </Field>
        <Field label="제조국">
          <select
            name="countryId"
            required
            defaultValue={product?.countryId}
            className="input"
          >
            <option value="">선택</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameKo}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="바코드 (선택)">
        <input
          name="barcode"
          defaultValue={product?.barcode ?? ""}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="정면 이미지 업로드">
          <input type="file" name="imageFrontFile" accept="image/*" className="input" />
        </Field>
        <Field label="또는 정면 이미지 경로/URL">
          <input
            name="imageFrontUrl"
            defaultValue={product?.imageFront ?? ""}
            placeholder="/products/xxx-front.svg"
            className="input"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="후면 이미지 업로드">
          <input type="file" name="imageBackFile" accept="image/*" className="input" />
        </Field>
        <Field label="또는 후면 이미지 경로/URL">
          <input
            name="imageBackUrl"
            defaultValue={product?.imageBack ?? ""}
            placeholder="/products/xxx-back.svg"
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="칼로리(kcal)">
          <input type="number" name="calories" defaultValue={product?.calories ?? undefined} className="input" />
        </Field>
        <Field label="1회 제공량(g)">
          <input type="number" name="servingSizeG" defaultValue={product?.servingSizeG ?? undefined} className="input" />
        </Field>
        <Field label="가격(원)">
          <input type="number" name="price" defaultValue={product?.price ?? undefined} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Field label="탄수화물(g)">
          <input type="number" step="0.1" name="carbsG" defaultValue={product?.carbsG ?? undefined} className="input" />
        </Field>
        <Field label="당류(g)">
          <input type="number" step="0.1" name="sugarG" defaultValue={product?.sugarG ?? undefined} className="input" />
        </Field>
        <Field label="단백질(g)">
          <input type="number" step="0.1" name="proteinG" defaultValue={product?.proteinG ?? undefined} className="input" />
        </Field>
        <Field label="지방(g)">
          <input type="number" step="0.1" name="fatG" defaultValue={product?.fatG ?? undefined} className="input" />
        </Field>
      </div>

      <Field label="나트륨(mg)">
        <input type="number" step="0.1" name="sodiumMg" defaultValue={product?.sodiumMg ?? undefined} className="input" />
      </Field>

      <Field label="원재료명">
        <textarea name="ingredientsKo" rows={2} defaultValue={product?.ingredientsKo ?? ""} className="input" />
      </Field>
      <Field label="알레르기 정보 (표시 문구)">
        <textarea name="allergensKo" rows={2} defaultValue={product?.allergensKo ?? ""} className="input" />
      </Field>

      <div>
        <p className="mb-1 text-xs font-semibold text-gray-600">
          알레르기 표준 태그 (개인 알림 매칭용)
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {ALLERGENS.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-[11px] text-gray-700"
            >
              <input
                type="checkbox"
                name="allergenTags"
                value={tag}
                defaultChecked={product?.allergenTags?.includes(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="isNew" defaultChecked={product?.isNew} />
        신상품(NEW)으로 표시
      </label>

      <button
        type="submit"
        className="mt-2 rounded-xl bg-brand py-3 text-sm font-bold text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
      {label}
      {children}
    </label>
  );
}
