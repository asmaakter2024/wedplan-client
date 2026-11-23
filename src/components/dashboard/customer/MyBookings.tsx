"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarX2,
  Eye,
  MessageSquare,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { formatDate, formatDateTime, type Booking } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";

/** Customer side: every booking request they have sent. */
const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [selected, setSelected] = useState<Booking | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      const data = await apiFetch<{ bookings: Booking[] }>("/api/bookings/mine", {
        auth: true,
      });
      setBookings(data.bookings ?? []);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load your bookings",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadBookings(), 0);
    return () => window.clearTimeout(timer);
  }, [loadBookings]);

  /* Cancel ----------------------------------------------------------- */

  const handleCancel = useCallback(
    async (booking: Booking) => {
      if (booking.status !== "pending") return;

      setBusyId(booking._id);
      try {
        const data = await apiFetch<{ message: string }>(
          `/api/bookings/${booking._id}/cancel`,
          { method: "PATCH", body: {} },
        );

        toast.add({
          type: "success",
          title: "Booking cancelled",
          description: data.message,
        });

        const updated = { ...booking, status: "cancelled" as const };
        setBookings((current) =>
          current.map((item) => (item._id === booking._id ? updated : item)),
        );
        setSelected(updated);
      } catch (error) {
        toast.add({
          type: "error",
          title: "Could not cancel this booking",
          description: error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setBusyId(null);
      }
    },
    [],
  );

  /* Filtering -------------------------------------------------------- */

  const visible = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter],
  );

  /* Render ----------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings"
        description="Track every service you requested — only pending requests can be cancelled."
        action={
          <>
            <Button variant="outline" onClick={loadBookings} disabled={loading}>
              <RefreshCw className={loading ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <Button
              render={<Link href="/services" />}
              className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
             nativeButton={false}>
              <Search />
              Browse Services
            </Button>
          </>
        }
      />

      {/* Filters */}
      <Select
        value={filter}
        onValueChange={(value) => setFilter(value ?? "all")}
      >
        <SelectTrigger className="h-9 w-52 justify-between rounded-lg border-gray-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All bookings ({bookings.length})</SelectItem>
          <SelectItem value="pending">
            Pending ({bookings.filter((b) => b.status === "pending").length})
          </SelectItem>
          <SelectItem value="accepted">
            Accepted ({bookings.filter((b) => b.status === "accepted").length})
          </SelectItem>
          <SelectItem value="rejected">
            Rejected ({bookings.filter((b) => b.status === "rejected").length})
          </SelectItem>
          <SelectItem value="cancelled">
            Cancelled ({bookings.filter((b) => b.status === "cancelled").length})
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && visible.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings here yet"
          description="Browse the wedding services and send your first booking request."
          action={
            <Button
              render={<Link href="/services" />}
              className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
             nativeButton={false}>
              <Search />
              Browse Services
            </Button>
          }
        />
      )}

      {/* Booking cards */}
      {!loading && visible.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-gray-900">
                    {booking.serviceId?.serviceName ?? "Service"}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    by {booking.vendorId?.businessName || booking.vendorId?.name || "Vendor"}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Event date</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDate(booking.eventDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Event location</dt>
                  <dd className="truncate font-medium text-gray-800">
                    {booking.eventLocation}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Requested on</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDateTime(booking.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Reference</dt>
                  <dd className="truncate font-mono text-xs text-gray-600">
                    {booking._id.slice(-8).toUpperCase()}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-3">
                <Button variant="outline" size="sm" onClick={() => setSelected(booking)}>
                  <Eye />
                  View details
                </Button>

                {booking.status === "pending" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(booking)}
                    disabled={busyId === booking._id}
                  >
                    <CalendarX2 />
                    {busyId === booking._id ? "Cancelling..." : "Cancel request"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details dialog ---------------------------------------------- */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.serviceId?.serviceName ?? "Booking"}</DialogTitle>
            <DialogDescription>
              Sent to {selected?.vendorId?.businessName || selected?.vendorId?.name || "the vendor"}.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={selected.status} />
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Event date</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDate(selected.eventDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Event location</dt>
                  <dd className="font-medium text-gray-800">
                    {selected.eventLocation}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Requested on</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDateTime(selected.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Price</dt>
                  <dd className="font-medium text-gray-800">
                    {selected.serviceId?.price
                      ? `$${selected.serviceId.price.toLocaleString()}`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                <p className="flex items-center gap-2 font-medium text-gray-700">
                  <MessageSquare className="size-4" />
                  Your message
                </p>
                <p className="mt-2 leading-relaxed text-gray-600">
                  {selected.message || "No additional message was sent."}
                </p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>

                {selected.status === "pending" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancel(selected)}
                    disabled={busyId === selected._id}
                  >
                    {busyId === selected._id ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel request"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBookings;
