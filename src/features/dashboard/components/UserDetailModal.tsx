"use client";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { User as UserIcon, Calendar, ShieldAlert, ShieldCheck, CheckCircle, XCircle, Phone, MapPin, Briefcase, X, RefreshCw } from "lucide-react";
import Image from "next/image";
import {
  useSuspendUserMutation,
  useReactivateUserMutation,
  useGetUserOnboardingQuery,
  useGetUserByIdQuery,
} from "@/features/user-manager/api";
import toast from "react-hot-toast";

export default function UserDetailModal({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: any | null;
}) {
  const userId = user?.id || user?.rawUser?.id || "";

  // 1. GET /api/v1/admin/users/{userId}
  const { data: userDetailRes, isLoading: isUserLoading } = useGetUserByIdQuery(userId, {
    skip: !userId || !open,
  });

  // 2. GET /api/v1/admin/users/{userId}/onboarding
  const { data: onboardingRes, isLoading: isOnboardingLoading } = useGetUserOnboardingQuery(userId, {
    skip: !userId || !open,
  });

  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [reactivateUser, { isLoading: isReactivating }] = useReactivateUserMutation();

  const raw = userDetailRes?.data || user?.rawUser;
  const isSuspended = raw?.accountStatus === "SUSPENDED" || user?.status === "suspended";
  const avatarUrl = raw?.profileImageUrl || user?.avatarUrl;
  const displayName =
    raw?.displayName ||
    (raw?.firstName ? `${raw?.firstName || ""} ${raw?.lastName || ""}`.trim() : null) ||
    user?.name ||
    "អ្នកប្រើប្រាស់";
  const email = raw?.email || user?.email || "";
  const phone = raw?.phoneNumber || "មិនមាន";
  const occupation = raw?.occupation || "មិនមាន";
  const city = raw?.city || raw?.countryCode || "មិនមាន";
  const joinedDate = raw?.createdAt
    ? new Date(raw.createdAt).toLocaleDateString("km-KH")
    : user?.lastActive || "មិនមាន";

  const handleSuspend = async () => {
    if (!userId) return;
    try {
      await suspendUser(userId).unwrap();
      toast.success(`បានបិទគណនី ${displayName} ជោគជ័យ`);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "មានបញ្ហាក្នុងការបិទគណនី");
    }
  };

  const handleReactivate = async () => {
    if (!userId) return;
    try {
      await reactivateUser(userId).unwrap();
      toast.success(`បានបើកដំណើរការគណនី ${displayName} ឡើងវិញជោគជ័យ`);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "មានបញ្ហាក្នុងការបើកគណនី");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full rounded-2xl p-0 overflow-hidden">
        <div className="relative bg-white dark:bg-slate-900 font-google-sans">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="text-lg font-bold text-[#003377] dark:text-white flex items-center gap-2">
              <UserIcon className="size-5 text-[#FFC83D]" />
              ព័ត៌មានលម្អិតអ្នកប្រើប្រាស់
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="បិទ"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {isUserLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <RefreshCw className="size-6 animate-spin text-[#003377]" />
                <span className="text-sm">កំពុងទាញយកព័ត៌មាន...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="size-16 rounded-full bg-[#003377] text-white text-xl font-bold flex items-center justify-center">
                      {displayName[0] ?? "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isSuspended
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {isSuspended ? "ផ្អាកដំណើរការ" : "សកម្ម"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate mt-0.5">{email}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono truncate">លេខសម្គាល់: {userId}</p>
                  </div>
                </div>

                {/* Onboarding & Profile Summary Badges */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400">ការចុះឈ្មោះប្រើប្រាស់:</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      {isOnboardingLoading ? (
                        <span className="text-slate-400">កំពុងទាញយក...</span>
                      ) : onboardingRes?.data?.onboardingCompleted || raw?.onboardingCompleted ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="size-3.5" /> រួចរាល់
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                          <XCircle className="size-3.5" /> មិនទាន់រួចរាល់
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">ស្ថានភាពប្រវត្តិរូប:</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                      {raw?.profileCompleted ? "ពេញលេញ" : "មិនទាន់ពេញលេញ"}
                    </p>
                  </div>
                </div>

                {/* Single User Details (GET /admin/users/{userId}) */}
                <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Phone className="size-4" /> លេខទូរស័ព្ទ
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{phone}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Briefcase className="size-4" /> មុខរបរ
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{occupation}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <MapPin className="size-4" /> ទីតាំង / ប្រទេស
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{city}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar className="size-4" /> កាលបរិច្ឆេទបង្កើត
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{joinedDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="flex-1 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    បិទ
                  </button>
                  {isSuspended ? (
                    <button
                      type="button"
                      disabled={isReactivating}
                      onClick={handleReactivate}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                    >
                      <ShieldCheck className="size-4" />
                      {isReactivating ? "កំពុងដំណើរការ..." : "បើកដំណើរការឡើងវិញ"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSuspending}
                      onClick={handleSuspend}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-sm disabled:opacity-50"
                    >
                      <ShieldAlert className="size-4" />
                      {isSuspending ? "កំពុងដំណើរការ..." : "ផ្អាកគណនី"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
