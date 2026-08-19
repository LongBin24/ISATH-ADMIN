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
import { useReactivateUserMutation } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface ReactivateUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function displayName(user: AdminUser) {
  return user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email;
}

export default function ReactivateUserDialog({ user, open, onOpenChange }: ReactivateUserDialogProps) {
  const { t } = useAdminI18n();
  const [reactivateUser, { isLoading }] = useReactivateUserMutation();

  async function handleConfirm() {
    if (!user) return;
    try {
      await reactivateUser(user.id).unwrap();
      toast.success("User reactivated successfully.");
      onOpenChange(false);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to reactivate this user. Please try again.");
    }
  }

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Reactivate this user?")}</AlertDialogTitle>
          <AlertDialogDescription>
            {displayName(user)} {t("will regain access to their iStash account.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? t("Reactivating...") : t("Reactivate User")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
