"use client";

import { useState, useMemo } from "react";
import { useGetAlertRulesQuery } from "@/features/alert/hooks";
import { AlertTable } from "./AlertTable";
import { AlertFilters } from "./AlertFilters";
import { AlertDetailsDialog } from "./AlertDetailsDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { AlertRule } from "@/features/alert/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AlertPage() {
  const [filters, setFilters] = useState({
    search: "",
    severity: "",
    status: "",
  });

  const {
    data: alertRules,
    isLoading,
    isError,
    refetch,
  } = useGetAlertRulesQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const filteredAlertRules = useMemo(() => {
    if (!alertRules) return [];
    return alertRules.filter((rule) => {
      const searchLower = filters.search.toLowerCase();
      const statusFilter =
        filters.status === "enabled"
          ? true
          : filters.status === "disabled"
          ? false
          : null;

      const matchesName = rule.ruleName.toLowerCase().includes(searchLower);
      const matchesSeverity = filters.severity
        ? rule.severity === filters.severity
        : true;
      const matchesStatus =
        statusFilter !== null ? rule.enabled === statusFilter : true;

      return matchesName && matchesSeverity && matchesStatus;
    });
  }, [alertRules, filters]);

  const handleViewDetails = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRuleId(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    if (isError) {
      return (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex flex-row items-center space-x-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle className="text-destructive">
              Error Loading Alert Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              There was an issue fetching the alert rules. Please try
              refreshing the data.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <AlertFilters filters={filters} onFiltersChange={setFilters} />
        <AlertTable
          alertRules={filteredAlertRules}
          onViewDetails={handleViewDetails}
        />
      </>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            ច្បាប់ការជូនដំណឹង (Admin Alert Rules)
          </h1>
          <p className="text-muted-foreground">
            Manage and configure automated alert rules for your system.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <AlertFilters filters={filters} onFiltersChange={setFilters} />
      <AlertTable
        alertRules={alertRules || []}
        onViewDetails={handleViewDetails}
      />
      <AlertDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        alertRule={selectedRule}
      />
    </div>
  );
}
