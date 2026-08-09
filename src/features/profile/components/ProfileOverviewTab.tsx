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

interface ProfileOverviewTabProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export default function ProfileOverviewTab({
  profile,
  onEditClick,
}: ProfileOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner / Bio Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans">
              ជីវប្រវត្តិ និងសង្ខេបព័ត៌មាន
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-google-sans">
              ព័ត៌មានលម្អិតអំពីគណនីផ្ទាល់ខ្លួនរបស់អ្នកនៅក្នុងប្រព័ន្ធ អាយស្តាស
            </p>
          </div>
          <button
            onClick={onEditClick}
            className="rounded-xl bg-[#003377] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#002255] transition font-google-sans"
          >
            កែប្រែព័ត៌មានផ្ទាល់ខ្លួន
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-google-sans bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {profile.bio || "មិនទាន់មានជីវប្រវត្តិបង្ហាញ..."}
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
              ព័ត៌មានផ្ទាល់ខ្លួន
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm font-google-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">នាមត្រកូល</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.firstName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">នាមខ្លួន</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.lastName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">ឈ្មោះបង្ហាញ</span>
              <span className="font-semibold text-[#003377] dark:text-[#FFC83D]">{profile.displayName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                អាសយដ្ឋានអ៊ីមែល
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                លេខទូរស័ព្ទ
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                ទីតាំង / អាសយដ្ឋាន
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
              ព័ត៌មានប្រព័ន្ធ
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm font-google-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">អត្តសញ្ញាណលេខ</span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {profile.id}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">តួនាទីក្នុងប្រព័ន្ធ</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.role}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">នាយកដ្ឋាន</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.department}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                កាលបរិច្ឆេទចូលរួម
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{profile.joinDate}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-slate-400" />
                រូបិយប័ណ្ណប្រើប្រាស់
              </span>
              <span className="font-bold text-[#003377] dark:text-[#FFC83D]">
                {profile.preferredCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 dark:text-slate-400">ស្ថានភាពសុវត្ថិភាព</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                សុវត្ថិភាពរឹងមាំ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
