import { ALLERGENS, type AllergenTag } from "@/lib/allergens";

const ALLERGEN_LABEL_FR: Record<AllergenTag, string> = {
  "난류(계란)": "Œuf",
  "우유": "Lait",
  "메밀": "Sarrasin",
  "땅콩": "Arachide",
  "대두": "Soja",
  "밀": "Blé",
  "고등어": "Maquereau",
  "게": "Crabe",
  "새우": "Crevette",
  "돼지고기": "Porc",
  "복숭아": "Pêche",
  "토마토": "Tomate",
  "아황산류": "Sulfites",
  "호두": "Noix",
  "닭고기": "Poulet",
  "소고기": "Bœuf",
  "오징어": "Calmar",
  "조개류(굴·전복·홍합 포함)": "Mollusques (huître, ormeau, moule)",
  "잣": "Pignon de pin",
};

type Category = { id: string; nameKo: string; icon: string | null };
type Country = { id: string; nameKo: string; code: string };

type ProductDefaults = {
  id?: string;
  barcode?: string | null;
  nameKo?: string;
  brandKo?: string;
  categoryId?: string;
  countryId?: string;
  originCountryCodes?: string[];
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Nom du produit">
          <input
            name="nameKo"
            required
            defaultValue={product?.nameKo}
            className="input"
          />
        </Field>
        <Field label="Marque">
          <input
            name="brandKo"
            required
            defaultValue={product?.brandKo}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Catégorie">
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className="input"
          >
            <option value="">Choisir</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.nameKo}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pays de fabrication">
          <select
            name="countryId"
            required
            defaultValue={product?.countryId}
            className="input"
          >
            <option value="">Choisir</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameKo} ({c.code})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Pays d'origine des ingrédients (optionnel, codes séparés par virgule, ex: KR,CN)"
        hint="Si la composition provient de plusieurs pays, tous les drapeaux correspondants s'afficheront sur la fiche produit en plus du pays de fabrication."
      >
        <input
          name="originCountryCodes"
          defaultValue={product?.originCountryCodes?.join(", ") ?? ""}
          placeholder="ex: KR, CN, VN"
          className="input"
        />
      </Field>

      <Field label="Code-barres (optionnel)">
        <input
          name="barcode"
          defaultValue={product?.barcode ?? ""}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Image de face (fichier)">
          <input type="file" name="imageFrontFile" accept="image/*" className="input" />
        </Field>
        <Field label="ou URL/chemin de l'image de face">
          <input
            name="imageFrontUrl"
            defaultValue={product?.imageFront ?? ""}
            placeholder="/products/xxx-front.svg"
            className="input"
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Image de dos (fichier)">
          <input type="file" name="imageBackFile" accept="image/*" className="input" />
        </Field>
        <Field label="ou URL/chemin de l'image de dos">
          <input
            name="imageBackUrl"
            defaultValue={product?.imageBack ?? ""}
            placeholder="/products/xxx-back.svg"
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Calories (kcal)">
          <input type="number" name="calories" defaultValue={product?.calories ?? undefined} className="input" />
        </Field>
        <Field label="Portion (g)">
          <input type="number" name="servingSizeG" defaultValue={product?.servingSizeG ?? undefined} className="input" />
        </Field>
        <Field label="Prix (KRW)">
          <input type="number" name="price" defaultValue={product?.price ?? undefined} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Glucides (g)">
          <input type="number" step="0.1" name="carbsG" defaultValue={product?.carbsG ?? undefined} className="input" />
        </Field>
        <Field label="Sucres (g)">
          <input type="number" step="0.1" name="sugarG" defaultValue={product?.sugarG ?? undefined} className="input" />
        </Field>
        <Field label="Protéines (g)">
          <input type="number" step="0.1" name="proteinG" defaultValue={product?.proteinG ?? undefined} className="input" />
        </Field>
        <Field label="Lipides (g)">
          <input type="number" step="0.1" name="fatG" defaultValue={product?.fatG ?? undefined} className="input" />
        </Field>
      </div>

      <Field label="Sodium (mg)">
        <input type="number" step="0.1" name="sodiumMg" defaultValue={product?.sodiumMg ?? undefined} className="input" />
      </Field>

      <Field label="Liste des ingrédients">
        <textarea name="ingredientsKo" rows={2} defaultValue={product?.ingredientsKo ?? ""} className="input" />
      </Field>
      <Field label="Mention allergènes (texte affiché)">
        <textarea name="allergensKo" rows={2} defaultValue={product?.allergensKo ?? ""} className="input" />
      </Field>

      <div>
        <p className="mb-1 text-xs font-semibold text-gray-600">
          Allergènes standards (pour les alertes personnalisées)
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
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
              {ALLERGEN_LABEL_FR[tag]}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="isNew" defaultChecked={product?.isNew} />
        Afficher comme nouveauté (NEW)
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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
      {label}
      {children}
      {hint && <span className="text-[10px] font-normal text-gray-400">{hint}</span>}
    </label>
  );
}
