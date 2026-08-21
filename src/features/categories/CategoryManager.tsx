"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  ArrowUpToLine,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Eye,
  EyeOff,
  FolderTree,
  MoreHorizontal,
  Move,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Tags,
  Trash2,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DynamicIcon } from "./components/DynamicIcon";
import {
  type AdminCreateCategoryPayload,
  type CategoryQueryParams,
  type UpdateCategoryPayload,
  useCreateAdminCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminCategoriesQuery,
  useUpdateCategoryMutation,
} from "./categoryApi";
import type { Category } from "./types";
import { useAdminI18n } from "@/i18n/admin-i18n";

type CategoryType = "ALL" | "INCOME" | "EXPENSE" | "BOTH";
type CategoryStatus = "ALL" | "ACTIVE" | "INACTIVE" | "DELETED";
type Classification = "ALL" | "SYSTEM" | "DEFAULT" | "CUSTOM";
type Level = "ALL" | "ROOT";
type ConfirmAction = { kind: "activate" | "deactivate" | "delete" | "root"; category: Category } | null;
type FormState = {
  name: string;
  categoryType: Exclude<CategoryType, "ALL">;
  parentId: string;
  categoryKey: string;
  icon: string;
  color: string;
  systemCategory: boolean;
  defaultCategory: boolean;
  status: Exclude<CategoryStatus, "ALL" | "DELETED">;
};

const ICONS = ["Utensils", "Car", "Home", "ShoppingBag", "WalletCards", "BriefcaseBusiness", "Heart", "GraduationCap", "Plane", "Coffee", "Music", "Box"];
const COLORS = ["#F59E0B", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444", "#06B6D4", "#64748B"];
const EMPTY_FORM: FormState = { name: "", categoryType: "EXPENSE", parentId: "", categoryKey: "", icon: "Box", color: "#F59E0B", systemCategory: false, defaultCategory: false, status: "ACTIVE" };

function friendlyType(type?: string) {
  if (type?.toLowerCase() === "income") return "Income";
  if (type?.toLowerCase() === "both") return "Income & Expense";
  return "Expense";
}

function categoryTypeValue(type?: string): FormState["categoryType"] {
  return type?.toLowerCase() === "income" ? "INCOME" : type?.toLowerCase() === "both" ? "BOTH" : "EXPENSE";
}

function exactDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "PPp");
}

function errorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("data" in error)) return fallback;
  const data = (error as { data?: unknown }).data;
  if (typeof data !== "object" || data === null || !("message" in data)) return fallback;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.length < 240 ? message : fallback;
}

function queryForClassification(value: Classification): Pick<CategoryQueryParams, "systemCategory" | "defaultCategory"> {
  if (value === "SYSTEM") return { systemCategory: true };
  if (value === "DEFAULT") return { defaultCategory: true };
  if (value === "CUSTOM") return { systemCategory: false, defaultCategory: false };
  return {};
}

