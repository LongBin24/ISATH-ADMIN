"use client";

import Image from "next/image";
import Link from "next/link";
import { FolderTree } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import { DynamicIcon } from "@/features/categories/components/DynamicIcon";
import {
  categoryColorStyles,
  categoryIconAssets,
  defaultCategoryStyle,
  formatCategoryCurrency,
} from "@/features/categories/presentation";
import { Category, CategoryTransaction } from "@/features/categories/types";

const transactionIcons = [
  "/categories/transaction-1.svg",
  "/categories/transaction-2.svg",
  "/categories/transaction-3.svg",
  "/categories/transaction-4.svg",
  "/categories/transaction-5.svg",
];

function getRecentTransactions(category: Category): CategoryTransaction[] {
  if (category.recentTransactions?.length) {
    return category.recentTransactions.slice(0, 5);
  }

  if (category.transactionCount <= 0) return [];

  const itemCount = Math.min(category.transactionCount, 5);
  const total = category.spentAmount ?? 0;

  return Array.from({ length: itemCount }, (_, index) => {
    const amount =
      index === itemCount - 1
        ? total - Math.floor((total / itemCount) * 100) / 100 * (itemCount - 1)
        : Math.floor((total / itemCount) * 100) / 100;

    return {
      id: `${category.id}-${index}`,
      title: category.type === "income" ? "ចំណូល" : "ទូទាត់",
      date: `${String(20 - index).padStart(2, "0")}/07/2026`,
      amount: Math.max(amount, 0),
    };
  });
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const category = categories?.find((item) => String(item.id) === id);

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-[#003377] dark:text-slate-300">
        <FolderTree className="size-8 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white/60 text-center dark:border-slate-700 dark:bg-slate-900/60">
        <FolderTree className="mb-3 size-9 text-slate-400" />
        <h1 className="text-xl font-bold text-[#003377] dark:text-slate-100">
          រកមិនឃើញប្រភេទនេះទេ
        </h1>
        <Link
          href="/categories"
          className="mt-4 rounded-xl bg-[#facc15] px-4 py-2 text-sm font-bold text-[#003377]"
        >
          ត្រឡប់ទៅប្រភេទ
        </Link>
      </div>
    );
  }

  const isIncome = (category.type ?? "expense").toLowerCase() === "income";
  const amount = category.spentAmount ?? 0;
  const progress = category.totalBudget
    ? Math.min((amount / category.totalBudget) * 100, 100)
    : 0;
  const percentage = Math.round(progress);
  const styles =
    categoryColorStyles[category.color ?? ""] ?? defaultCategoryStyle;
  const iconAsset = categoryIconAssets[category.icon];
  const detailIcon =
    category.icon === "Utensils"
      ? "/categories/detail-utensils.svg"
      : iconAsset;
  const transactions = getRecentTransactions(category);
  const typeLabel = isIncome ? "ចំណូល" : "ចំណាយ";

  return (
    <div className="min-h-full w-full bg-[#F8F9FA] dark:bg-slate-950">
      <header className="flex items-center gap-4">
        <Link
          href="/categories"
          aria-label="ត្រឡប់ទៅប្រភេទ"
          className="flex size-11 shrink-0 items-center justify-center rounded-[20px] transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] dark:hover:bg-slate-800"
        >
          <Image src="/categories/back.svg" alt="" width={25} height={25} />
        </Link>
        <div>
          <h1 className="text-[32px] font-bold leading-tight text-[#003377] dark:text-slate-100">
            {category.name}
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            ប្រភេទ{typeLabel}
          </p>
        </div>
      </header>

      <div className="mt-[30px] grid gap-[30px] lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
        <aside className="space-y-5">
          <section className="flex min-h-[234px] flex-col items-center rounded-[20px] border border-slate-900/10 bg-white p-8 shadow-[0_2px_3px_rgba(0,0,0,0.12)] dark:border-slate-700 dark:bg-slate-900">
            <div
              className={`flex size-[102px] items-center justify-center rounded-[30px] ${styles.icon}`}
            >
              <div className="relative size-12">
                {detailIcon ? (
                  <Image
                    src={detailIcon}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                ) : (
                  <DynamicIcon name={category.icon} className="size-12" />
                )}
              </div>
            </div>
            <h2 className="mt-5 text-center text-2xl font-bold text-[#003377] dark:text-slate-100">
              {category.name}
            </h2>
            <span
              className={`mt-2 rounded-full px-4 py-1 text-sm ${styles.badge}`}
              style={{ color: styles.accent }}
            >
              {typeLabel}
            </span>
          </section>

          <section className="rounded-[20px] border border-slate-900/10 bg-white p-[26px] shadow-[0_2px_3px_rgba(0,0,0,0.12)] dark:border-slate-700 dark:bg-slate-900">
            <dl className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-base text-slate-500 dark:text-slate-400">
                  ប្រតិបត្តិការ
                </dt>
                <dd className="text-xl font-bold text-[#003377] dark:text-slate-100">
                  {category.transactionCount}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-base text-slate-500 dark:text-slate-400">
                  {isIncome ? "ចំណូលសរុប" : "ចំណាយសរុប"}
                </dt>
                <dd
                  className={`text-xl font-bold ${
                    isIncome ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {formatCategoryCurrency(amount)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-base text-slate-500 dark:text-slate-400">
                  {isIncome ? "គោលដៅ" : "ថវិការ"}
                </dt>
                <dd className="text-xl font-bold text-[#003377] dark:text-slate-100">
                  {formatCategoryCurrency(category.totalBudget)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-slate-900/10 pt-4 dark:border-slate-700">
              <div className="flex items-center justify-between text-base text-slate-500 dark:text-slate-400">
                <span>{isIncome ? "ការសម្រេច" : "ការប្រើប្រាស់"}</span>
                <span className="text-sm font-bold" style={{ color: styles.accent }}>
                  {percentage}%
                </span>
              </div>
              <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${progress}%`, backgroundColor: styles.accent }}
                />
              </div>
            </div>
          </section>
        </aside>

        <section className="min-h-[544px] rounded-[20px] border border-slate-900/10 bg-white p-[26px] shadow-[0_2px_3px_rgba(0,0,0,0.12)] dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-bold text-[#003377] dark:text-slate-100">
              ប្រតិបត្តិការចុងក្រោយ
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {category.transactionCount} សរុប
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            {transactions.map((transaction, index) => {
              const transactionIcon =
                category.icon === "Utensils"
                  ? transactionIcons[index]
                  : iconAsset;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 rounded-[20px] p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/70"
                >
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-[20px] ${styles.icon}`}
                  >
                    <div className="relative size-5">
                      {transactionIcon ? (
                        <Image
                          src={transactionIcon}
                          alt=""
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      ) : (
                        <DynamicIcon name={category.icon} className="size-5" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-bold text-[#003377] dark:text-slate-100">
                      {transaction.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {transaction.date}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-lg font-bold ${
                      isIncome ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCategoryCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
            {!transactions.length && (
              <div className="flex min-h-72 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                <FolderTree className="mb-3 size-8" />
                <p>មិនទាន់មានប្រតិបត្តិការទេ</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
