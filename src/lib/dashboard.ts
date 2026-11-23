/**
 * Shared types + small helpers for every dashboard page.
 * The shapes match exactly what the Express API returns.
 */

export type Role = "customer" | "vendor" | "admin";

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type ServiceStatus = "pending" | "approved" | "rejected";

/** Numbers for the overview page (one shape per role). */
export type Stats =
  | {
      role: "customer";
      totalBookings: number;
      pendingBookings: number;
      acceptedBookings: number;
      rejectedBookings: number;
    }
  | {
      role: "vendor";
      totalServices: number;
      activeServices: number;
      pendingRequests: number;
      acceptedBookings: number;
      plan: "free" | "premium";
    }
  | {
      role: "admin";
      totalUsers: number;
      totalVendors: number;
      totalCustomers: number;
      totalServices: number;
      pendingServices: number;
      transactions: number;
      revenue: number;
    };

/** A service owned by a vendor (dashboard view). */
export type VendorService = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/** A booking (customer and vendor view). */
export type Booking = {
  _id: string;
  serviceId: {
    _id: string;
    serviceName: string;
    category?: string;
    price?: number;
    location?: string;
    images?: string[];
  } | null;
  customerId: { _id: string; name: string; email?: string; image?: string | null } | null;
  vendorId: {
    _id: string;
    name?: string;
    businessName?: string | null;
    email?: string;
    image?: string | null;
  } | null;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt?: string;
};

/** A user shown in the admin "Manage Users" table. */
export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  subscription?: "free" | "premium";
  isBlocked?: boolean;
  businessName?: string | null;
  createdAt?: string;
};

/** A payment record (admin, read-only). */
export type Transaction = {
  _id: string;
  vendorId: {
    _id: string;
    name?: string;
    email?: string;
    businessName?: string | null;
  } | null;
  plan: string;
  amount: number;
  currency?: string;
  status: string;
  createdAt?: string;
  paidAt?: string;
  stripeSessionId?: string;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Colors used by the status pills. */
const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  approved: "bg-emerald-100 text-emerald-800",
  active: "bg-emerald-100 text-emerald-800",
  succeeded: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800",
  premium: "bg-amber-100 text-amber-800",
  rejected: "bg-rose-100 text-rose-700",
  cancelled: "bg-gray-200 text-gray-600",
  expired: "bg-gray-200 text-gray-600",
  failed: "bg-rose-100 text-rose-700",
  blocked: "bg-rose-100 text-rose-700",
  free: "bg-sky-100 text-sky-700",
};

/** Returns the Tailwind classes for any status string. */
export function statusClasses(status?: string): string {
  const key = String(status ?? "").toLowerCase();
  return STATUS_CLASSES[key] ?? "bg-gray-100 text-gray-600";
}

/** "2027-02-14" / ISO string -> "14 Feb 2027" (never "Invalid Date"). */
export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "2026-11-23T08:00:00Z" -> "23 Nov 2026, 08:00" */
export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 49 -> "$49" */
export function formatMoney(amount?: number, currency = "USD"): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
