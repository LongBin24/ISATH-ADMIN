"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, ChevronDown, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AccountStatusBadge, VerifiedBadge } from "./status-badges";
import type { AdminUser } from "@/features/user-manager/types";
import {
  useGetUserByIdQuery,
  useGetUserOnboardingQuery,
} from "@/features/user-manager/api";
import { useGetAuditLogsByUserQuery } from "@/features/audit-logs/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface UserDetailSheetProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend: (user: AdminUser) => void;
  onReactivate: (user: AdminUser) => void;
}

function displayDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-base text-muted-foreground">{label}</span>
      <span className="text-base font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg md:text-xl font-semibold text-foreground">{children}</h3>;
}

export default function UserDetailSheet({
  userId,
  open,
  onOpenChange,
  onSuspend,
  onReactivate,
}: UserDetailSheetProps) {
  const { t } = useAdminI18n();
  const [showTechnical, setShowTechnical] = useState(false);
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetUserByIdQuery(userId ?? "", {
    skip: !userId || !open,
  });
  const { data: onboardingRes, isLoading: isOnboardingLoading } = useGetUserOnboardingQuery(userId ?? "", {
    skip: !userId || !open,
  });
  const { data: userAuditLogs, isLoading: isAuditLoading } = useGetAuditLogsByUserQuery(
    { userId: userId ?? "", page: 0, size: 5 },
    { skip: !userId || !open }
  );

  const name = user
    ? user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email
    : "";
  const isSuspended = user?.accountStatus === "SUSPENDED";
  const isActive = user?.accountStatus === "ACTIVE";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent onClose={() => onOpenChange(false)}>
        <SheetHeader>
          <SheetTitle>{t("User Details")}</SheetTitle>
        </SheetHeader>

        <SheetBody>
          {isUserLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : isUserError || !user ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <div>
                <p className="text-lg font-semibold text-foreground">{t("Unable to load user details.")}</p>
                <p className="mt-1 text-base text-muted-foreground">{t("Please try again.")}</p>
              </div>
              <Button variant="outline" onClick={() => refetchUser()}>
                <RefreshCw className="mr-2 size-4" />
                {t("Retry")}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-20">
                  <AvatarImage src={user.profileImageUrl ?? undefined} alt={name} />
                  <AvatarFallback className="text-2xl">{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <p className="mt-3 text-xl font-bold text-foreground">{name}</p>
                {user.username && <p className="text-base text-muted-foreground">@{user.username}</p>}
                <p className="text-base text-muted-foreground">{user.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <AccountStatusBadge status={user.accountStatus} />
                  <VerifiedBadge verified={user.emailVerified} />
                </div>
              </div>

              <Separator />

              <div>
                <SectionTitle>{t("Account")}</SectionTitle>
                <div className="mt-2 divide-y divide-border">
                  <Field label={t("Account Status")} value={<AccountStatusBadge status={user.accountStatus} />} />
                  <Field label={t("Email Verified")} value={user.emailVerified ? t("Yes") : t("No")} />
                  <Field label={t("Profile Completed")} value={user.profileCompleted ? t("Yes") : t("No")} />
                  <Field
                    label={t("Onboarding")}
                    value={
                      isOnboardingLoading
                        ? t("Loading...")
                        : (onboardingRes?.onboardingCompleted ?? user.onboardingCompleted)
                          ? t("Completed")
                          : t("Not Completed")
                    }
                  />
                </div>
              </div>

              <Separator />

              <div>
                <SectionTitle>{t("Personal Information")}</SectionTitle>
                <div className="mt-2 divide-y divide-border">
                  <Field label={t("Phone")} value={user.phoneNumber || "—"} />
                  <Field label={t("Gender")} value={t(formatGender(user.gender))} />
                  <Field label={t("Date of Birth")} value={displayDate(user.dateOfBirth)} />
                  <Field label={t("Occupation")} value={user.occupation || "—"} />
                  <Field label={t("Country")} value={user.countryCode || "—"} />
                </div>
              </div>

              <Separator />

              <div>
                <SectionTitle>{t("Address")}</SectionTitle>
                <div className="mt-2 divide-y divide-border">
                  <Field label={t("Address Line 1")} value={user.addressLine1 || "—"} />
                  <Field label={t("Address Line 2")} value={user.addressLine2 || "—"} />
                  <Field label={t("City")} value={user.city || "—"} />
                  <Field label={t("State / Province")} value={user.stateProvince || "—"} />
                  <Field label={t("Postal Code")} value={user.postalCode || "—"} />
                </div>
              </div>

              <Separator />

              <div>
                <SectionTitle>{t("Account Timeline")}</SectionTitle>
                <div className="mt-2 divide-y divide-border">
                  <Field label={t("Created")} value={displayDate(user.createdAt)} />
                  <Field label={t("Updated")} value={displayDate(user.updatedAt)} />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <SectionTitle>{t("Activity & Audit Logs")}</SectionTitle>
                  {userAuditLogs && userAuditLogs.totalElements > 0 && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {userAuditLogs.totalElements} {t("events")}
                    </span>
                  )}
                </div>

                {isAuditLoading ? (
                  <div className="space-y-2 py-2">
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ) : !userAuditLogs || userAuditLogs.content.length === 0 ? (
                  <p className="py-2 text-xs text-muted-foreground">
                    {t("No audit activities recorded for this user.")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userAuditLogs.content.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            {log.action}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {log.entityType}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {displayDate(log.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <button
                  type="button"
                  onClick={() => setShowTechnical((v) => !v)}
                  className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {t("Technical Details")}
                  <ChevronDown className={`size-4 transition-transform ${showTechnical ? "rotate-180" : ""}`} />
                </button>
                {showTechnical && (
                  <div className="mt-2 divide-y divide-border">
                    <Field label={t("User ID")} value={<span className="font-mono text-sm">{user.id}</span>} />
                    <Field
                      label={t("Keycloak User ID")}
                      value={<span className="font-mono text-sm">{user.keycloakUserId || "—"}</span>}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </SheetBody>

        {user && (
          <SheetFooter>
            {isSuspended ? (
              <Button onClick={() => onReactivate(user)} className="bg-emerald-600 text-white hover:bg-emerald-700">
                <ShieldCheck className="mr-2 size-4" />
                {t("Reactivate User")}
              </Button>
            ) : isActive ? (
              <Button variant="destructive" onClick={() => onSuspend(user)}>
                <ShieldAlert className="mr-2 size-4" />
                {t("Suspend User")}
              </Button>
            ) : null}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function formatGender(value: string | null | undefined) {
  if (!value) return "—";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
