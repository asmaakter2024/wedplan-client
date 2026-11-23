"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Ban,
  Check,
  Eye,
  FileCheck,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney, type VendorService } from "@/lib/dashboard";
import type { Vendor } from "@/lib/services";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

/** Admin view of a service (with the vendor attached). */
type AdminService = VendorService & { vendorId: Vendor | null };

const ManageServicesPage = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [viewing, setViewing] = useState<AdminService | null>(null);
  const [deleting, setDeleting] = useState<AdminService | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  /* Load ------------------------------------------------------------ */

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);

      const qs = params.toString();
      const data = await apiFetch<{ services: AdminService[] }>(
        `/api/admin/services${qs ? `?${qs}` : ""}`,
        { auth: true },
      );
      setServices(data.services ?? []);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load services",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  /* Approve / reject -------------------------------------------------- */

  const changeStatus = useCallback(
    async (service: AdminService, nextStatus: "approved" | "rejected") => {
      setBusyId(service._id);
      try {
        const data = await apiFetch<{ message: string }>(
          `/api/admin/services/${service._id}/status`,
          { method: "PATCH", body: { status: nextStatus } },
        );

        toast.add({
          type: "success",
          title: nextStatus === "approved" ? "Service approved" : "Service rejected",
          description: data.message,
        });

        setServices((current) =>
          current.map((item) =>
            item._id === service._id ? { ...item, status: nextStatus } : item,
          ),
        );
        setViewing((current) =>
          current && current._id === service._id
            ? { ...current, status: nextStatus }
            : current,
        );
      } catch (error) {
        toast.add({
          type: "error",
          title: "Could not change the status",
          description: error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setBusyId(null);
      }
    },
    [],
  );

  /* Availability ------------------------------------------------------ */

  const toggleAvailability = useCallback(async (service: AdminService) => {
    const next = !service.isActive;

    setServices((current) =>
      current.map((item) =>
        item._id === service._id ? { ...item, isActive: next } : item,
      ),
    );

    try {
      await apiFetch(`/api/admin/services/${service._id}/availability`, {
        method: "PATCH",
        body: { isActive: next },
      });
    } catch (error) {
      setServices((current) =>
        current.map((item) =>
          item._id === service._id ? { ...item, isActive: !next } : item,
        ),
      );
      toast.add({
        type: "error",
        title: "Could not update availability",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, []);

  /* Delete ------------------------------------------------------------ */

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;

    setDeleteBusy(true);
    try {
      await apiFetch<{ message: string }>(
        `/api/admin/services/${deleting._id}`,
        { method: "DELETE" },
      );

      toast.add({
        type: "success",
        title: "Service deleted",
        description: `${deleting.serviceName} was removed from the platform.`,
      });

      setServices((current) => current.filter((item) => item._id !== deleting._id));
      setDeleting(null);
      setViewing((current) => (current?._id === deleting._id ? null : current));
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not delete the service",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setDeleteBusy(false);
    }
  }, [deleting]);

  /* Render ----------------------------------------------------------- */

  const pendingCount = services.filter((item) => item.status === "pending").length;

  return (
    <RoleGuard allow={["admin"]}>
      <div className="space-y-6">
        <PageHeader
          title="Manage Services"
          description="Review pending services, approve or reject them and remove listings."
        />

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, category or location..."
              className="h-9 flex-1 rounded-lg border-gray-200"
            />
            <Button
              type="submit"
              className="h-9 bg-[#7a1f2b] text-white hover:bg-[#661824]"
            >
              <Search />
              Search
            </Button>
          </form>

          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger className="h-9 w-44 justify-between rounded-lg border-gray-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pendingCount > 0 && (
          <p className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
            <FileCheck className="size-4" />
            {pendingCount} service{pendingCount === 1 ? "" : "s"} waiting for review
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && services.length === 0 && (
          <EmptyState
            icon={FileCheck}
            title="No services found"
            description="Nothing matches your search. New vendor submissions appear here for review."
          />
        )}

        {/* Table */}
        {!loading && services.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell className="max-w-56">
                      <div className="flex items-center gap-2">
                        <span className="relative hidden size-9 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                          {service.images?.[0] ? (
                            <Image
                              src={service.images[0]}
                              alt={service.serviceName}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center text-gray-400">
                              <FileCheck className="size-4" />
                            </span>
                          )}
                        </span>
                        <span className="truncate font-medium text-gray-900">
                          {service.serviceName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-40">
                      <span className="block truncate text-gray-700">
                        {service.vendorId?.businessName ||
                          service.vendorId?.name ||
                          "Unknown"}
                      </span>
                    </TableCell>

                    <TableCell className="max-w-40">
                      <span className="block truncate text-gray-600">
                        {service.category}
                      </span>
                    </TableCell>

                    <TableCell>{formatMoney(service.price)}</TableCell>

                    <TableCell>
                      <StatusBadge status={service.status} />
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={() => toggleAvailability(service)}
                        aria-label={`Toggle availability for ${service.serviceName}`}
                      />
                    </TableCell>

                    <TableCell className="text-gray-500">
                      {formatDate(service.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewing(service)}
                        >
                          <Eye />
                          View
                        </Button>

                        {service.status !== "approved" && (
                          <Button
                            size="sm"
                            onClick={() => changeStatus(service, "approved")}
                            disabled={busyId === service._id}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            {busyId === service._id ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Check />
                            )}
                            Approve
                          </Button>
                        )}

                        {service.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => changeStatus(service, "rejected")}
                            disabled={busyId === service._id}
                          >
                            <Ban />
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Details dialog ---------------------------------------------- */}
      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.serviceName}</DialogTitle>
            <DialogDescription>
              Submitted by{" "}
              {viewing?.vendorId?.businessName ||
                viewing?.vendorId?.name ||
                "an unknown vendor"}
              .
            </DialogDescription>
          </DialogHeader>

          {viewing && (
            <div className="space-y-4">
              {viewing.images?.[0] && (
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={viewing.images[0]}
                    alt={viewing.serviceName}
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={viewing.status} />
                <span className="text-xs text-gray-500">
                  {viewing.isActive ? "Visible to customers" : "Hidden by vendor"}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Category</dt>
                  <dd className="font-medium text-gray-800">{viewing.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Price</dt>
                  <dd className="font-medium text-gray-800">
                    {formatMoney(viewing.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Location</dt>
                  <dd className="font-medium text-gray-800">{viewing.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Created</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDate(viewing.createdAt)}
                  </dd>
                </div>
              </dl>

              <div className="rounded-xl border border-gray-100 p-4 text-sm">
                <p className="font-medium text-gray-700">Description</p>
                <p className="mt-2 leading-relaxed text-gray-600">
                  {viewing.description}
                </p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleting(viewing)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation ------------------------------------------ */}
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              {deleting?.serviceName} and all of its booking requests will be
              removed permanently. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={deleteBusy}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteBusy}
            >
              {deleteBusy ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 />
                  Delete service
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
};

export default ManageServicesPage;
