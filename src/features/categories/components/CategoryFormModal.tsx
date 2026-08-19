"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { CategoryFormValues } from "../schema";
import { Category } from "../types";
<<<<<<< HEAD
import { useAdminI18n } from "@/i18n/admin-i18n";
=======
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => void;
  initialData?: Category | null;
  categories: Category[];
  defaultType: "expense" | "income";
  isLoading?: boolean;
}

const COLORS = [
  "#facc15", "#ef4444", "#22c55e", "#06b6d4", "#8b5cf6", "#f59e0b",
  "#ec4899", "#10b981", "#3b82f6", "#d97706", "#6366f1", "#64748b",
] as const;

const ICONS = [
  ["Utensils", "/categories/form-utensils.svg"],
  ["House", "/categories/form-home.svg"],
  ["Truck", "/categories/form-truck.svg"],
  ["Heart", "/categories/form-heart.svg"],
  ["Film", "/categories/form-film.svg"],
  ["GraduationCap", "/categories/form-graduation.svg"],
  ["Tickets", "/categories/form-tickets.svg"],
  ["Plane", "/categories/form-plane.svg"],
  ["ShoppingBag", "/categories/form-shopping.svg"],
  ["Coffee", "/categories/form-coffee.svg"],
  ["Music", "/categories/form-music.svg"],
  ["BriefcaseBusiness", "/categories/form-briefcase.svg"],
  ["Smartphone", "/categories/form-phone.svg"],
  ["Globe", "/categories/form-globe.svg"],
  ["Zap", "/categories/form-zap.svg"],
  ["Box", "/categories/form-box.svg"],
] as const;

const DEFAULT_COLOR = "#22c55e";
const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-800 outline-none transition focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-google-sans";

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  defaultType,
  isLoading = false,
}: CategoryFormModalProps) {
<<<<<<< HEAD
  const { t } = useAdminI18n();
=======
  const { dict, isEnglish } = useI18n();

>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      icon: "Truck",
      color: DEFAULT_COLOR,
      type: defaultType,
      parentId: null,
      categoryKey: "",
      systemCategory: false,
      defaultCategory: false,
    },
  });

  const selectedIcon = useWatch({ control, name: "icon" });
  const selectedColor = useWatch({ control, name: "color" });
  const selectedType = useWatch({ control, name: "type" });
  const isSystemCategory = useWatch({ control, name: "systemCategory" });

  useEffect(() => {
    reset({
      name: initialData?.name ?? "",
      icon: initialData?.icon ?? "Truck",
      color: initialData?.color?.startsWith("#") ? initialData.color : DEFAULT_COLOR,
      type: initialData?.type === "income" ? "income" : defaultType,
      parentId: initialData?.parentId ?? null,
      categoryKey: initialData?.categoryKey ?? "",
      systemCategory: initialData?.systemCategory ?? false,
      defaultCategory: initialData?.defaultCategory ?? false,
    });
  }, [defaultType, initialData, reset]);

  useEffect(() => {
    if (!isSystemCategory) setValue("defaultCategory", false);
  }, [isSystemCategory, setValue]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm font-google-sans"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="max-h-[calc(100vh-32px)] w-full max-w-2xl overflow-y-auto rounded-[20px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div>
            <h2 id="category-form-title" className="text-2xl font-bold text-[#003377] dark:text-slate-100">
<<<<<<< HEAD
              {initialData ? t("Edit Category") : t("Create Category")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("Configure category information and hierarchical arrangement.")}
            </p>
          </div>
          <button type="button" disabled={isLoading} onClick={onClose} aria-label={t("Close")} className="rounded-xl p-2 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800">
=======
              {initialData ? dict.categories.editCategory : dict.categories.createCategory}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {dict.categories.categoryInfo}
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label={dict.common.close}
            className="rounded-xl p-2 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
          >
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            <Image src="/categories/form-close.svg" alt="" width={20} height={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit, (formErrors) => {
            const message =
              formErrors.name?.message ??
              formErrors.type?.message ??
              formErrors.parentId?.message ??
              formErrors.categoryKey?.message ??
              formErrors.systemCategory?.message ??
              formErrors.defaultCategory?.message ??
              formErrors.color?.message ??
              formErrors.icon?.message ??
<<<<<<< HEAD
              t("Please check the highlighted fields.");
=======
              (isEnglish ? "Please check highlighted fields." : "សូមពិនិត្យព័ត៌មានដែលបានបន្លិច។");
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

            toast.error(message, { id: "category-form-validation" });
          })}
          className="space-y-5 p-6"
        >
          <div>
<<<<<<< HEAD
            <label htmlFor="category-name" className="mb-2 block text-sm font-bold text-[#003377] dark:text-slate-100">{t("Category Name")}</label>
=======
            <label htmlFor="category-name" className="mb-2 block text-sm font-bold text-[#003377] dark:text-slate-100">
              {dict.categories.categoryName}
            </label>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            <input
              id="category-name"
              autoFocus
              maxLength={100}
              {...register("name", {
<<<<<<< HEAD
                required: t("Category name is required."),
                validate: (value) =>
                  value.trim().length > 0 || t("Category name is required."),
              })}
              placeholder={t("e.g. Travel")}
=======
                required: isEnglish ? "Please enter category name." : "សូមបញ្ចូលឈ្មោះប្រភេទ។",
                validate: (value) =>
                  value.trim().length > 0 || (isEnglish ? "Please enter category name." : "សូមបញ្ចូលឈ្មោះប្រភេទ។"),
              })}
              placeholder={dict.categories.categoryNamePlaceholder}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              className={inputClass}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset>
