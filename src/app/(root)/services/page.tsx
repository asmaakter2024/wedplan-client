import { Suspense } from "react";
import type { Metadata } from "next";
import BrowseServices from "@/components/services/BrowseServices";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Browse Services | WedPlan",
  description:
    "Search verified wedding photographers, venues, florists, caterers, and stylists. Filter by category and location, then request a booking.",
};

/** Shown while the page's filters initialize (Suspense fallback). */
function BrowseFallback() {
  return (
    <section className="min-h-[70vh] bg-[#f7f5f2] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-4 h-10 w-80" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <Skeleton className="mt-8 h-20 w-full rounded-2xl" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<BrowseFallback />}>
      <BrowseServices />
    </Suspense>
  );
}
