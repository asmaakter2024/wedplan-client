"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Inbox,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";
import { formatDate, formatDateTime, type Booking } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";

/** Vendor side: incoming booking requests with Accept / Reject. */
const BookingRequests = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const data = await apiFetch<{ bookings: Booking[] }>(
        "/api/bookings/requests",
        { auth: true },
      );
      setBookings(data.bookings ?? []);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load booking requests",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadRequests(), 0);
    return () => window.clearTimeout(timer);
  }, [loadRequests]);

  /* Accept / Reject -------------------------------------------------- */

  const processRequest = useCallback(
    async (booking: Booking, action: "accept" | "reject") => {
      setBusyId(booking._id);
      try {
        const data = await apiFetch<{ message: string }>(
          `/api/bookings/${booking._id}/${action}`,
          { method: "PATCH", body: {} },
        );

        toast.add({
          type: "success",
          title: action === "accept" ? "Request accepted" : "Request rejected",
          description: data.message,
        });

        // Show the new status right away
        setBookings((current) =>
          current.map((item) =>
            item._id === booking._id
              ? { ...item, status: action === "accept" ? "accepted" : "rejected" }
              : item,
          ),
        );
      } catch (error) {
        toast.add({
          type: "error",
          title: "Could not process this request",
          description: error instanceof Error ? error.message : "Please try again.",
        });
        await loadRequests(); // reload in case the status changed elsewhere
      } finally {
        setBusyId(null);
      }
    },
    [loadRequests],
  );

  /* Filtering -------------------------------------------------------- */

  const visible = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((item) => item.status === "pending").length,
      accepted: bookings.filter((item) => item.status === "accepted").length,
      rejected: bookings.filter((item) => item.status === "rejected").length,
      cancelled: bookings.filter((item) => item.status === "cancelled").length,
    }),
    [bookings],
  );

  /* Render ----------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking Requests"
        description="Customers are waiting for your answer. Only pending requests can be processed."
        action={
          <Button variant="outline" onClick={loadRequests} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : undefined} />
            Refresh
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value ?? "all")}
        >
          <SelectTrigger className="h-9 w-48 justify-between rounded-lg border-gray-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All requests ({counts.all})</SelectItem>
            <SelectItem value="pending">Pending ({counts.pending})</SelectItem>
            <SelectItem value="accepted">Accepted ({counts.accepted})</SelectItem>
            <SelectItem value="rejected">Rejected ({counts.rejected})</SelectItem>
            <SelectItem value="cancelled">Cancelled ({counts.cancelled})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && visible.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No booking requests"
          description="When a customer books one of your approved services, the request appears here."
        />
      )}

      {/* Requests table */}
      {!loading && visible.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Event date</TableHead>
                <TableHead>Event location</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Sent on</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {booking.customerId?.name ?? "Customer"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {booking.customerId?.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-48">
                    <span className="block truncate font-medium text-gray-800">
                      {booking.serviceId?.serviceName ?? "Service"}
                    </span>
                  </TableCell>

                  <TableCell>{formatDate(booking.eventDate)}</TableCell>

                  <TableCell className="max-w-40">
                    <span className="inline-flex items-center gap-1 truncate text-gray-600">
                      <MapPin className="size-3.5 shrink-0 text-gray-400" />
                      {booking.eventLocation}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-56">
                    <span
                      title={booking.message}
                      className="block truncate text-gray-500"
                    >
                      {booking.message || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {formatDateTime(booking.createdAt)}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    {booking.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => processRequest(booking, "accept")}
                          disabled={busyId === booking._id}
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => processRequest(booking, "reject")}
                          disabled={busyId === booking._id}
                        >
                          <XCircle />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
