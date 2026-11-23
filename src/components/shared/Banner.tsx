import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Sparkles, ShieldCheck } from "lucide-react";

const stats = [
  { value: "6+", label: "Curated Categories" },
  { value: "100%", label: "Vetted Listings" },
  { value: "Direct", label: "Booking Tracking" },
];

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-[#1c0f12]">
      {/* Background image + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1c0f12] via-[#1c0f12]/90 to-[#1c0f12]/60"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#1c0f12]/70 via-transparent to-[#1c0f12]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-medium text-amber-100/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Trusted by Couples &amp; Wedding Artisans
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Craft Your{" "}
            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text italic text-transparent">
              Unforgettable
            </span>
            <br />
            Wedding Celebration
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Discover admin-vetted wedding photographers, breathtaking venues,
            floral designers, gourmet caterers, and bridal stylists—compare
            transparent pricing and send booking requests effortlessly.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-300 to-yellow-500 px-6 py-3.5 text-sm font-semibold text-[#3d2c07] shadow-lg shadow-amber-900/25 transition-transform hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" />
              Explore Wedding Services
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Join as a Vendor
            </Link>
          </div>

          <div className="mt-12 max-w-xl border-t border-white/10 pt-8">
            <dl className="flex flex-wrap gap-x-14 gap-y-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold text-amber-300">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Right column — showcase card */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">
            <Image
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80"
              alt="Decorated wedding ceremony chairs on a lawn"
              width={900}
              height={1125}
              className="aspect-[4/5] w-full rounded-[20px] object-cover"
            />
          </div>

          {/* Floating verification card */}
          <div className="absolute -bottom-6 left-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-left-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100">
              <ShieldCheck className="h-[18px] w-[18px] text-rose-500" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-900">
                Verified Wedding Pros
              </span>
              <span className="text-xs text-gray-500">
                Reviewed before going live
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
