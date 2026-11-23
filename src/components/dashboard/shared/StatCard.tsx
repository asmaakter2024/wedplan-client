"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardProps = {
  /** Lucide icon shown in the colored square. */
  icon: LucideIcon;
  /** Example: "Total Bookings". */
  label: string;
  /** Example: 12 — numbers and short strings only. */
  value: string | number;
  /** Small line under the value. */
  hint?: string;
  /** Shows skeletons while the dashboard data loads. */
  loading?: boolean;
  /** Tailwind classes for the icon background. */
  accent?: string;
};

/** One KPI card used on all three overview pages. */
const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
  loading = false,
  accent = "bg-rose-100 text-rose-700",
}: StatCardProps) => {
  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm">
      <CardContent className="flex items-start gap-4 p-4 sm:p-5">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            accent,
          )}
        >
          <Icon className="size-5" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-500">{label}</p>

          {loading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-1 font-display text-3xl font-bold text-gray-900">
              {value}
            </p>
          )}

          {hint && !loading && (
            <p className="mt-1 truncate text-xs text-gray-400">{hint}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
