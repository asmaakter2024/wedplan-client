"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

/* ------------------------------------------------------------------ */
/* Types + demo data                                                   */
/* ------------------------------------------------------------------ */

/** The vendor object that is populated onto a service by the API. */
type Vendor = {
  _id?: string;
  id?: string;
  name?: string;
  image?: string | null;
  businessName?: string | null;
  subscription?: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string;
};

/** Shape of one service coming from GET /api/services/featured */
type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorId?: Vendor;
};


/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

const FeaturedServices = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * "View Details" follows the same access rule as the Browse page:
   * visitors must sign in first, everybody else goes to the details page.
   */
  const handleViewDetails = useCallback(
    (serviceId: string) => {
      if (isPending) return; // still checking the session — ignore the click
      if (!session) {
        router.push("/signin");
        return;
      }
      router.push(`/services/${serviceId}`);
    },
    [isPending, session, router],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        if (!API_URL) throw new Error("Service API URL is not configured.");
        const res = await fetch(`${API_URL}/api/services/featured`);
        if (!res.ok) throw new Error("Request failed");

        const data = await res.json();

        if (!cancelled && Array.isArray(data.services)) {
          setServices(data.services.slice(0, 6));
        }
      } catch (requestError) {
        if (!cancelled) {
          setServices([]);
          setError(requestError instanceof Error ? requestError.message : "Could not load services.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a1f2b]">
              Curated Showcase
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Featured Wedding Services
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Explore approved and active wedding experiences from WedPlan vendors.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 md:self-auto"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? // Loading state while the featured services are fetched
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-gray-200">
                  <Skeleton className="aspect-[3/2] w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))
            : services.map((service) => {
                const vendor = service.vendorId;
                const vendorName =
                  vendor?.businessName || vendor?.name || "WedPlan Vendor";
                const image =
                  service.images?.[0] ||
                  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80";

                return (
                  <article
                    key={service._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-xl"
                  >
                    {/* Image with badges */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={image}
                        alt={service.serviceName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm">
                        {service.category}
                      </span>
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        {vendor?.subscriptionPlan === "premium" ? "Premium Priority" : "Approved Vendor"}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-[#1c0f12] px-3.5 py-1.5 text-sm font-semibold text-white">
                        ${service.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3
                        className="truncate font-display text-lg font-bold text-gray-900"
                        title={service.serviceName}
                      >
                        {service.serviceName}
                      </h3>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {service.location}
                      </p>

                      <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Vendor */}
                      <div className="mt-4 flex items-center gap-2.5 border-t border-gray-100 pt-4">
                        {vendor?.image ? (
                          <Image
                            src={vendor.image}
                            alt={vendorName}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700">
                            {vendorName.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="flex flex-col leading-tight">
                          <span className="truncate text-sm font-semibold text-gray-900">
                            {vendorName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {vendor?.subscriptionPlan === "premium" || vendor?.subscription === "premium"
                              ? "Premium Vendor"
                              : "Wedding Service Provider"}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDetails(service._id)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7a1f2b] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#661824]"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
        </div>
        {!loading && services.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-[#faf8f6] px-6 py-8 text-center">
            <p className="text-sm text-gray-600">
              {error ? "Featured services are temporarily unavailable." : "New featured services are coming soon."}
            </p>
            {error && (
              <button
                type="button"
                onClick={() => { setError(null); setLoading(true); setRefreshKey((key) => key + 1); }}
                className="mt-3 text-sm font-semibold text-[#7a1f2b] underline underline-offset-4"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;
