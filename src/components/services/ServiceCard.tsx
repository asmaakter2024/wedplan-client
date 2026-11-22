"use client";

import Image from "next/image";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { Service } from "@/lib/services";

/** Extracts a usable vendor object from the (possibly unpopulated) field. */
function getVendor(service: Service) {
  if (typeof service.vendorId === "object" && service.vendorId !== null) {
    return service.vendorId;
  }
  return null;
}

type ServiceCardProps = {
  service: Service;
  /** Called when "View Details" is clicked (handles the sign-in redirect). */
  onViewDetails: (id: string) => void;
};

const ServiceCard = ({ service, onViewDetails }: ServiceCardProps) => {
  const vendor = getVendor(service);
  const vendorName = vendor?.businessName || vendor?.name || "WedPlan Vendor";
  const image =
    service.images?.[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-xl">
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
            <span className="text-xs text-gray-400">Premium Vendor</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(service._id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7a1f2b] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#661824]"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

export default ServiceCard;
