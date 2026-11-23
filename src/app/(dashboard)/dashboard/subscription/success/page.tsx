"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

/**
 * Stripe success page.
 *
 * We NEVER trust this redirect: it only tells the vendor that the payment
 * went through. The plan actually changes when our server receives and
 * verifies the Stripe webhook — so this page waits for the server.
 */
const PaymentSuccessPage = () => {
  const [status, setStatus] = useState<"checking" | "active" | "pending">(
    "checking",
  );
  const attempts = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function checkPlan() {
      try {
        const data = await apiFetch<{ user: { subscription?: string } }>(
          "/api/profile",
          { auth: true },
        );

        if (cancelled) return;

        if (data.user?.subscription === "premium") {
          setStatus("active");
          return;
        }
      } catch {
        // network problem — keep trying
      }

      attempts.current += 1;
      if (attempts.current >= 5) {
        setStatus("pending");
        return;
      }

      // Wait a moment so Stripe's webhook has time to arrive
      timer = setTimeout(checkPlan, 2500);
    }

    checkPlan();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <RoleGuard allow={["vendor"]}>
      <div className="mx-auto max-w-xl space-y-6 pt-6 text-center">
        <span
          className={`mx-auto flex size-16 items-center justify-center rounded-full ${
            status === "active" ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          {status === "checking" ? (
            <Loader2 className="size-8 animate-spin text-amber-600" />
          ) : status === "active" ? (
            <CheckCircle2 className="size-8 text-emerald-600" />
          ) : (
            <Clock3 className="size-8 text-amber-600" />
          )}
        </span>

        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
          {status === "active"
            ? "Premium is now active!"
            : status === "pending"
              ? "Payment received — activating..."
              : "Confirming your payment..."}
        </h1>

        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
          {status === "active" ? (
            <>
              Thank you! Your account is on the Premium plan and you can publish
              unlimited services right away.
            </>
          ) : status === "pending" ? (
            <>
              We received your payment. Stripe confirms every payment through a
              signed webhook, so Premium activates within a few seconds. Refresh
              this page if it does not change.
            </>
          ) : (
            <>
              Stripe is confirming your payment with our server. This only takes a
              moment — please leave this page open.
            </>
          )}
        </p>

        {status === "active" && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            <Sparkles className="size-4" />
            Unlimited services · Premium badge · Priority placement
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            render={<Link href="/dashboard/subscription" />}
            className="h-10 bg-[#7a1f2b] text-white hover:bg-[#661824]"
           nativeButton={false}>
            Back to Subscription
          </Button>
          <Button render={<Link href="/dashboard/services/new" />} variant="outline" className="h-10" nativeButton={false}>
            Add a service
          </Button>
        </div>
      </div>
    </RoleGuard>
  );
};

export default PaymentSuccessPage;
