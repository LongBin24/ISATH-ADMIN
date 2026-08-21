"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useGetProfileQuery } from "../api";
import ChangePasswordTab from "./ChangePasswordTab";
import EditProfileTab from "./EditProfileTab";
import KhmerToast from "./KhmerToast";
import ProfileBanner from "./ProfileBanner";
import ProfileNavTabs, { type ProfileTabKey } from "./ProfileNavTabs";
import ProfileOverviewTab from "./ProfileOverviewTab";

export default function ProfilePage() {
  const { t } = useAdminI18n();
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("overview");
  const [toast, setToast] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null });

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) return <div className="w-full py-10"><Card className="rounded-2xl border-destructive/30 bg-destructive/5"><CardContent className="flex flex-col items-center p-8 text-center"><span className="grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive"><AlertTriangle className="size-6" /></span><h2 className="mt-4 text-lg font-semibold">{t("Unable to load profile")}</h2><p className="mt-1 text-base text-muted-foreground">{t("We could not load your account information. Please try again.")}</p><Button variant="outline" className="mt-5" onClick={() => refetch()}><RefreshCw className="mr-2 size-4" />{t("Retry")}</Button></CardContent></Card></div>;

  return (
    <div className="w-full space-y-6 font-google-sans">
      <KhmerToast type={toast.type} message={toast.message} onClose={() => setToast({ type: null, message: null })} />
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><UserRound className="size-3.5" />{t("Account Settings")}</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">{t("My Profile")}</h1>
        <p className="mt-1 text-sm text-muted-foreground font-normal">{t("Manage your personal information, profile photo, and account security.")}</p>
      </header>
      <ProfileBanner profile={profile} onSuccess={(message) => setToast({ type: "success", message })} onError={(message) => setToast({ type: "error", message })} />
      <ProfileNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div>{activeTab === "overview" ? <ProfileOverviewTab profile={profile} /> : activeTab === "edit" ? <EditProfileTab profile={profile} onSuccess={(message) => setToast({ type: "success", message })} onError={(message) => setToast({ type: "error", message })} /> : <ChangePasswordTab onSuccess={(message) => setToast({ type: "success", message })} onError={(message) => setToast({ type: "error", message })} />}</div>
    </div>
  );
}

function ProfileSkeleton() { return <div className="w-full space-y-6"><div className="space-y-2"><Skeleton className="h-9 w-56" /><Skeleton className="h-5 w-96 max-w-full" /></div><Skeleton className="h-64 rounded-3xl" /><Skeleton className="h-16 rounded-2xl" /><div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]"><Skeleton className="h-96 rounded-2xl" /><div className="space-y-5"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-48 rounded-2xl" /></div></div></div>; }
