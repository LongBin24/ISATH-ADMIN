"use client";

import React from "react";
import { UserProfile } from "../types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
  Coins,
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface ProfileOverviewTabProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export default function ProfileOverviewTab({
  profile,
  onEditClick,
}: ProfileOverviewTabProps) {
  const { dict, isEnglish } = useI18n();

  return (
    <div className="space-y-6">
      {/* Top Banner / Bio Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans">
              {dict.profile.bioAndSummary}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-google-sans">
              {dict.profile.bioSubtitle}
            </p>
          </div>
          <button
            onClick={onEditClick}
            className="rounded-xl bg-[#003377] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#002255] transition font-google-sans dark:bg-[#FFC83D] dark:text-[#003377]"
          >
            {dict.profile.editProfileBtn}
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-google-sans bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {profile.bio || dict.profile.noBio}
          </p>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-google-sans">
              {dict.profile.personalInfo}
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm font-google-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">{dict.profile.firstName}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.firstName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">{dict.profile.lastName}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.lastName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">{dict.profile.displayName}</span>
              <span className="font-semibold text-[#003377] dark:text-[#FFC83D]">{profile.displayName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {dict.profile.email}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {dict.profile.phoneNumber}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {dict.profile.location}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* System & Work Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003377] text-[#FFC83D]">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-google-sans">
              {dict.profile.systemInfo}
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm font-google-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">ID</span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {profile.id}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">{dict.users.role}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.role}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">{dict.profile.department}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.department}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {dict.profile.createdAt}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.joinDate}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-slate-400" />
                {dict.profile.selectedCurrency}
              </span>
              <span className="font-bold text-[#003377] dark:text-[#FFC83D]">
                {profile.preferredCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 dark:text-slate-400">{dict.profile.accountSecurity}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                {dict.profile.securityStrength}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
