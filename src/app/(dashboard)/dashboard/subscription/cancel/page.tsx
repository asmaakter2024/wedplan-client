"use client";

import Link from "next/link";
import { ArrowLeft, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

/** Shown when the vendor closes or cancels the Stripe checkout. */
const PaymentCancelPage = () => {
  return (
    <RoleGuard allow={["vendor"]}>
      <div className="mx-auto max-w-xl space-y-6 pt-6 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100">
          <CircleX className="size-8 text-rose-600" />
        </span>

        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
          Payment cancelled
        </h1>

        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
          No money was taken and your plan stayed <b>Free</b>. You can start the
          upgrade again whenever you are ready.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            render={<Link href="/dashboard/subscription" />}
            className="h-10 bg-[#7a1f2b] text-white hover:bg-[#661824]"
          >
            <ArrowLeft />
            Back to Subscription
          </Button>
          <Button render={<Link href="/dashboard" />} variant="outline" className="h-10">
            Go to Overview
          </Button>
        </div>
      </div>
    </RoleGuard>
  );
};

export default PaymentCancelPage;
