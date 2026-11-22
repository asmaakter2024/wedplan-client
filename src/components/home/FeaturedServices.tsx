"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

/**
 * Temporary showcase data.
 * It is only used while the API server is not running — as soon as the
 * server responds with real services, these are replaced automatically.
 */
const DEMO_SERVICES: Service[] = [
  {
    _id: "demo-1",
    serviceName: "Bespoke Garden Arch & Candlelit Ceremony",
    category: "Decoration & Florist",
    description:
      "Custom seasonal ceremony arch installation, bridal and bridesmaid bouquets, lush runner centerpiece styling and candlelit tablescapes for your venue.",
    price: 3400,
    location: "San Francisco, CA",
    images: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-1",
      businessName: "Atelier Lumiere Weddings",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
  },
  {
    _id: "demo-2",
    serviceName: "Haute Bridal Couture & Custom Gown Experience",
    category: "Wedding Fashion",
    description:
      "Private showroom appointment with European silk gowns, cathedral veils, bespoke tuxedo tailoring and three fittings with your personal stylist.",
    price: 2900,
    location: "Beverly Hills, CA",
    images: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-1",
      businessName: "Atelier Lumiere Weddings",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
  },
  {
    _id: "demo-3",
    serviceName: "Super 8mm Documentary Wedding Film",
    category: "Photography & Videography",
    description:
      "Nostalgic Super 8mm film blended with digital 4K audio capture for vows and toasts, producing an heirloom cinematic wedding documentary.",
    price: 3100,
    location: "Santa Barbara, CA",
    images: [
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-1",
      businessName: "Atelier Lumiere Weddings",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) throw new Error("API url not configured");

        const res = await fetch(`${baseUrl}/api/services/featured`);
        if (!res.ok) throw new Error("Request failed");

        const data = await res.json();

        // Use the real services when the API returned some
        if (!cancelled && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
      } catch {
        // API not running yet — fall back to the demo data so the
        // section still renders. Remove this once the server is live.
        if (!cancelled) setServices(DEMO_SERVICES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

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
              Explore approved, active wedding experiences hand-picked from our
              top creative partners and Premium vendors.
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
                        Featured Partner
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
                            Premium Vendor
                          </span>
                        </span>
                      </div>

                      <Link
                        href={`/services/${service._id}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7a1f2b] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#661824]"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