<<<<<<< HEAD
              <legend className="mb-2 text-sm font-bold text-[#003377] dark:text-slate-100">{t("Type")}</legend>
              <div className="grid h-12 grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                {(["expense", "income"] as const).map((type) => (
                  <button key={type} type="button" onClick={() => setValue("type", type, { shouldDirty: true })} className={`rounded-xl text-sm font-semibold capitalize transition ${selectedType === type ? "bg-white text-[#003377] shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500"}`}>
                    {type === "income" ? t("Income") : t("Expense")}
=======
              <legend className="mb-2 text-sm font-bold text-[#003377] dark:text-slate-100">
                {dict.categories.transactionType}
              </legend>
              <div className="grid h-12 grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                {(["expense", "income"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue("type", type, { shouldDirty: true })}
                    className={`rounded-xl text-sm font-semibold capitalize transition ${
                      selectedType === type
                        ? "bg-white text-[#003377] shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {type === "income" ? dict.transactions.income : dict.transactions.expense}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
<<<<<<< HEAD
              <label htmlFor="category-parent" className="mb-2 block text-sm font-bold text-[#003377] dark:text-slate-100">{t("Parent Category")}</label>
              <select id="category-parent" {...register("parentId", { setValueAs: (value) => value || null })} className={inputClass}>
                <option value="">{t("None — Root Category")}</option>
=======
              <label htmlFor="category-parent" className="mb-2 block text-sm font-bold text-[#003377] dark:text-slate-100">
                {dict.categories.parentCategory}
              </label>
              <select id="category-parent" {...register("parentId", { setValueAs: (value) => value || null })} className={inputClass}>
                <option value="">{dict.categories.noParentRoot}</option>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                {categories.filter((category) => category.id !== initialData?.id).map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {!initialData && (
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
<<<<<<< HEAD
              <h3 className="font-bold text-[#003377] dark:text-slate-100">{t("Category Configuration")}</h3>
              <p className="mb-4 mt-1 text-xs text-slate-500">{t("Key will be auto-generated if left empty.")}</p>
              <label htmlFor="category-key" className="sr-only">{t("Category Key")}</label>
=======
              <h3 className="font-bold text-[#003377] dark:text-slate-100">
                {dict.categories.categorySettings}
              </h3>
              <p className="mb-4 mt-1 text-xs text-slate-500">
                {dict.categories.keyAutoGenerateNote}
              </p>
              <label htmlFor="category-key" className="sr-only">
                {dict.categories.categoryKeyPlaceholder}
              </label>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              <input
                id="category-key"
                maxLength={100}
                {...register("categoryKey", {
                  setValueAs: (value: string) => value.trim().toUpperCase(),
                  validate: (value) =>
                    !value ||
                    /^[A-Z][A-Z0-9_]*$/.test(value) ||
<<<<<<< HEAD
                    t("Key must start with uppercase letter and only use uppercase letters, numbers, or underscores."),
                })}
                placeholder={t("Category Key (optional)")}
=======
                    (isEnglish
                      ? "Key must start with uppercase and contain only A-Z, 0-9, or _"
                      : "លេខកូដត្រូវចាប់ផ្តើមដោយអក្សរធំ ហើយប្រើតែអក្សរធំ លេខ ឬសញ្ញាគូសក្រោម។"),
                })}
                placeholder={dict.categories.categoryKeyPlaceholder}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                className={`${inputClass} font-mono uppercase`}
              />
              {errors.categoryKey && <p className="mt-1 text-xs text-red-500">{errors.categoryKey.message}</p>}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 dark:bg-slate-900">
                  <input type="checkbox" {...register("systemCategory")} className="mt-1 size-4 accent-[#003377]" />
<<<<<<< HEAD
                  <span><span className="block text-sm font-semibold">{t("System Category")}</span><span className="block text-xs text-slate-500">{t("Managed by iStash for all users.")}</span></span>
=======
                  <span>
                    <span className="block text-sm font-semibold">{dict.categories.systemCategoryTitle}</span>
                    <span className="block text-xs text-slate-500">{dict.categories.systemCategorySubtitle}</span>
                  </span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                </label>
                <label className={`flex items-start gap-3 rounded-xl bg-white p-3 dark:bg-slate-900 ${isSystemCategory ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                  <input
                    type="checkbox"
                    aria-disabled={!isSystemCategory}
                    tabIndex={isSystemCategory ? 0 : -1}
                    {...register("defaultCategory")}
                    onClick={(event) => {
                      if (!isSystemCategory) event.preventDefault();
                    }}
                    className={`mt-1 size-4 accent-[#003377] ${!isSystemCategory ? "pointer-events-none" : ""}`}
                  />
<<<<<<< HEAD
                  <span><span className="block text-sm font-semibold">{t("Default Category")}</span><span className="block text-xs text-slate-500">{t("Requires system category.")}</span></span>
=======
                  <span>
                    <span className="block text-sm font-semibold">{dict.categories.defaultCategoryTitle}</span>
                    <span className="block text-xs text-slate-500">{dict.categories.defaultCategorySubtitle}</span>
                  </span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                </label>
              </div>
              {errors.defaultCategory && <p className="mt-2 text-xs text-red-500">{errors.defaultCategory.message}</p>}
            </section>
          )}

          <fieldset>
