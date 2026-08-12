"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  Target,
  Repeat,
  BarChart3,
} from "lucide-react";
import { useNotificationUI } from "../hook";
import { useTriggerNotificationMutation } from "../api";
import { CATEGORY_CONFIGS } from "../constants";
import { NotificationCategory } from "../types";

export default function EmailTemplatePreview() {
  const { emailPreviewCategory, changeEmailPreviewCategory } = useNotificationUI();
  const [testSentToast, setTestSentToast] = useState(false);
  const [triggerNotification, { isLoading: isSending }] = useTriggerNotificationMutation();

  const activeConfig = CATEGORY_CONFIGS[emailPreviewCategory];

  const handleSendTestEmail = async () => {
    let title = "";
    let message = "";
    let amount: number | undefined = undefined;

    switch (emailPreviewCategory) {
      case "DAILY_EXPENSE":
        title = "ការរំលឹកចំណាយប្រចាំថ្ងៃ៖ កុំភ្លេចកត់ត្រាចំណាយថ្ងៃនេះ";
        message = "សូមកត់ត្រាការចំណាយប្រចាំថ្ងៃរបស់អ្នកឱ្យបានទៀងទាត់ ដើម្បីគ្រប់គ្រងថវិកាបានល្អប្រសើរ។";
        break;
      case "BUDGET_WARNING":
        title = "ការព្រមានថវិកា៖ ប្រភេទ «អាហារ និងភេសជ្ជៈ» ជិតដល់កម្រិតកំណត់";
        message = "អ្នកបានចំណាយ 85% នៃថវិកាប្រចាំខែសម្រាប់អាហារនិងភេសជ្ជៈហើយ។";
        amount = 340;
        break;
      case "SAVINGS_GOAL":
        title = "រំលឹកគោលដៅសន្សំ៖ «មូលនិធិអាសន្ន» សម្រេចបាន 75%";
        message = "អបអរសាទរ! អ្នកខិតជិតសម្រេចគោលដៅសន្សំប្រាក់ $1,000 ហើយ។";
        amount = 750;
        break;
      case "RECURRING_TX":
        title = "ការរំលឹកបង់ប្រាក់៖ វិក្កយបត្រសេវាអ៊ីនធឺណិត $35 ត្រូវបង់ថ្ងៃស្អែក";
        message = "សូមពិនិត្យសមតុល្យគណនីរបស់អ្នកសម្រាប់ការទូទាត់ស្វ័យប្រវត្តិនៅថ្ងៃស្អែក។";
        amount = 35;
        break;
      case "MONTHLY_SUMMARY":
        title = "របាយការណ៍សង្ខេបហិរញ្ញវត្ថុខែកក្កដា ២០២៦";
        message = "របាយការណ៍ចំណូល $2,450, ចំណាយ $1,280, សន្សំសុទ្ធ $1,170 ត្រូវបានរៀបចំរួចរាល់។";
        amount = 1170;
        break;
    }

    try {
      await triggerNotification({
        category: emailPreviewCategory,
        channel: "EMAIL",
        customTitleKh: title,
        customMessageKh: message,
        priority: activeConfig.defaultPriority,
        amount,
      }).unwrap();

      setTestSentToast(true);
      setTimeout(() => setTestSentToast(false), 4000);
    } catch {
      // Graceful error handling
    }
  };

  return (
    <div className="space-y-6 font-google-sans">
      {/* Toast Alert */}
      {testSentToast && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-4 text-sm font-bold text-amber-700 dark:text-[#FFC83D] border border-[#FFC83D]/30 animate-in fade-in">
          <CheckCircle2 size={20} />
          <span>សារអ៊ីមែលសាកល្បងត្រូវ​បាន​ផ្ញើ​ជោគជ័យ!</span>
        </div>
      )}

      {/* Header Selector & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-800 dark:text-white font-google-sans">
            ការមើលជាមុននៃគំរូអ៊ីមែល
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ជ្រើសរើសប្រភេទការជូនដំណឹងដើម្បីមើលរូបរាងអ៊ីមែលដែលត្រូវផ្ញើទៅកាន់អ្នកប្រើប្រាស់
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Test Send Button */}
          <button
            type="button"
            disabled={isSending}
            onClick={handleSendTestEmail}
            className="flex items-center gap-2 rounded-2xl bg-[#003377] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255] transition active:scale-95 disabled:opacity-50"
          >
            <Send size={14} />
            <span>ផ្ញើអ៊ីមែលសាកល្បង</span>
          </button>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.values(CATEGORY_CONFIGS).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => changeEmailPreviewCategory(cat.id as NotificationCategory)}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl text-xs font-bold transition border ${
              emailPreviewCategory === cat.id
                ? "bg-[#003377] text-white border-[#003377] shadow-md dark:bg-[#FFC83D] dark:text-[#003377] dark:border-[#FFC83D]"
                : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
            }`}
          >
            <span className="text-center font-google-sans leading-tight">{cat.nameKh}</span>
          </button>
        ))}
      </div>

      {/* Mock Client Email Window Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-300/80 shadow-xl dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
        {/* Email App Toolbar Mock */}
        <div className="flex items-center justify-between border-b border-slate-300 bg-slate-200/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">iStash អ៊ីមែល</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            ផ្ញើទៅកាន់៖ user.khmer@istash.com
          </div>
        </div>

        {/* Email Rendered Canvas - Reacts to global app theme */}
        <div className="p-4 sm:p-8 flex justify-center bg-slate-100 dark:bg-slate-950">
          <div className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-[#0B1329] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 transition-colors">
            {/* Email Banner Header */}
            <div className="bg-[#003377] p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#FFC83D]/20 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-[#FFC83D] flex items-center justify-center text-[#003377] font-black text-lg">
                    iS
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white font-sans">
                    iStash <span className="text-[#FFC83D]">ការជូនដំណឹង</span>
                  </span>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#FFC83D] backdrop-blur-xs">
                  {activeConfig.nameKh}
                </span>
              </div>
            </div>

            {/* Email Main Body */}
            <div className="p-6 sm:p-8 space-y-6 font-google-sans">
              <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400">ប្រធានបទ៖</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  [{activeConfig.nameKh}] ព័ត៌មានបច្ចុប្បន្នភាពហិរញ្ញវត្ថុ iStash
                </h2>
              </div>

              {/* Greeting */}
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">ជំរាបសួរ អ្នកប្រើប្រាស់ iStash,</p>

              {/* Dynamic Category Specific Content */}
              {emailPreviewCategory === "DAILY_EXPENSE" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-amber-500/10 p-5 border border-[#FFC83D]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#003377] dark:text-[#FFC83D] font-bold text-sm">
                      <Wallet size={18} />
                      <span>ដល់ម៉ោងកត់ត្រាការចំណាយប្រចាំថ្ងៃរបស់អ្នកហើយ!</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      សូមកុំភ្លេចកត់ត្រាការចំណាយ និងចំណូលរបស់អ្នកសម្រាប់ថ្ងៃនេះ។ ការធ្វើបច្ចុប្បន្នភាពទៀងទាត់ជួយឱ្យអ្នកគ្រប់គ្រងថវិកាបានល្អប្រសើរ និងជៀសវាងការចំណាយហួសផែនការ។
                    </p>
                  </div>
                </div>
              )}

              {emailPreviewCategory === "BUDGET_WARNING" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-red-500/10 p-5 border border-red-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                      <AlertTriangle size={18} />
                      <span>ការព្រមានអំពីការចំណាយលើសពីដែនកំណត់ថវិកា (85%)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      ការចំណាយលើប្រភេទ «អាហារ និងភេសជ្ជៈ» របស់អ្នកបានឈានដល់ $340.00 នៃថវិកាដែលបានកំណត់ចំនួន $400.00 ក្នុងខែនេះហើយ។
                    </p>
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>ប្រកាសអាសន្ន៖ 85%</span>
                        <span>$340 / $400</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full w-[85%]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {emailPreviewCategory === "SAVINGS_GOAL" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <Target size={18} />
                      <span>អបអរសាទរ! គោលដៅសន្សំប្រាក់សម្រេចបាន 75%</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      អ្នកបានសន្សំប្រាក់បាន $750.00 សម្រាប់គោលដៅ «មូលនិធិអាសន្ន»។ អ្នកនៅសល់តែ $250.00 ទៀតប៉ុណ្ណោះដើម្បីសម្រេចគោលដៅ $1,000.00!
                    </p>
                  </div>
                </div>
              )}

              {emailPreviewCategory === "RECURRING_TX" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#003377]/10 dark:bg-slate-800/70 p-5 border border-[#003377]/20 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center gap-2 text-[#003377] dark:text-[#FFC83D] font-bold text-sm">
                      <Repeat size={18} />
                      <span>ការរំលឹកបង់ប្រាក់៖ វិក្កយបត្រត្រូវបង់នៅថ្ងៃស្អែក</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-400">វិក្កយបត្រ៖</span>
                        <p className="font-bold text-slate-800 dark:text-white">សេវាអ៊ីនធឺណិត</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-400">ចំនួនទឹកប្រាក់៖</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">$35.00 USD</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {emailPreviewCategory === "MONTHLY_SUMMARY" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-indigo-500/10 p-5 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      <BarChart3 size={18} />
                      <span>សេចក្តីសង្ខេបហិរញ្ញវត្ថុខែកក្កដា ២០២៦</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-400">ចំណូល</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">$2,450</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-400">ចំណាយ</span>
                        <p className="font-bold text-red-500 dark:text-red-400">$1,280</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400">សន្សំ</span>
                        <p className="font-bold text-[#003377] dark:text-[#FFC83D]">$1,170</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button in Email */}
              <div className="pt-2">
                <a
                  href="#check-app"
                  className="block w-full rounded-2xl bg-[#003377] dark:bg-[#FFC83D] dark:text-[#003377] py-3 text-center text-xs font-bold text-white shadow-md hover:bg-[#002255] dark:hover:bg-[#e6b437] transition"
                >
                  ចូលទៅកាន់កម្មវិធី iStash
                </a>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
                <p>© 2026 iStash. រក្សាសិទ្ធិគ្រប់យ៉ាង severe.</p>
                <p>ប្រសិនបើអ្នកមិនចង់ទទួលបានអ៊ីមែលនេះទេ សូមចូលទៅកាន់ការកំណត់ប្រព័ន្ធជូនដំណឹងដើម្បីបិទ។</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
