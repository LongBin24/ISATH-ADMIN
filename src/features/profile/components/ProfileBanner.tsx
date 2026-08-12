"use client";

import React, { useState } from "react";
import { UserProfile } from "../types";
import ProfileAvatarModal from "./ProfileAvatarModal";
import {
  Camera,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Coins,
} from "lucide-react";

interface ProfileBannerProps {
  profile: UserProfile;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ProfileBanner({
  profile,
  onSuccess,
  onError,
}: ProfileBannerProps) {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        {/* Profile Content Container */}
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar Frame */}
              <div className="group relative shrink-0">
                <img
                  key={profile.avatar}
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-4 border-white bg-slate-100 object-cover shadow-2xl dark:border-slate-900 dark:bg-slate-800 transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  title="ផ្លាស់ប្តូររូបថតគណនី"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFC83D] text-[#003377] shadow-lg transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-900"
                >
                  <Camera className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Title & Info */}
              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-google-sans tracking-tight">
                    {profile.displayName}
                  </h1>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-google-sans">
                  @{profile.username} &bull; {profile.email}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-600 dark:text-slate-300 font-google-sans">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#003377] dark:text-[#FFC83D]" />
                    {profile.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#003377] dark:text-[#FFC83D]" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#003377] dark:text-[#FFC83D]" />
                    ចូលរួម៖ {profile.joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#003377] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#002255] active:scale-95 font-google-sans"
              >
                <Camera className="h-4 w-4 text-[#FFC83D]" />
                ផ្លាស់ប្តូររូបថត
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">សុវត្ថិភាពគណនី</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-google-sans">១០០% រឹងមាំ</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#003377]/40 dark:text-[#FFC83D]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">រូបិយប័ណ្ណជ្រើសរើស</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-google-sans">{profile.preferredCurrency}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">ស្ថានភាព</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-google-sans">{profile.lastActive}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">តួនាទីសិទ្ធិ</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-google-sans">អ្នកគ្រប់គ្រងជាន់ខ្ពស់</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileAvatarModal
        profile={profile}
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
}
