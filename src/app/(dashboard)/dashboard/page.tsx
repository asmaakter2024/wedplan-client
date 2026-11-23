"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import type { Role } from "@/lib/dashboard";
import VendorOverview from "@/components/dashboard/vendor/VendorOverview";
import CustomerOverview from "@/components/dashboard/customer/CustomerOverview";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";

/**
 * Role-aware overview:
 *   customer -> booking totals
 *   vendor    -> services, requests, plan
 *   admin     -> platform totals
 */
export default function DashboardOverviewPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        Loading your dashboard...
      </div>
    );
  }

  const role = (session?.user?.role as Role | undefined) ?? "customer";

  if (role === "vendor") return <VendorOverview />;
  if (role === "admin") return <AdminOverview />;
  return <CustomerOverview />;
}
