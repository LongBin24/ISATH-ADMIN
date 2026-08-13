"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Severity } from "../types";

interface AlertFiltersProps {
  filters: {
    search: string;
    severity: string;
    status: string;
  };
  onFiltersChange: (filters: AlertFiltersProps["filters"]) => void;
}

export function AlertFilters({ filters, onFiltersChange }: AlertFiltersProps) {
  const handleReset = () => {
    onFiltersChange({ search: "", severity: "", status: "" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Filter by rule name..."
        className="max-w-sm"
        value={filters.search}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value })
        }
      />
      <Select
        value={filters.severity}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, severity: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Severities</SelectItem>
          {Object.values(Severity).map((severity) => (
            <SelectItem key={severity} value={severity}>
              {severity}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="enabled">Enabled</SelectItem>
          <SelectItem value="disabled">Disabled</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
