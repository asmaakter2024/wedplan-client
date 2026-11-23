"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Inbox,
  Package,
  PlusCircle,
  Sparkles,
  Store,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Stats } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatCard from "@/components/dashboard/shared/StatCard";

/** Vendor overview — services, requests, bookings and the current plan. */
const VendorOverview = () => {
  const [stats, setStats] = useState<Extract<Stats, { role: "vendor" }> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await apiFetch<Extract<Stats, { role: "vendor" }>>(
          "/api/stats",
          { auth: true },
        );
        if (!cancelled) setStats(data);
      } catch (error) {
        if (!cancelled) {
          toast.add({
            type: "error",
            title: "Could not load your dashboard",
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
        title="Vendor Overview"
        description="Your services, booking requests and plan at a glance."
        action={
          <Button
            render={<Link href="/dashboard/services/new" />}
            className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
           nativeButton={false}>
            <PlusCircle />
            Add Service
          </Button>
        }
      />

      {/* Plan banner */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              {stats?.plan === "premium"
                ? "Premium plan active"
                : "You are on the Free plan"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
              {stats?.plan === "premium"
                ? "Unlimited services and premium badges are enabled."
                : "Free plan keeps up to 3 services. Upgrade for unlimited services."}
            </p>
          </div>
        </div>

        {stats?.plan !== "premium" && (
          <Button
            render={<Link href="/dashboard/subscription" />}
            variant="outline"
            className="shrink-0 border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
           nativeButton={false}>
            Upgrade to Premium
          </Button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Store}
          label="Total Services"
          value={stats?.totalServices ?? 0}
          hint="Everything you have created"
          loading={loading}
          accent="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active Services"
          value={stats?.activeServices ?? 0}
          hint="Approved and visible to customers"
          loading={loading}
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={Inbox}
          label="Pending Requests"
          value={stats?.pendingRequests ?? 0}
          hint="Waiting for your answer"
          loading={loading}
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={CalendarCheck}
          label="Accepted Bookings"
          value={stats?.acceptedBookings ?? 0}
          hint="Confirmed weddings"
          loading={loading}
          accent="bg-sky-100 text-sky-700"
        />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/dashboard/services",
            icon: Store,
            title: "Manage Services",
            text: "Edit, hide or delete your services.",
          },
          {
            href: "/dashboard/bookings",
            icon: Inbox,
            title: "Booking Requests",
            text: "Accept or reject incoming requests.",
          },
          {
            href: "/dashboard/subscription",
            icon: Package,
            title: "Subscription",
            text: "Compare Free and Premium benefits.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50/40"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <item.icon className="size-5" />
            </span>
            <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VendorOverview;
