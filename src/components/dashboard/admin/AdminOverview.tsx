"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  Store,
  Users,
  UserRound,
  Wallet,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { apiFetch, API_URL } from "@/lib/api";
import { formatMoney, type Stats } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatCard from "@/components/dashboard/shared/StatCard";

/** Admin overview — platform totals. */
const AdminOverview = () => {
  const [stats, setStats] = useState<Extract<Stats, { role: "admin" }> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await apiFetch<Extract<Stats, { role: "admin" }>>(
          "/api/stats",
          { auth: true },
        );
        if (!cancelled) setStats(data);
      } catch (error) {
        if (!cancelled) {
          toast.add({
            type: "error",
            title: "Could not load the platform stats",
            description:
              error instanceof Error ? error.message : "Please try again.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="Everything happening across WedPlan in real time."
        action={
          <Button
            render={<Link href="/dashboard/manage-services" />}
            className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
          >
            <FileCheck />
            Review Services
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          hint={`${stats?.totalVendors ?? 0} vendors · ${stats?.totalCustomers ?? 0} customers`}
          loading={loading}
          accent="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={Store}
          label="Total Services"
          value={stats?.totalServices ?? 0}
          hint="All services in the platform"
          loading={loading}
          accent="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={FileCheck}
          label="Pending Services"
          value={stats?.pendingServices ?? 0}
          hint="Waiting for your approval"
          loading={loading}
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={Wallet}
          label="Transactions"
          value={stats?.transactions ?? 0}
          hint="Stripe payments recorded"
          loading={loading}
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={UserRound}
          label="Vendors"
          value={stats?.totalVendors ?? 0}
          hint="Service providers"
          loading={loading}
          accent="bg-violet-100 text-violet-700"
        />
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={formatMoney(stats?.revenue ?? 0)}
          hint="From Premium subscriptions"
          loading={loading}
          accent="bg-emerald-100 text-emerald-700"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900">
            Quick actions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage users, approve services or read the payment records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/dashboard/users" />} variant="outline">
            Manage Users
          </Button>
          <Button render={<Link href="/dashboard/transactions" />} variant="outline">
            Transactions
          </Button>
          <a
            href={`${API_URL}/api/health`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center rounded-lg border border-input bg-transparent px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            API status
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
