"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "./ServiceCard";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { CATEGORIES, type Service } from "@/lib/services";
import { filterDemoServices } from "@/lib/demo-services";

/* ------------------------------------------------------------------ */
/* Sort options                                                        */
/* ------------------------------------------------------------------ */

const SORT_OPTIONS = [
  { value: "newest", label: "Featured & Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const BrowseServices = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  // The category lives in the URL (?category=...) so homepage and footer
  // links can pre-filter this page. Everything else is local state.
  const category = searchParams.get("category") ?? "all";

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  // Filters the results currently reflect (applied when Search is clicked)
  const [applied, setApplied] = useState({
    search: "",
    location: "",
    sort: "newest",
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  /* Fetch services whenever the applied filters change --------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (applied.search) params.set("search", applied.search);
        if (category && category !== "all") params.set("category", category);
        if (applied.location) params.set("location", applied.location);
        if (applied.sort === "price-asc" || applied.sort === "price-desc") {
          params.set("sort", applied.sort);
        }

        const qs = params.toString();
        const res = await fetch(`${API_URL}/api/services${qs ? `?${qs}` : ""}`);

        if (!res.ok) throw new Error("Request failed");

        const data = await res.json();

        if (!cancelled && Array.isArray(data.services)) {
          setServices(data.services);
          setIsDemo(false);
        }
      } catch {
        // API not reachable — filter the demo data locally so the page
        // still works. Remove this once the server is running.
        if (!cancelled) {
          setServices(filterDemoServices({ ...applied, category }));
          setIsDemo(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, [applied, category]);

  /* Handlers -------------------------------------------------------- */

  /** Updates the ?category= query param (source of truth for category). */
  const handleCategoryChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") params.delete("category");
      else params.set("category", value);

      const qs = params.toString();
      router.replace(qs ? `/services?${qs}` : "/services", { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setApplied({ search, location, sort });
    },
    [search, location, sort],
  );

  /**
   * Access rule: unauthenticated users are redirected to Sign In,
   * authenticated users go to the service details page.
   */
  const handleViewDetails = useCallback(
    (id: string) => {
      if (isPending) return; // still checking the session — ignore the click
      if (!session) {
        router.push("/signin");
        return;
      }
      router.push(`/services/${id}`);
    },
    [isPending, session, router],
  );

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setLocation("");
    setSort("newest");
    setApplied({ search: "", location: "", sort: "newest" });
    router.replace("/services", { scroll: false });
  }, [router]);

  /* Render ---------------------------------------------------------- */

  return (
    <section className="min-h-[70vh] bg-[#f7f5f2] py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1.5 text-xs font-semibold text-rose-700">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Wedding Marketplace
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Browse Wedding Services
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
            Search verified photographers, dream venues, florists, caterers, and
            stylists. Sign in to view full galleries and send booking requests.
          </p>
        </div>

        {/* Filter bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search by name */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search service name or keyword..."
                aria-label="Search services by name"
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
              />
            </div>

            {/* Category filter */}
            <div className="relative lg:w-56">
              <select
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
                aria-label="Filter by category"
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-700 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            {/* Location filter */}
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Filter by city / location..."
                aria-label="Filter by location"
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
              />
            </div>

            {/* Sort */}
            <div className="relative lg:w-56">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort services"
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="rounded-lg bg-[#7a1f2b] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#661824] focus:outline-none focus:ring-2 focus:ring-[#7a1f2b] focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>

        {/* Result count */}
        <p className="mt-6 text-sm text-gray-500" aria-live="polite">
          {loading
            ? "Loading approved wedding services..."
            : `Showing ${services.length} of ${services.length} approved wedding services`}
          {isDemo && !loading && " (demo data — API server offline)"}
        </p>

        {/* Results */}
        {loading ? (
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <Skeleton className="aspect-[3/2] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          /* Empty state */
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <SearchX className="h-7 w-7 text-gray-400" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-gray-900">
              No services found
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              We couldn&apos;t find any approved services matching your search.
              Try a different keyword, category, or location.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseServices;
