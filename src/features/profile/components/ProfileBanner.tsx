"use client";

import { useState } from "react";
import { CalendarDays, Camera, CheckCircle2, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { UserProfile } from "../types";
import ProfileAvatarModal from "./ProfileAvatarModal";
<<<<<<< HEAD
=======
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
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

function initials(profile: UserProfile) {
  return (profile.displayName || profile.username).split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

<<<<<<< HEAD
export default function ProfileBanner({ profile, onSuccess, onError }: { profile: UserProfile; onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { t } = useAdminI18n();
  return <>
    <Card className="relative overflow-hidden rounded-3xl border-border shadow-sm">
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(120deg,#003377,#0755a5)] dark:bg-[linear-gradient(120deg,#001f49,#003377)]" />
      <div aria-hidden className="absolute right-0 top-0 size-56 translate-x-1/3 -translate-y-1/2 rounded-full bg-[#FEDB55]/25 blur-2xl" />
      <CardContent className="relative px-5 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative shrink-0">
              <Avatar className="size-28 border-4 border-card bg-muted shadow-xl sm:size-32">
                <AvatarImage src={profile.avatar} alt={profile.displayName} />
                <AvatarFallback className="text-2xl font-semibold">{initials(profile)}</AvatarFallback>
              </Avatar>
              <Button type="button" size="icon" onClick={() => setAvatarOpen(true)} className="absolute bottom-1 right-1 size-10 rounded-xl border-2 border-card bg-[#FEDB55] text-[#003377] hover:bg-[#f0ca43]" aria-label={t("Change profile photo")}>
                <Camera className="size-4" />
              </Button>
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">{profile.displayName || profile.username}</h2>
                <Badge variant="outline" className={profile.status === "active" ? "gap-1 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300" : "text-sm"}><CheckCircle2 className="size-3.5" />{t(profile.status === "active" ? "Active" : "Inactive")}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground font-normal">@{profile.username}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-normal sm:justify-start">
                <span className="inline-flex items-center gap-2"><Mail className="size-3.5" />{profile.email || "—"}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="size-3.5" />{profile.location || t("Location not provided")}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="size-3.5" />{profile.joinDate ? `${t("Joined")} ${profile.joinDate}` : t("Join date unavailable")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {profile.emailVerified && <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-semibold"><ShieldCheck className="size-3.5" />{t("Email verified")}</Badge>}
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-semibold"><UserRound className="size-3.5" />{t("Administrator")}</Badge>
=======
export default function ProfileBanner({
  profile,
  onSuccess,
  onError,
}: ProfileBannerProps) {
  const { dict, isEnglish } = useI18n();
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
                  title={dict.profile.changePhoto}
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
                    {dict.profile.joined} {profile.joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#003377] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#002255] active:scale-95 font-google-sans dark:bg-[#FFC83D] dark:text-[#003377]"
              >
                <Camera className="h-4 w-4 text-[#FFC83D] dark:text-[#003377]" />
                {dict.profile.changePhoto}
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
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">{dict.profile.accountSecurity}</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-google-sans">{dict.profile.securityStrength}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#003377]/40 dark:text-[#FFC83D]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">{dict.profile.selectedCurrency}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-google-sans">{profile.preferredCurrency}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">{dict.profile.accountStatus}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-google-sans">
                  {profile.lastActive === "សកម្ម" ? dict.common.active : profile.lastActive}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-google-sans">{dict.users.role}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-google-sans">{dict.profile.adminRole}</p>
              </div>
            </div>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </div>
        </div>
      </CardContent>
    </Card>
    <ProfileAvatarModal profile={profile} isOpen={avatarOpen} onClose={() => setAvatarOpen(false)} onSuccess={onSuccess} onError={onError} />
  </>;
}
