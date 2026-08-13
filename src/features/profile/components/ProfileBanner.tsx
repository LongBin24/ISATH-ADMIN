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
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">{profile.displayName || profile.username}</h1>
                <Badge variant="outline" className={profile.status === "active" ? "gap-1 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300" : "text-sm"}><CheckCircle2 className="size-3.5" />{t(profile.status === "active" ? "Active" : "Inactive")}</Badge>
              </div>
              <p className="mt-1 text-base text-muted-foreground">@{profile.username}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground sm:justify-start">
                <span className="inline-flex items-center gap-2"><Mail className="size-4" />{profile.email || "—"}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="size-4" />{profile.location || t("Location not provided")}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="size-4" />{profile.joinDate ? `${t("Joined")} ${profile.joinDate}` : t("Join date unavailable")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {profile.emailVerified && <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm"><ShieldCheck className="size-4" />{t("Email verified")}</Badge>}
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm"><UserRound className="size-4" />{t("Administrator")}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
    <ProfileAvatarModal profile={profile} isOpen={avatarOpen} onClose={() => setAvatarOpen(false)} onSuccess={onSuccess} onError={onError} />
  </>;
}