export default function CategoryManager() {
  const { t } = useAdminI18n();
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword.trim());
  const [type, setType] = useState<CategoryType>("ALL");
  const [status, setStatus] = useState<CategoryStatus>("ALL");
  const [classification, setClassification] = useState<Classification>("ALL");
  const [level, setLevel] = useState<Level>("ALL");
  const [includeHidden, setIncludeHidden] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Category | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const listParams = useMemo<CategoryQueryParams>(() => ({
    ...(deferredKeyword ? { keyword: deferredKeyword } : {}),
    ...(type !== "ALL" ? { type } : {}),
    ...(status !== "ALL" ? { status } : {}),
    ...queryForClassification(classification),
    ...(level === "ROOT" ? { rootOnly: true } : {}),
    includeHidden,
    pageNumber,
    pageSize,
    sortBy: "name",
    sortDirection: "ASC",
  }), [classification, deferredKeyword, includeHidden, level, pageNumber, pageSize, status, type]);

  const categoriesQuery = useGetAdminCategoriesQuery(listParams);
  const totalQuery = useGetAdminCategoriesQuery({ pageNumber: 0, pageSize: 1, includeHidden: true });
  const incomeQuery = useGetAdminCategoriesQuery({ type: "INCOME", pageNumber: 0, pageSize: 1, includeHidden: true });
  const expenseQuery = useGetAdminCategoriesQuery({ type: "EXPENSE", pageNumber: 0, pageSize: 1, includeHidden: true });
  const systemQuery = useGetAdminCategoriesQuery({ systemCategory: true, pageNumber: 0, pageSize: 1, includeHidden: true });
  const [createCategory, createState] = useCreateAdminCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();
  const page = categoriesQuery.data;
  const totalPages = Math.max(1, page?.totalPages ?? 1);
  const safePage = Math.min(pageNumber, Math.max(0, totalPages - 1));
  const categories = page?.content ?? [];

  const pageNumbers = useMemo(() => {
    const start = Math.max(0, Math.min(safePage - 2, totalPages - 5));
    return Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
  }, [safePage, totalPages]);

  function resetFilters() {
    setKeyword(""); setType("ALL"); setStatus("ALL"); setClassification("ALL"); setLevel("ALL"); setIncludeHidden(true); setPageNumber(0);
  }

  function openCreate() { setEditing(null); setFormOpen(true); }
  function openEdit(category: Category) { setEditing(category); setFormOpen(true); }

  async function runConfirm() {
    if (!confirmAction) return;
    const { category, kind } = confirmAction;
    try {
      if (kind === "delete") {
        await deleteCategory(category.id).unwrap();
        toast.success(`${category.name} deleted successfully.`);
        if (selected?.id === category.id) { setDetailOpen(false); setSelected(null); }
      } else {
        const data: UpdateCategoryPayload = kind === "root" ? { moveToRoot: true } : { status: kind === "activate" ? "ACTIVE" : "INACTIVE" };
        const updated = await updateCategory({ id: category.id, data }).unwrap();
        if (selected?.id === updated.id) setSelected(updated);
        toast.success(kind === "root" ? `${category.name} moved to root.` : `${category.name} ${kind}d successfully.`);
      }
      setConfirmAction(null);
    } catch (error) {
      toast.error(errorMessage(error, `Unable to ${kind} ${category.name}.`));
    }
  }

  const statLoading = totalQuery.isLoading || incomeQuery.isLoading || expenseQuery.isLoading || systemQuery.isLoading;
  const start = page?.totalElements ? safePage * pageSize + 1 : 0;
  const end = Math.min((safePage + 1) * pageSize, page?.totalElements ?? 0);

  const hasActiveFilters = Boolean(
    deferredKeyword ||
      type !== "ALL" ||
      status !== "ALL" ||
      classification !== "ALL" ||
      level !== "ALL" ||
      !includeHidden
  );

  return (
    <div className="space-y-7 font-google-sans">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">{t("Category Management")}</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground font-normal">{t("Manage income, expense, system, default, and hierarchical categories used throughout iStash.")}</p>
        </div>
        <Button size="lg" onClick={openCreate} className="bg-[#FEDB55] text-base font-medium text-[#003377] hover:bg-[#f0ca43]">
          <Plus className="mr-2 size-4" />{t("Add Category")}
        </Button>
      </header>

      <div className="admin-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statLoading ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-2xl" />) : <>
          <StatCard icon={Tags} label={t("Total Categories")} value={totalQuery.data?.totalElements ?? "—"} helper={t("All categories")} />
          <StatCard icon={CircleDollarSign} label={t("Income")} value={incomeQuery.data?.totalElements ?? "—"} helper={t("Income categories")} />
          <StatCard icon={WalletCards} label={t("Expense")} value={expenseQuery.data?.totalElements ?? "—"} helper={t("Expense categories")} />
          <StatCard icon={ShieldCheck} label={t("System Categories")} value={systemQuery.data?.totalElements ?? "—"} helper={t("Managed by iStash")} />
        </>}
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">{t("Categories")}</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">{t("Search, organize, and manage the category hierarchy.")}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(event) => { setKeyword(event.target.value); setPageNumber(0); }}
                placeholder={t("Search by category name or keyword...")}
                className="h-11 rounded-xl pl-9 pr-8 text-sm"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => { setKeyword(""); setPageNumber(0); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect label="Type" value={type} options={{ ALL: t("All Types"), INCOME: t("Income"), EXPENSE: t("Expense"), BOTH: t("Income & Expense") }} onChange={(value) => { setType(value as CategoryType); setPageNumber(0); }} />
              <FilterSelect label="Status" value={status} options={{ ALL: t("All Statuses"), ACTIVE: t("Active"), INACTIVE: t("Inactive"), DELETED: t("Deleted") }} onChange={(value) => { setStatus(value as CategoryStatus); setPageNumber(0); }} />
              <FilterSelect label="Classification" value={classification} options={{ ALL: t("All Categories"), SYSTEM: t("System Categories"), DEFAULT: t("Default Categories"), CUSTOM: t("Custom Categories") }} onChange={(value) => { setClassification(value as Classification); setPageNumber(0); }} />
              <FilterSelect label="Level" value={level} options={{ ALL: t("All Levels"), ROOT: t("Root Categories") }} onChange={(value) => { setLevel(value as Level); setPageNumber(0); }} />
              {hasActiveFilters && (
                <>
                  <FilterSelect label="Visibility" value={includeHidden ? "ALL" : "VISIBLE"} options={{ ALL: t("Include Hidden"), VISIBLE: t("Visible Only") }} onChange={(value) => { setIncludeHidden(value === "ALL"); setPageNumber(0); }} />
                  <Button variant="ghost" className="h-11 shrink-0 rounded-xl px-3 text-sm font-medium" onClick={resetFilters}>{t("Reset")}</Button>
                </>
              )}
            </div>
          </div>

          {categoriesQuery.isError ? (
            <ErrorState onRetry={() => categoriesQuery.refetch()} />
          ) : categoriesQuery.isLoading || (categoriesQuery.isFetching && !page) ? (
            <TableSkeleton />
          ) : categories.length === 0 ? (
            <EmptyState filtered={hasActiveFilters} onReset={resetFilters} onCreate={openCreate} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-64 text-base font-semibold">{t("Category")}</TableHead>
                      <TableHead className="text-base font-semibold">{t("Type")}</TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">{t("Parent")}</TableHead>
                      <TableHead className="min-w-40 text-base font-semibold">{t("Classification")}</TableHead>
                      <TableHead className="text-base font-semibold">{t("Status")}</TableHead>
                      <TableHead className="min-w-40 text-base font-semibold">{t("Updated")}</TableHead>
                      <TableHead className="w-14 text-right text-base font-semibold">{t("Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        onView={() => { setSelected(category); setDetailOpen(true); }}
                        onEdit={() => openEdit(category)}
                        onConfirm={(kind) => setConfirmAction({ kind, category })}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-base sm:flex-row">
                <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                  <span>
                    Showing <span className="font-medium text-foreground">{start}</span>–<span className="font-medium text-foreground">{end}</span> of <span className="font-medium text-foreground">{(page?.totalElements ?? 0).toLocaleString()}</span> {t("categories")}
                  </span>
                  <div className="admin-page-size">
                    <Select
                      value={String(pageSize)}
                      onValueChange={(val) => {
                        setPageSize(Number(val));
                        setPageNumber(0);
                      }}
                    >
                      <SelectTrigger className="h-10 w-32 text-sm">
                        <SelectValue value={`${pageSize} / page`} />
                      </SelectTrigger>
                      <SelectContent
                        value={String(pageSize)}
                        onValueChange={(val) => {
                          setPageSize(Number(val));
                          setPageNumber(0);
                        }}
                      >
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="20">20 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {totalPages > 1 && (
                  <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          disabled={safePage === 0}
                          onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
                        />
                      </PaginationItem>
                      {pageNumbers.map((num) => (
                        <PaginationItem key={num}>
                          <PaginationLink
                            isActive={num === safePage}
                            onClick={() => setPageNumber(num)}
                          >
                            {num + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          disabled={safePage >= totalPages - 1}
                          onClick={() => setPageNumber((p) => Math.min(totalPages - 1, p + 1))}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CategoryDetailSheet category={selected} open={detailOpen} onOpenChange={setDetailOpen} onEdit={openEdit} />
      <CategoryFormDialog category={editing} open={formOpen} onOpenChange={setFormOpen} onSaved={(category) => { if (selected?.id === category.id) setSelected(category); }} createCategory={createCategory} updateCategory={updateCategory} isLoading={createState.isLoading || updateState.isLoading} />
      <ConfirmationDialog action={confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)} onConfirm={runConfirm} isLoading={deleteState.isLoading || updateState.isLoading} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper }: { icon: typeof Tags; label: string; value: React.ReactNode; helper: string }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="flex gap-4 p-5 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:text-[#FEDB55]">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground font-normal">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({ label, value, options, onChange, compact = false }: { label: string; value: string; options: Record<string, string>; onChange: (value: string) => void; compact?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-11 rounded-xl text-sm ${compact ? "admin-page-size w-36" : "w-auto min-w-[130px]"}`}>
        <SelectValue value={options[value]} />
      </SelectTrigger>
      <SelectContent value={value} onValueChange={onChange}>
        {Object.entries(options).map(([key, text]) => (
          <SelectItem key={key} value={key}>{text}</SelectItem>
        ))}
      </SelectContent>
      <span className="sr-only">{label}</span>
    </Select>
  );
}

function TypeBadge({ type }: { type?: string }) {
  const { t } = useAdminI18n();
  const income = type?.toLowerCase() === "income";
  const both = type?.toLowerCase() === "both";
  return (
    <Badge
      variant="outline"
      className={
        income
          ? "border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
          : both
            ? "border-blue-200 bg-blue-50 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
            : "border-amber-200 bg-amber-50 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
      }
    >
      {t(friendlyType(type))}
    </Badge>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const { t } = useAdminI18n();
  const active = status === "ACTIVE";
  return (
    <Badge
      variant="outline"
      className={
        active
          ? "gap-1 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
          : status === "DELETED"
            ? "gap-1 border-red-200 bg-red-50 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300"
            : "gap-1 border-slate-200 bg-slate-100 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }
    >
      {active ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
      {t(active ? "Active" : status === "DELETED" ? "Deleted" : "Inactive")}
    </Badge>
  );
}

function ClassificationBadge({ category }: { category: Category }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="gap-1 text-sm">
        {category.systemCategory ? <ShieldCheck className="size-3.5" /> : category.defaultCategory ? <Star className="size-3.5" /> : <Tags className="size-3.5" />}
        {t(category.systemCategory ? "System" : category.defaultCategory ? "Default" : "Custom")}
      </Badge>
      {category.systemCategory && category.defaultCategory && (
        <Tooltip>
          <TooltipTrigger><Star className="size-4 text-amber-500" /></TooltipTrigger>
          <TooltipContent>{t("Default Category")}</TooltipContent>
        </Tooltip>
      )}
      {category.hiddenForCurrentUser && (
        <Tooltip>
          <TooltipTrigger><EyeOff className="size-4 text-muted-foreground" /></TooltipTrigger>
          <TooltipContent>{t("Hidden")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function CategoryRow({ category, onView, onEdit, onConfirm }: { category: Category; onView: () => void; onEdit: () => void; onConfirm: (kind: NonNullable<ConfirmAction>["kind"]) => void }) {
  const { t } = useAdminI18n();
  const deleted = category.status === "DELETED";
  return (
    <TableRow className="cursor-pointer" onClick={onView}>
      <TableCell className="py-3.5">
        <div className={`flex items-center gap-3 ${category.parentId ? "pl-6" : ""}`}>
          {category.parentId && <span className="text-lg text-muted-foreground">↳</span>}
          <span className="size-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: category.color || "#64748B" }} />
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted">
            <DynamicIcon name={category.icon || "Tags"} className="size-5" />
          </span>
          <div>
            <p className="text-base font-medium text-foreground">{category.name}</p>
            <p className="text-sm text-muted-foreground">{category.categoryKey || "—"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3.5"><TypeBadge type={category.type} /></TableCell>
      <TableCell className="py-3.5 text-base text-foreground">{category.parentName || t("Root")}</TableCell>
      <TableCell className="py-3.5"><ClassificationBadge category={category} /></TableCell>
      <TableCell className="py-3.5"><StatusBadge status={category.status} /></TableCell>
      <TableCell className="py-3.5 text-base text-muted-foreground">{exactDate(category.updatedAt)}</TableCell>
      <TableCell className="py-3.5 text-right" onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label={`${category.name} actions`}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onView}>
              <Eye className="size-4" />{t("View Details")}
            </DropdownMenuItem>
            {!deleted && (
              <>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="size-4" />{t("Edit Category")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Move className="size-4" />{t("Move Category")}
                </DropdownMenuItem>
                {category.parentId && (
                  <DropdownMenuItem onClick={() => onConfirm("root")}>
                    <ArrowUpToLine className="size-4" />{t("Move to Root")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onConfirm(category.status === "ACTIVE" ? "deactivate" : "activate")}>
                  {category.status === "ACTIVE" ? <XCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
                  {t(category.status === "ACTIVE" ? "Deactivate" : "Activate")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onClick={() => onConfirm("delete")}>
                  <Trash2 className="size-4" />{t("Delete Category")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function CategoryDetailSheet({ category, open, onOpenChange, onEdit }: { category: Category | null; open: boolean; onOpenChange: (open: boolean) => void; onEdit: (category: Category) => void }) {
  const { t } = useAdminI18n();
  if (!category) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-xl" onClose={() => onOpenChange(false)}>
        <SheetHeader>
          <SheetTitle>{t("Category Details")}</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-muted">
              <DynamicIcon name={category.icon || "Tags"} className="size-7" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full" style={{ backgroundColor: category.color || "#64748B" }} />
                <h3 className="text-2xl font-semibold">{category.name}</h3>
              </div>
              <p className="text-base text-muted-foreground">{category.categoryKey || "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <TypeBadge type={category.type} />
            <ClassificationBadge category={category} />
            <StatusBadge status={category.status} />
          </div>
          <Separator />
          <DetailSection title={t("Category Information")}>
            <Detail label={t("Name")} value={category.name} />
            <Detail label={t("Type")} value={t(friendlyType(category.type))} />
            <Detail label={t("Parent")} value={category.parentName || t("Root")} />
            <Detail label={t("Category Key")} value={category.categoryKey || "—"} />
            <Detail label={t("Default Category")} value={category.defaultCategory ? t("Yes") : t("No")} />
            <Detail label={t("System Category")} value={category.systemCategory ? t("Yes") : t("No")} />
            <Detail label={t("Hidden")} value={category.hiddenForCurrentUser ? t("Yes") : t("No")} />
          </DetailSection>
          <DetailSection title={t("Appearance")}>
            <Detail label={t("Icon")} value={category.icon || "Fallback icon"} />
            <Detail label={t("Color")} value={category.color || "—"} />
          </DetailSection>
          <DetailSection title={t("Timeline")}>
            <Detail label={t("Created")} value={exactDate(category.createdAt)} />
            <Detail label={t("Updated")} value={exactDate(category.updatedAt)} />
            <Detail label={t("Deleted")} value={exactDate(category.deletedAt)} />
          </DetailSection>
        </SheetBody>
        {category.status !== "DELETED" && (
          <SheetFooter>
            <Button onClick={() => onEdit(category)}>
              <Pencil className="mr-2 size-4" />{t("Edit Category")}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <span className="text-base text-muted-foreground">{label}</span>
      <span className="text-right text-base font-medium">{value}</span>
    </div>
  );
}

function ParentSelector({ value, onChange, excludedId }: { value: string; onChange: (value: string) => void; excludedId?: string }) {
  const { t } = useAdminI18n();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const rootsQuery = useGetAdminCategoriesQuery({ rootOnly: true, ...(deferredSearch ? { keyword: deferredSearch } : {}), status: "ACTIVE", pageNumber: 0, pageSize: 100, sortBy: "name", sortDirection: "ASC" });
  const options = rootsQuery.data?.content.filter((category) => category.id !== excludedId) ?? [];
  const selectedName = options.find((category) => category.id === value)?.name;

  return (
    <Popover>
      <PopoverTrigger className="flex h-11 w-full items-center justify-between rounded-xl border border-input px-3 text-left text-base">
        <span className="truncate">{value ? selectedName || t("Selected parent") : t("None — Root Category")}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-3rem))] space-y-2 p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search root categories...")} className="pl-9 text-base" />
        </div>
        <div className="max-h-56 overflow-y-auto">
          <button type="button" onClick={() => onChange("")} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent">
            <span>{t("None — Root Category")}</span>
            {!value && <Check className="size-4" />}
          </button>
          {rootsQuery.isLoading ? (
            <Skeleton className="m-2 h-24" />
          ) : (
            options.map((category) => (
              <button key={category.id} type="button" onClick={() => onChange(category.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-accent">
                <span>
                  <span className="block text-sm font-medium">{category.name}</span>
                  <span className="block text-xs text-muted-foreground">{category.categoryKey || t(friendlyType(category.type))}</span>
                </span>
                {value === category.id && <Check className="size-4" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CategoryFormDialog({ category, open, onOpenChange, onSaved, createCategory, updateCategory, isLoading }: { category: Category | null; open: boolean; onOpenChange: (open: boolean) => void; onSaved: (category: Category) => void; createCategory: (payload: AdminCreateCategoryPayload) => { unwrap: () => Promise<Category> }; updateCategory: (payload: { id: string; data: UpdateCategoryPayload }) => { unwrap: () => Promise<Category> }; isLoading: boolean }) {
  const initial = useMemo<FormState>(() => category ? { name: category.name, categoryType: categoryTypeValue(category.type), parentId: category.parentId || "", categoryKey: category.categoryKey || "", icon: category.icon || "Box", color: category.color || "#F59E0B", systemCategory: Boolean(category.systemCategory), defaultCategory: Boolean(category.defaultCategory), status: category.status === "INACTIVE" ? "INACTIVE" : "ACTIVE" } : EMPTY_FORM, [category]);
  const formKey = `${category?.id ?? "new"}-${open}`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={formKey} onClose={() => onOpenChange(false)} className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <CategoryFormContents
          initial={initial}
          category={category}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (current) => {
            try {
              const saved = category
                ? await updateCategory({ id: category.id, data: { name: current.name.trim(), categoryType: current.categoryType, ...(current.parentId ? { parentId: current.parentId } : { moveToRoot: true }), icon: current.icon, color: current.color, defaultCategory: current.defaultCategory, status: current.status } }).unwrap()
                : await createCategory({ name: current.name.trim(), categoryType: current.categoryType, ...(current.parentId ? { parentId: current.parentId } : {}), categoryKey: current.categoryKey, icon: current.icon, color: current.color, systemCategory: current.systemCategory, defaultCategory: current.defaultCategory }).unwrap();
              toast.success(category ? "Category updated successfully." : "Category created successfully.");
              onSaved(saved);
              onOpenChange(false);
            } catch (error) {
              toast.error(errorMessage(error, category ? "Unable to update category." : "Unable to create category."));
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function CategoryFormContents({ initial, category, isLoading, onCancel, onSubmit }: { initial: FormState; category: Category | null; isLoading: boolean; onCancel: () => void; onSubmit: (form: FormState) => void }) {
  const { t } = useAdminI18n();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => { setForm({ ...form, [key]: value }); setErrors({ ...errors, [key]: undefined }); };

  const submit = () => {
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = "Category name is required.";
    if (!category && !/^[A-Z][A-Z0-9_]*$/.test(form.categoryKey)) nextErrors.categoryKey = "Use uppercase letters, numbers, and underscores. Begin with a letter.";
    if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(form.color)) nextErrors.color = "Enter a valid 3, 6, or 8 digit hex color.";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{category ? t("Edit Category") : t("Add Category")}</DialogTitle>
        <DialogDescription className="text-base">
          {category ? t("Update category information and hierarchy.") : t("Create a new root category or subcategory for iStash.")}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="space-y-5">
        <div>
          <Label htmlFor="category-name" className="text-base">{t("Category Name")}</Label>
          <Input id="category-name" value={form.name} onChange={(event) => update("name", event.target.value)} maxLength={100} className="mt-2 h-11 text-base" />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-base">{t("Type")}</Label>
            <div className="mt-2">
              <FilterSelect label="Type" value={form.categoryType} options={{ INCOME: t("Income"), EXPENSE: t("Expense"), BOTH: t("Income & Expense") }} onChange={(value) => update("categoryType", value as FormState["categoryType"])} />
            </div>
          </div>
          <div>
            <Label className="text-base">{t("Parent Category")}</Label>
            <div className="mt-2">
              <ParentSelector value={form.parentId} excludedId={category?.id} onChange={(value) => update("parentId", value)} />
            </div>
          </div>
        </div>
        {!category && (
          <div>
            <Label htmlFor="category-key" className="text-base">{t("Category Key")}</Label>
            <Input id="category-key" value={form.categoryKey} onChange={(event) => update("categoryKey", event.target.value.toUpperCase())} maxLength={100} placeholder="FOOD_DINING" className="mt-2 h-11 font-mono text-base uppercase" />
            <p className="mt-1 text-sm text-muted-foreground">Use uppercase letters, numbers, and underscores. Must begin with a letter.</p>
            {errors.categoryKey && <p className="mt-1 text-sm text-destructive">{errors.categoryKey}</p>}
          </div>
        )}
        <div>
          <Label className="text-base">{t("Icon")}</Label>
          <div className="mt-2 grid grid-cols-6 gap-2 sm:grid-cols-12">
            {ICONS.map((icon) => (
              <Tooltip key={icon}>
                <TooltipTrigger>
                  <button type="button" onClick={() => update("icon", icon)} className={`grid size-10 place-items-center rounded-xl border ${form.icon === icon ? "border-[#FEDB55] bg-[#FEDB55]/20" : "border-border"}`}>
                    <DynamicIcon name={icon} className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{icon}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="category-color" className="text-base">{t("Color")}</Label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {COLORS.map((color) => (
              <button key={color} type="button" aria-label={`Use ${color}`} onClick={() => update("color", color)} className={`size-9 rounded-full border-2 ${form.color.toUpperCase() === color ? "border-foreground" : "border-transparent"}`} style={{ backgroundColor: color }} />
            ))}
            <Input id="category-color" value={form.color} onChange={(event) => update("color", event.target.value)} className="h-10 w-36 font-mono text-base" />
          </div>
          {errors.color && <p className="mt-1 text-sm text-destructive">{errors.color}</p>}
        </div>
        {!category && (
          <div className="grid gap-3 sm:grid-cols-2">
            <CheckField label={t("System Category")} checked={form.systemCategory} onChange={(checked) => update("systemCategory", checked)} />
            <CheckField label={t("Default Category")} checked={form.defaultCategory} onChange={(checked) => update("defaultCategory", checked)} />
          </div>
        )}
        {category && (
          <div>
            <Label className="text-base">{t("Status")}</Label>
            <div className="mt-2">
              <FilterSelect label="Status" value={form.status} options={{ ACTIVE: t("Active"), INACTIVE: t("Inactive") }} onChange={(value) => update("status", value as FormState["status"])} />
            </div>
          </div>
        )}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={isLoading} onClick={onCancel}>{t("Cancel")}</Button>
          <Button type="submit" disabled={isLoading} className="bg-[#FEDB55] text-[#003377] hover:bg-[#f0ca43]">
            {isLoading ? t("Saving...") : category ? t("Save Changes") : t("Create Category")}
          </Button>
        </div>
      </form>
    </>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-border p-3 text-base">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[#003377]" />
      {label}
    </label>
  );
}

function ConfirmationDialog({ action, onOpenChange, onConfirm, isLoading }: { action: ConfirmAction; onOpenChange: (open: boolean) => void; onConfirm: () => void; isLoading: boolean }) {
  const { t } = useAdminI18n();
  if (!action) return null;
  const copy = action.kind === "delete"
    ? { title: `Delete “${action.category.name}”?`, text: "This category may be referenced by existing configuration or subcategory relationships. Only continue when you are sure it is safe.", button: t("Delete Category") }
    : action.kind === "root"
      ? { title: `Move “${action.category.name}” to root?`, text: "This category will no longer be nested under its current parent.", button: t("Move to Root") }
      : action.kind === "activate"
        ? { title: `Activate “${action.category.name}”?`, text: "This category will become available where active categories are supported.", button: t("Activate") }
        : { title: `Deactivate “${action.category.name}”?`, text: "This category will no longer be available where only active categories can be selected.", button: t("Deactivate") };

  return (
    <AlertDialog open onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={() => onOpenChange(false)}>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction variant={action.kind === "delete" || action.kind === "deactivate" ? "destructive" : "default"} disabled={isLoading} onClick={onConfirm}>
            {isLoading ? t("Updating...") : copy.button}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4">
      <Skeleton className="mb-4 h-11 w-full" />
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="mb-3 h-14 w-full" />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-14 text-center">
      <FolderTree className="size-8 text-destructive" />
      <p className="text-lg font-semibold">{t("Unable to load categories.")}</p>
      <p className="text-base text-muted-foreground">{t("Please try again.")}</p>
      <Button variant="outline" onClick={onRetry}>{t("Retry")}</Button>
    </div>
  );
}

function EmptyState({ filtered, onReset, onCreate }: { filtered: boolean; onReset: () => void; onCreate: () => void }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      <FolderTree className="size-8 text-muted-foreground" />
      <p className="text-lg font-semibold">{filtered ? t("No categories found") : t("No categories yet")}</p>
      <p className="text-base text-muted-foreground">{filtered ? t("Try changing your search or filters.") : t("Create the first category used by iStash.")}</p>
      <Button onClick={filtered ? onReset : onCreate}>{filtered ? t("Reset Filters") : t("Add Category")}</Button>
    </div>
  );
}
