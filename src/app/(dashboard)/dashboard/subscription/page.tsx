"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Infinity as InfinityIcon,
  Loader2,
  Lock,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

/** The premium price shown to the vendor (must match the server). */
const PREMIUM_PRICE = 49;

type Plan = "free" | "premium";

const FEATURES: { label: string; free: boolean | string; premium: boolean | string }[] =
  [
    { label: "Publish wedding services", free: "Up to 3", premium: true },
    { label: "Unlimited services", free: false, premium: true },
    { label: "Receive booking requests", free: true, premium: true },
    { label: "Accept / reject requests", free: true, premium: true },
    { label: "Premium vendor badge", free: false, premium: true },
    { label: "Priority placement in search", free: false, premium: true },
    { label: "Profile & analytics dashboard", free: true, premium: true },
  ];

const SubscriptionPage = () => {
  const [plan, setPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);

  /* Current plan ----------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadPlan() {
      try {
        const data = await apiFetch<{ user: { subscription?: Plan; subscriptionCancelAtPeriodEnd?: boolean; subscriptionExpiresAt?: string } }>(
          "/api/profile",
          { auth: true },
        );
        if (!cancelled) {
          setPlan(data.user?.subscription ?? "free");
          setCancelAtPeriodEnd(data.user?.subscriptionCancelAtPeriodEnd ?? false);
          setSubscriptionExpiresAt(data.user?.subscriptionExpiresAt || null);
        }
      } catch {
        // The page still renders with the free plan if the API is unreachable
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = useCallback(async () => {
    setCancelling(true);
    try {
      const result = await apiFetch<{ message: string; subscriptionExpiresAt: string | null }>(
        "/api/payments/cancel",
        { method: "POST", body: {} },
      );
      setCancelAtPeriodEnd(true);
      setSubscriptionExpiresAt(result.subscriptionExpiresAt);
      toast.add({ type: "success", title: "Cancellation scheduled", description: result.message });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not cancel Premium",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setCancelling(false);
    }
  }, []);

  /* Start Stripe Checkout ------------------------------------------- */

  const handleUpgrade = useCallback(async () => {
    setStarting(true);
    try {
      // The server creates the Stripe session (and a pending transaction)
      const data = await apiFetch<{ url: string }>("/api/payments/checkout", {
        method: "POST",
        body: {},
      });

      if (!data.url) throw new Error("Stripe did not return a checkout URL.");

      // Full page redirect to Stripe — the plan is activated by the webhook
      window.location.assign(data.url);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not start the payment",
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
      setStarting(false);
    }
  }, []);

  /* Render ----------------------------------------------------------- */

  return (
    <RoleGuard allow={["vendor"]}>
      <div className="space-y-6">
        <PageHeader
          title="Subscription"
          description="Choose the plan that fits your wedding business."
          action={
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
              <CreditCard className="size-4 text-[#7a1f2b]" />
              Current plan:{" "}
              <span className="capitalize">{loading ? "..." : plan}</span>
            </span>
          }
        />

        {/* Plans */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <Store className="size-3.5" />
                Free
              </span>
              {plan === "free" && !loading && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <BadgeCheck className="size-4" /> Current
                </span>
              )}
            </div>

            <p className="mt-4 font-display text-4xl font-bold text-gray-900">
              $0
              <span className="text-base font-medium text-gray-400"> /month</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Everything you need to get your first bookings.
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-start gap-2.5">
                  {feature.free === true ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : feature.free === false ? (
                    <X className="mt-0.5 size-4 shrink-0 text-gray-300" />
                  ) : (
                    <span className="mt-0.5 w-4 shrink-0 text-center text-xs font-semibold text-[#7a1f2b]">
                      3
                    </span>
                  )}
                  <span className={feature.free === false ? "text-gray-400" : "text-gray-700"}>
                    {feature.label}
                    {typeof feature.free === "string" && (
                      <span className="text-gray-400"> ({feature.free})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <Button variant="outline" className="h-10 w-full" disabled>
                {plan === "free" ? "Your current plan" : "Included plan"}
              </Button>
            </div>
          </div>

          {/* Premium */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-[#c9a227] bg-[#1c0f12] p-6 text-white shadow-lg">
            <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#c9a227] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1c0f12]">
              Recommended
            </span>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <Sparkles className="size-3.5" />
                Premium
              </span>
              {plan === "premium" && !loading && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                  <BadgeCheck className="size-4" /> Active
                </span>
              )}
            </div>

            <p className="mt-4 font-display text-4xl font-bold">
              {formatMoney(PREMIUM_PRICE)}
              <span className="text-base font-medium text-white/50"> / month</span>
            </p>
            <p className="mt-2 text-sm text-white/70">
              Unlimited services and a premium badge on every listing.
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-start gap-2.5">
                  {feature.premium === true ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-white/30" />
                  )}
                  <span className={feature.premium === false ? "text-white/40" : "text-white/90"}>
                    {feature.label}
                    {typeof feature.premium === "string" && (
                      <span className="text-white/50"> ({feature.premium})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              {plan === "premium" ? (
                <div className="space-y-2">
                  <Button className="h-10 w-full bg-amber-400 text-[#1c0f12] hover:bg-amber-300" disabled>
                    <InfinityIcon /> Unlimited services active
                  </Button>
                  {cancelAtPeriodEnd ? (
                    <p className="text-center text-xs text-amber-200">
                      Premium ends {subscriptionExpiresAt ? new Date(subscriptionExpiresAt).toLocaleDateString() : "at the end of this billing period"}.
                    </p>
                  ) : (
                    <Button variant="outline" onClick={handleCancel} disabled={cancelling} className="h-9 w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                      {cancelling ? "Scheduling cancellation…" : "Cancel Premium at period end"}
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  disabled={starting || loading}
                  className="h-10 w-full bg-[#c9a227] text-[#1c0f12] hover:bg-[#b8911f]"
                >
                  {starting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      Upgrade to Premium
                      <ArrowRight />
                    </>
                  )}
                </Button>
              )}
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Lock className="size-3.5" />
              Secure payment by Stripe · activated after webhook confirmation
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Payments are billed monthly through Stripe in test mode. Your premium plan is
          activated only after Stripe confirms the payment on our server.{" "}
          <Link href="/dashboard/services" className="text-[#7a1f2b] underline-offset-2 hover:underline">
            Back to my services
          </Link>
        </p>
      </div>
    </RoleGuard>
  );
};

export default SubscriptionPage;
