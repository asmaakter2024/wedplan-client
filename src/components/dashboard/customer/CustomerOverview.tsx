"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarX2,
  CheckCircle2,
  Clock3,
  Search,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Stats } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatCard from "@/components/dashboard/shared/StatCard";

/** Customer overview — booking totals per status. */
const CustomerOverview = () => {
  const [stats, setStats] = useState<Extract<Stats, { role: "customer" }> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await apiFetch<Extract<Stats, { role: "customer" }>>(
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
        title="My Overview"
        description="Track every booking request you have sent to vendors."
        action={
          <>
            <Button render={<Link href="/dashboard/bookings" />} variant="outline" nativeButton={false}>
              <CalendarCheck />
              My Bookings
            </Button>
            <Button
              render={<Link href="/services" />}
              className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
             nativeButton={false}>
              <Search />
              Browse Services
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={stats?.totalBookings ?? 0}
          hint="All requests you have sent"
          loading={loading}
          accent="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={Clock3}
          label="Pending"
          value={stats?.pendingBookings ?? 0}
          hint="Waiting for the vendor"
          loading={loading}
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Accepted"
          value={stats?.acceptedBookings ?? 0}
          hint="Confirmed by the vendor"
          loading={loading}
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={CalendarX2}
          label="Rejected"
          value={stats?.rejectedBookings ?? 0}
          hint="Declined or cancelled"
          loading={loading}
          accent="bg-rose-100 text-rose-700"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-gray-900">
          What happens next?
        </h3>
        <div className="mt-4 grid gap-4 text-sm leading-relaxed text-gray-600 sm:grid-cols-3">
          <p>
            <span className="font-semibold text-gray-900">1. Send a request</span>{" "}
            — pick a service and tell the vendor your event date and location.
          </p>
          <p>
            <span className="font-semibold text-gray-900">2. Vendor reviews</span>{" "}
            — they accept or reject, and you are notified through your dashboard.
          </p>
          <p>
            <span className="font-semibold text-gray-900">3. Track it here</span>{" "}
            — pending requests can be cancelled by you at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
