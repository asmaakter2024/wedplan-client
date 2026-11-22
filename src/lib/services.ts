/**
 * Shared types used across the public service pages.
 * The shapes match what the Express API returns (vendorId is populated).
 */

/** Vendor as it appears when populated onto a service. */
export type Vendor = {
  _id: string;
  name?: string;
  image?: string | null;
  businessName?: string | null;
};

/** One service from the API (or the demo fallback data). */
export type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorId: Vendor | string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
};

/** The six categories required by the assignment. */
export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;
