"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CategoryFormValues, categorySchema } from "../schema";
import { Category } from "../types";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => void;
  initialData?: Category | null;
  isLoading?: boolean;
}

const AVAILABLE_COLORS = [
  { value: "#facc15", label: "លឿង" },
  { value: "#ef4444", label: "ក្រហម" },
  { value: "#22c55e", label: "បៃតង" },
  { value: "#06b6d4", label: "ខៀវខ្ចី" },
  { value: "#8b5cf6", label: "ស្វាយ" },
  { value: "#f59e0b", label: "ទឹកក្រូច" },
  { value: "#ec4899", label: "ផ្កាឈូក" },
  { value: "#10b981", label: "ត្បូង" },
  { value: "#3b82f6", label: "ខៀវ" },
  { value: "#d97706", label: "ត្នោត" },
  { value: "#6366f1", label: "ខៀវស្វាយ" },
  { value: "#64748b", label: "ប្រផេះ" },
] as const;

const AVAILABLE_ICONS = [
  { value: "Utensils", asset: "/categories/form-utensils.svg", label: "អាហារ" },
  { value: "House", asset: "/categories/form-home.svg", label: "ផ្ទះ" },
  { value: "Truck", asset: "/categories/form-truck.svg", label: "យានយន្ត" },
  { value: "Heart", asset: "/categories/form-heart.svg", label: "សុខភាព" },
  { value: "Film", asset: "/categories/form-film.svg", label: "ភាពយន្ត" },
  { value: "GraduationCap", asset: "/categories/form-graduation.svg", label: "ការអប់រំ" },
  { value: "Tickets", asset: "/categories/form-tickets.svg", label: "សំបុត្រ" },
  { value: "Plane", asset: "/categories/form-plane.svg", label: "យន្តហោះ" },
  { value: "ShoppingBag", asset: "/categories/form-shopping.svg", label: "ទិញទំនិញ" },
  { value: "Coffee", asset: "/categories/form-coffee.svg", label: "កាហ្វេ" },
  { value: "Music", asset: "/categories/form-music.svg", label: "តន្ត្រី" },
  { value: "BriefcaseBusiness", asset: "/categories/form-briefcase.svg", label: "ការងារ" },
  { value: "Smartphone", asset: "/categories/form-phone.svg", label: "ទូរស័ព្ទ" },
  { value: "Globe", asset: "/categories/form-globe.svg", label: "ពិភពលោក" },
  { value: "Zap", asset: "/categories/form-zap.svg", label: "អគ្គិសនី" },
  { value: "Box", asset: "/categories/form-box.svg", label: "ប្រអប់" },
] as const;

const DEFAULT_COLOR = "#22c55e";

const legacyColorValues: Record<string, string> = {
  "bg-amber-100 text-amber-700": "#facc15",
  "bg-red-100 text-red-500": "#ef4444",
  "bg-green-100 text-green-600": "#22c55e",
  "bg-cyan-100 text-cyan-600": "#06b6d4",
  "bg-violet-100 text-violet-500": "#8b5cf6",
  "bg-orange-100 text-orange-500": "#f59e0b",
  "bg-pink-100 text-pink-500": "#ec4899",
  "bg-emerald-100 text-emerald-500": "#10b981",
  "bg-blue-100 text-blue-500": "#3b82f6",
  "bg-amber-100 text-amber-600": "#d97706",
  "bg-indigo-100 text-indigo-500": "#6366f1",
  "bg-slate-100 text-slate-500": "#64748b",
};

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "Truck",
      totalBudget: 0,
      color: DEFAULT_COLOR,
    },
  });

  const selectedIcon = useWatch({ control, name: "icon" });
  const selectedColor = useWatch({ control, name: "color" });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        icon: initialData.icon,
        totalBudget: initialData.totalBudget,
        color:
          legacyColorValues[initialData.color ?? ""] ??
          initialData.color ??
          DEFAULT_COLOR,
      });
    } else {
      reset({
        name: "",
        icon: "Truck",
        totalBudget: 0,
        color: DEFAULT_COLOR,
      });
    }
  }, [initialData, reset]);

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
<<<<<<< HEAD
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="max-h-[calc(100vh-32px)] w-full max-w-[553px] overflow-y-auto rounded-[20px] border border-slate-900/10 bg-white shadow-[0_31px_31px_rgba(0,0,0,0.25)] dark:border-slate-700 dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b border-slate-900/10 px-6 py-6 dark:border-slate-700">
          <h2
            id="category-form-title"
            className="text-2xl font-bold text-[#003377] dark:text-slate-100"
          >
            {initialData ? "កែសម្រួលប្រភេទ" : "បង្កើតប្រភេទថ្មី"}
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#003377] font-google-sans">
            {initialData ? 'កែសម្រួលប្រភេទ' : 'បង្កើតប្រភេទថ្មី'}
