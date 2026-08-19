"use client";

import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminUser } from "@/features/user-manager/types";
import { useSuspendUserMutation } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface SuspendUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function displayName(user: AdminUser) {
  return user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email;
}

export default function SuspendUserDialog({ user, open, onOpenChange }: SuspendUserDialogProps) {
  const { t } = useAdminI18n();
  const [suspendUser, { isLoading }] = useSuspendUserMutation();

  async function handleConfirm() {
    if (!user) return;
    try {
      await suspendUser(user.id).unwrap();
      toast.success("User suspended successfully.");
      onOpenChange(false);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to suspend this user. Please try again.");
    }
  }

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Suspend this user?")}</AlertDialogTitle>
          <AlertDialogDescription>
            {displayName(user)} {t("will no longer be able to use their account until an administrator reactivates it.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? t("Suspending...") : t("Suspend User")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
