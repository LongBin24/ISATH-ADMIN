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

function initials(profile: UserProfile) {
  return (profile.displayName || profile.username).split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfileBanner({ profile, onSuccess, onError }: { profile: UserProfile; onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { t } = useAdminI18n();
  return <>
    <Card className="relative overflow-hidden rounded-3xl border-border shadow-sm">
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-slate-100/90 border-b border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-800" />
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
              {profile.occupation && (
                <p className="mt-1 text-sm font-semibold text-[#003377] dark:text-[#FFC83D]">
                  {profile.occupation}
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-normal sm:justify-start">
                <span className="inline-flex items-center gap-1.5"><Mail className="size-4 text-sky-600 dark:text-sky-400" />{profile.email || "—"}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-rose-500 dark:text-rose-400" />{profile.location || t("Location not provided")}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-amber-500 dark:text-amber-400" />{profile.joinDate ? `${t("Joined")} ${profile.joinDate}` : t("Join date unavailable")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {profile.emailVerified && <Badge variant="outline" className="gap-1.5 border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"><ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />{t("Email verified")}</Badge>}
            <Badge variant="outline" className="gap-1.5 border-[#003377]/30 bg-[#003377]/10 px-3 py-1.5 text-sm font-bold text-[#003377] dark:border-[#FFC83D]/40 dark:bg-[#FFC83D]/15 dark:text-[#FFC83D]"><UserRound className="size-3.5" />{t("Administrator")}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
    <ProfileAvatarModal profile={profile} isOpen={avatarOpen} onClose={() => setAvatarOpen(false)} onSuccess={onSuccess} onError={onError} />
  </>;
}
