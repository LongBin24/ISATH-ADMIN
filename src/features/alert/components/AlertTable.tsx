import { AlertRule } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface AlertTableProps {
  alertRules: AlertRule[];
  onViewDetails: (ruleId: string) => void;
}

export function AlertTable({ alertRules, onViewDetails }: AlertTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rule Name</TableHead>
            <TableHead>Alert Type</TableHead>
            <TableHead>Trigger Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alertRules.length > 0 ? (
            alertRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.ruleName}</TableCell>
                <TableCell>{rule.alertType}</TableCell>
                <TableCell>{rule.triggerType}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      rule.severity === "CRITICAL"
                        ? "destructive"
                        : rule.severity === "WARNING"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {rule.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch checked={rule.enabled} disabled={!rule.canDisable} />
                  <Badge
                    variant={rule.enabled ? "default" : "outline"}
                    className="ml-2"
                  >
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewDetails(rule.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No alert rules found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
