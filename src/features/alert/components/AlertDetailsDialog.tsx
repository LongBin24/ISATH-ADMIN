"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useLazyGetAlertRuleByIdQuery } from "@/features/alert/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface AlertDetailsDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  ruleId?: string | null;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-3 sm:gap-4">
      <p className="font-semibold text-muted-foreground">{label}:</p>
      <div className="text-foreground sm:col-span-2">{value}</div>
    </div>
  );
};

export function AlertDetailsDialog({
  isOpen = false,
  onClose,
  alertRule,
}: AlertDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Alert Rule Details</DialogTitle>
          <DialogDescription>
            Viewing details for: {alertRule?.ruleName}
          </DialogDescription>
        </DialogHeader>
        {alertRule && (
          <div className="space-y-3 py-4">
            <DetailItem label="Rule Name" value={alertRule.ruleName} />
            <DetailItem label="Alert Type" value={alertRule.alertType} />
            <DetailItem label="Trigger Type" value={alertRule.triggerType} />
            <DetailItem
              label="Severity"
              value={
                <Badge
                  variant={
                    alertRule.severity === "CRITICAL"
                      ? "destructive"
                      : alertRule.severity === "WARNING"
                        ? "secondary"
                        : "default"
                  }
                >
                  {alertRule.severity}
                </Badge>
              }
            />
            <DetailItem
              label="Status"
              value={alertRule.enabled ? "Enabled" : "Disabled"}
            />
            <DetailItem
              label="Reference Type"
              value={alertRule.referenceType}
            />
            <DetailItem
              label="Message"
              value={alertRule.ruleConfiguration.message}
            />
            <DetailItem label="Days Before" value={alertRule.daysBefore} />
            <DetailItem label="Reminder Time" value={alertRule.reminderTime} />
            <DetailItem
              label="Created At"
              value={new Date(alertRule.createdAt).toLocaleString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(alertRule.updatedAt).toLocaleString()}
            />
          </div>
        )}
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