<<<<<<< HEAD
            <legend className="mb-2 text-sm font-bold text-[#003377] dark:text-slate-100">{t("Color")}</legend>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((color) => (
                <button key={color} type="button" aria-label={`Use color ${color}`} aria-pressed={selectedColor === color} onClick={() => setValue("color", color, { shouldDirty: true })} className="size-9 rounded-full border-2 transition hover:scale-105" style={{ backgroundColor: color, borderColor: selectedColor === color ? "#0f172a" : "transparent" }} />
=======
            <legend className="mb-2 text-sm font-bold text-[#003377] dark:text-slate-100">
              {dict.categories.color}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`${dict.categories.color} ${color}`}
                  aria-pressed={selectedColor === color}
                  onClick={() => setValue("color", color, { shouldDirty: true })}
                  className="size-9 rounded-full border-2 transition hover:scale-105"
                  style={{ backgroundColor: color, borderColor: selectedColor === color ? "#0f172a" : "transparent" }}
                />
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              ))}
            </div>
          </fieldset>

          <fieldset>
<<<<<<< HEAD
            <legend className="mb-2 text-sm font-bold text-[#003377] dark:text-slate-100">{t("Icon")}</legend>
            <div className="flex flex-wrap gap-2.5">
              {ICONS.map(([name, asset]) => (
                <button key={name} type="button" aria-label={`Use icon ${name}`} aria-pressed={selectedIcon === name} onClick={() => setValue("icon", name, { shouldDirty: true })} className={`flex size-11 items-center justify-center rounded-2xl border-2 transition ${selectedIcon === name ? "border-[#facc15] bg-[#facc15]/10" : "border-slate-200 dark:border-slate-700"}`}>
=======
            <legend className="mb-2 text-sm font-bold text-[#003377] dark:text-slate-100">
              {dict.categories.icon}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {ICONS.map(([name, asset]) => (
                <button
                  key={name}
                  type="button"
                  aria-label={`${dict.categories.icon} ${name}`}
                  aria-pressed={selectedIcon === name}
                  onClick={() => setValue("icon", name, { shouldDirty: true })}
                  className={`flex size-11 items-center justify-center rounded-2xl border-2 transition ${
                    selectedIcon === name ? "border-[#facc15] bg-[#facc15]/10" : "border-slate-200 dark:border-slate-700"
                  }`}
                >
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                  <Image src={asset} alt="" width={20} height={20} />
                </button>
              ))}
            </div>
          </fieldset>

<<<<<<< HEAD
          <div className="flex gap-3 pt-1">
            <button type="button" disabled={isLoading} onClick={onClose} className="h-12 flex-1 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">{t("Cancel")}</button>
            <button type="submit" disabled={isLoading} className="h-12 flex-1 rounded-2xl bg-[#facc15] font-bold text-slate-900 hover:bg-[#f4c20d] disabled:cursor-wait disabled:opacity-60">
              {isLoading ? t("Saving...") : initialData ? t("Save Changes") : t("Create")}
=======
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition whitespace-nowrap"
            >
              {dict.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 flex-1 rounded-2xl bg-[#facc15] font-bold text-[#003377] hover:bg-[#f4c20d] disabled:cursor-wait disabled:opacity-60 transition shadow-md whitespace-nowrap"
            >
              {isLoading
                ? dict.common.loading
                : initialData
                  ? dict.categories.editCategory
                  : dict.categories.createCategory}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
