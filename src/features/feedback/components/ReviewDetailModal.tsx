"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Star, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteReviewMutation,
  useGetReviewByIdQuery,
  useUpdateReviewStatusMutation,
} from "../api";
import type { Review, ReviewStatus } from "../types";

interface ReviewDetailModalProps {
  reviewId: string | null;
  onClose: () => void;
}

const statuses: Array<{ value: ReviewStatus; label: string }> = [
  { value: "PENDING", label: "កំពុងរង់ចាំ" },
  { value: "IN_REVIEW", label: "កំពុងពិនិត្យ" },
  { value: "RESOLVED", label: "បានដោះស្រាយ" },
  { value: "CLOSED", label: "បានបិទ" },
];

function errorMessage(error: unknown) {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return "មិនអាចបំពេញសំណើនេះបានទេ។";
  }
  const data = (error as { data?: unknown }).data;
  if (typeof data === "object" && data !== null && "message" in data) {
    return String((data as { message: unknown }).message);
  }
  return "មិនអាចបំពេញសំណើនេះបានទេ។";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("km-KH", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function ReviewForm({ review, onClose }: { review: Review; onClose: () => void }) {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(review.reviewStatus);
  const [latestReviewNote, setLatestReviewNote] = useState(review.latestReviewNote ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateReviewStatusMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const ratings = [
    ["ផ្ទៃប្រើប្រាស់", review.uiRating],
    ["ដំណើរការ", review.performanceRating],
    ["ភាពងាយស្រួល", review.easeOfUseRating],
    ["មុខងារ", review.featureRating],
    ["សរុប", review.overallRating],
  ] as const;

  const handleSave = async () => {
    try {
      await updateStatus({ id: review.id, reviewStatus, latestReviewNote }).unwrap();
      toast.success("បានកែប្រែស្ថានភាពមតិកែលម្អ។");
      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(review.id).unwrap();
      toast.success("បានលុបមតិកែលម្អ។");
      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
        <div className="sm:col-span-2">
          <div className="mb-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>{review.reviewType}</span><span aria-hidden="true">•</span><span>{formatDate(review.createdAt)}</span>
          </div>
          <h2 id="review-detail-title" className="break-words text-xl font-bold text-[#003377] dark:text-white sm:text-2xl">{review.title}</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{review.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:gap-3 md:grid-cols-5">
          {ratings.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
              <div className="mt-1 flex items-center gap-1 font-bold text-slate-800 dark:text-white"><Star className="h-4 w-4 text-amber-400" /> {value ?? "—"}</div>
            </div>
          ))}
        </div>

        <dl className="space-y-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-700">
          <div><dt className="text-slate-500">លេខសម្គាល់អ្នកប្រើ</dt><dd className="break-all font-medium text-slate-800 dark:text-slate-100">{review.userId || "—"}</dd></div>
          <div><dt className="text-slate-500">ពិនិត្យដោយ</dt><dd className="break-all font-medium text-slate-800 dark:text-slate-100">{review.reviewedBy || "—"}</dd></div>
          <div><dt className="text-slate-500">ពេលវេលាពិនិត្យ</dt><dd className="font-medium text-slate-800 dark:text-slate-100">{formatDate(review.reviewedAt)}</dd></div>
          <div><dt className="text-slate-500">ពេលវេលាកែប្រែ</dt><dd className="font-medium text-slate-800 dark:text-slate-100">{formatDate(review.updatedAt)}</dd></div>
        </dl>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            ស្ថានភាព
            <select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value as ReviewStatus)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-700 dark:bg-slate-900">
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            កំណត់ចំណាំពិនិត្យ
            <textarea value={latestReviewNote} onChange={(event) => setLatestReviewNote(event.target.value)} rows={4} placeholder="បន្ថែមកំណត់ចំណាំសម្រាប់ការពិនិត្យ…" className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-700 dark:bg-slate-900" />
          </label>
        </div>

        {review.screenshotUrl && (
          <a href={review.screenshotUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#003377] underline-offset-4 hover:underline dark:text-blue-300 sm:col-span-2">
            មើលរូបថតអេក្រង់ដែលបានភ្ជាប់ <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-800 dark:bg-slate-950 sm:flex sm:items-center sm:gap-3 sm:p-6">
        {confirmDelete ? (
          <div className="mb-3 flex flex-1 flex-wrap items-center gap-2 sm:mb-0">
            <span className="text-sm text-rose-700 dark:text-rose-300">តើលុបជាអចិន្ត្រៃយ៍មែនទេ?</span>
            <button type="button" onClick={() => setConfirmDelete(false)} disabled={isDeleting} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">បោះបង់</button>
            <button type="button" onClick={handleDelete} disabled={isDeleting} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">{isDeleting ? "កំពុងលុប…" : "បញ្ជាក់"}</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="mb-3 inline-flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 sm:mb-0 sm:w-auto sm:flex-1 sm:justify-start"><Trash2 className="h-4 w-4" /> លុបមតិកែលម្អ</button>
        )}
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <button type="button" onClick={onClose} disabled={isUpdating || isDeleting} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">បោះបង់</button>
          <button type="button" onClick={handleSave} disabled={isUpdating || isDeleting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003377] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00285e] disabled:opacity-60">{isUpdating && <Loader2 className="h-4 w-4 animate-spin" />} រក្សាទុក</button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewDetailModal({ reviewId, onClose }: ReviewDetailModalProps) {
  const { data: review, isLoading, isError } = useGetReviewByIdQuery(reviewId ?? "", { skip: !reviewId });

  useEffect(() => {
    if (!reviewId) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, reviewId]);

  if (!reviewId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 font-google-sans sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="review-detail-title" className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-950 sm:h-auto sm:max-h-[90dvh] sm:rounded-3xl">
        <div className="z-10 flex shrink-0 justify-end border-b border-slate-100 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950 sm:border-0 sm:px-4 sm:pt-4 sm:pb-0">
          <button type="button" onClick={onClose} aria-label="បិទព័ត៌មានលម្អិត" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </div>
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center gap-2 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> កំពុងផ្ទុកមតិកែលម្អ…</div>
        ) : isError || !review ? (
          <div className="min-h-72 p-10 text-center text-rose-600">មិនអាចផ្ទុកមតិកែលម្អនេះបានទេ។</div>
        ) : (
          <ReviewForm key={`${review.id}-${review.updatedAt}`} review={review} onClose={onClose} />
        )}
      </section>
    </div>
  );
}