>>>>>>> feature/admin-api-integration
          </h2>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label="បិទ"
            className="flex size-10 items-center justify-center rounded-[15px] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] disabled:opacity-50 dark:hover:bg-slate-800"
          >
            <Image
              src="/categories/form-close.svg"
              alt=""
              width={20}
              height={20}
            />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-lg font-bold text-[#003377] dark:text-slate-100"
            >
              ឈ្មោះប្រភេទ
            </label>
            <input
              id="category-name"
              type="text"
              autoFocus
              {...register("name")}
              placeholder="ការថែទាំ..."
              className="h-[51px] w-full rounded-[20px] border border-slate-900/10 bg-slate-100 px-4 text-base text-slate-800 outline-none transition placeholder:text-[#7a8088] focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="mt-5">
            <label
              htmlFor="category-budget"
              className="mb-2 block text-lg font-bold text-[#003377] dark:text-slate-100"
            >
              ថវិការ (USD)
            </label>
            <div className="relative">
              <Image
                src="/categories/form-dollar.svg"
                alt=""
                width={19}
                height={19}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2"
              />
              <input
                id="category-budget"
                type="number"
                step="any"
                {...register("totalBudget", { valueAsNumber: true })}
                placeholder="200"
                className="h-[51px] w-full rounded-[20px] border border-slate-900/10 bg-slate-100 py-3 pl-11 pr-4 text-base text-slate-800 outline-none transition placeholder:text-[#7a8088] focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            {errors.totalBudget && (
              <p className="mt-1 text-xs text-red-500">
                {errors.totalBudget.message}
              </p>
            )}
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-lg font-bold text-[#003377] dark:text-slate-100">
              ពណ៌
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_COLORS.map((color) => {
                const isSelected = selectedColor === color.value;

                return (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={color.label}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setValue("color", color.value, { shouldDirty: true })
                    }
                    className="size-10 rounded-full border-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: color.value,
                      borderColor: isSelected ? "#0f172a" : "transparent",
                    }}
                  />
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="mb-2 text-lg font-bold text-[#003377] dark:text-slate-100">
              រូបតំណាង
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_ICONS.map((icon) => {
                const isSelected = selectedIcon === icon.value;

                return (
                  <button
                    key={icon.value}
                    type="button"
                    aria-label={icon.label}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setValue("icon", icon.value, { shouldDirty: true })
                    }
                    className={`flex size-11 items-center justify-center rounded-[20px] border-2 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15] ${
                      isSelected
                        ? "border-[#facc15] bg-[#facc15]/10"
                        : "border-slate-900/10 bg-white dark:border-slate-600 dark:bg-slate-900"
                    }`}
                  >
                    <Image src={icon.asset} alt="" width={20} height={20} />
                  </button>
                );
              })}
            </div>
            {errors.icon && (
              <p className="mt-1 text-xs text-red-500">{errors.icon.message}</p>
            )}
          </fieldset>

          <div className="mt-5 flex gap-3.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="h-[51px] flex-1 rounded-[20px] border border-slate-900/10 bg-white px-5 text-base font-bold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-[51px] flex-1 rounded-[20px] bg-[#facc15] px-5 text-base font-bold text-slate-900 shadow-[0_2px_3px_rgba(0,0,0,0.12)] transition hover:bg-[#f4c20d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading
                ? "កំពុងរក្សាទុក..."
                : initialData
                  ? "រក្សាទុក"
                  : "បង្កើត"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
