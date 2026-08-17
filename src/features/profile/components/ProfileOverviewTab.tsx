"use client";

import { BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, Globe2, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { UserProfile } from "../types";

function value(text?: string) { return text?.trim() || "—"; }

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
