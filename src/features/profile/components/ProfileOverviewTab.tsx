"use client";

<<<<<<< HEAD
import { BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, Globe2, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { UserProfile } from "../types";
=======
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
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

function value(text?: string) { return text?.trim() || "—"; }

<<<<<<< HEAD
export default function ProfileOverviewTab({ profile }: { profile: UserProfile }) {
  const { t } = useAdminI18n();
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] font-google-sans">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <UserRound className="size-5 text-[#003377] dark:text-[#FEDB55]" />
            {t("Personal Information")}
          </CardTitle>
          <CardDescription>
            {t("Account identity and contact information.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Info icon={UserRound} label={t("First Name")} value={value(profile.firstName)} />
          <Info icon={UserRound} label={t("Last Name")} value={value(profile.lastName)} />
          <Info icon={Mail} label={t("Email Address")} value={value(profile.email)} />
          <Info icon={Phone} label={t("Phone Number")} value={value(profile.phoneNumber)} />
          <Info icon={MapPin} label={t("Location")} value={value(profile.location)} />
          <Info icon={BriefcaseBusiness} label={t("Occupation")} value={value(profile.occupation)} />
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <ShieldCheck className="size-5 text-[#003377] dark:text-[#FEDB55]" />
              {t("Account Status")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Status label={t("Account")} complete={profile.status === "active"} completedText={t("Completed")} pendingText={t("Pending")} />
            <Status label={t("Email Verified")} complete={profile.emailVerified} completedText={t("Completed")} pendingText={t("Pending")} />
            <Status label={t("Profile Completed")} complete={profile.profileCompleted} completedText={t("Completed")} pendingText={t("Pending")} />
            <Status label={t("Onboarding Completed")} complete={profile.onboardingCompleted} completedText={t("Completed")} pendingText={t("Pending")} />
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Globe2 className="size-5 text-[#003377] dark:text-[#FEDB55]" />
              {t("Preferences")}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row icon={Globe2} label={t("Currency")} value={profile.preferredCurrency} />
            <Row icon={Globe2} label={t("Language")} value={value(profile.languageCode)} />
            <Row icon={Clock3} label={t("Timezone")} value={value(profile.timezone)} />
            <Row icon={CalendarDays} label={t("Last Updated")} value={value(profile.updatedAt)} />
          </CardContent>
        </Card>
=======
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
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/25 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="mt-2 break-words text-base font-medium text-foreground">{value}</p>
    </div>
  );
}

function Status({ label, complete, completedText, pendingText }: { label: string; complete: boolean; completedText: string; pendingText: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-base text-muted-foreground">{label}</span>
      <Badge
        variant="outline"
        className={
          complete
            ? "gap-1 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
            : "text-sm"
        }
      >
        <CheckCircle2 className="size-3.5" />
        {complete ? completedText : pendingText}
      </Badge>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Globe2; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="text-right text-base font-medium">{value}</span>
    </div>
  );
}
