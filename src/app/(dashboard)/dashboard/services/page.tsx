"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  PlusCircle,
  Store,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/services";
import { formatMoney, type VendorService } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]";

const MyServicesPage = () => {
  /* Data ------------------------------------------------------------- */
  const [services, setServices] = useState<VendorService[]>([]);
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [freeLimit, setFreeLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  /* Edit dialog state ------------------------------------------------ */
  const [editing, setEditing] = useState<VendorService | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  /* Delete dialog state ---------------------------------------------- */
  const [deleting, setDeleting] = useState<VendorService | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      const data = await apiFetch<{
        services: VendorService[];
        plan: "free" | "premium";
        limit: number;
      }>("/api/vendor/services", { auth: true });

      setServices(data.services ?? []);
      setPlan(data.plan ?? "free");
      setFreeLimit(data.limit ?? 3);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load your services",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  /* Availability toggle ---------------------------------------------- */

  const toggleAvailability = useCallback(async (service: VendorService) => {
    const next = !service.isActive;

    // Optimistic update — revert it if the API says no
    setServices((current) =>
      current.map((item) =>
        item._id === service._id ? { ...item, isActive: next } : item,
      ),
    );

    try {
      const data = await apiFetch<{ message: string }>(
        `/api/vendor/services/${service._id}/availability`,
        { method: "PATCH", body: { isActive: next } },
      );
      toast.add({ type: "success", title: "Availability updated", description: data.message });
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

  /* Edit -------------------------------------------------------------- */

  const handleEditSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!editing) return;

      setSavingEdit(true);
      try {
        await apiFetch<{ message: string }>(
          `/api/vendor/services/${editing._id}`,
          {
            method: "PUT",
            body: {
              serviceName: editing.serviceName,
              category: editing.category,
              description: editing.description,
              price: Number(editing.price),
              location: editing.location,
              images: editing.images,
            },
          },
        );

        toast.add({
          type: "success",
          title: "Service updated",
          description: "Your changes were saved.",
        });
        setEditing(null);
        await loadServices();
      } catch (error) {
        toast.add({
          type: "error",
          title: "Could not save the service",
          description: error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setSavingEdit(false);
      }
    },
    [editing, loadServices],
  );

  /* Delete ------------------------------------------------------------ */

  const handleDelete = useCallback(async () => {
    if (!deleting) return;

    setDeletingBusy(true);
    try {
      await apiFetch<{ message: string }>(
        `/api/vendor/services/${deleting._id}`,
        { method: "DELETE" },
      );

      toast.add({
        type: "success",
        title: "Service deleted",
        description: `${deleting.serviceName} was removed.`,
      });
      setDeleting(null);
      setServices((current) => current.filter((item) => item._id !== deleting._id));
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not delete the service",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setDeletingBusy(false);
    }
  }, [deleting]);

  /* Render ------------------------------------------------------------ */

  const usedCount = services.filter((service) => service.status !== "rejected").length;

  return (
    <RoleGuard allow={["vendor"]}>
      <div className="space-y-6">
        <PageHeader
          title="My Services"
          description="Update, hide or remove the services you offer."
          action={
            <Button
              render={<Link href="/dashboard/services/new" />}
              className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
            >
              <PlusCircle />
              Add Service
            </Button>
          }
        />

        {/* Plan usage */}
        <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {plan === "premium" ? "Premium plan" : "Free plan"}
            </span>{" "}
            — {plan === "premium"
              ? "unlimited services"
              : `${usedCount} of ${freeLimit} services used`}
          </p>
          {plan === "free" && (
            <Button
              render={<Link href="/dashboard/subscription" />}
              variant="outline"
              size="sm"
            >
              Upgrade to Premium
            </Button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && services.length === 0 && (
          <EmptyState
            icon={Store}
            title="No services yet"
            description="Create your first wedding service. It will be visible to customers after the admin approves it."
            action={
              <Button
                render={<Link href="/dashboard/services/new" />}
                className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
              >
                <PlusCircle />
                Add your first service
              </Button>
            }
          />
        )}

        {/* Service cards */}
        {!loading && services.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {services.map((service) => (
              <div
                key={service._id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row"
              >
                {/* Thumbnail */}
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-40">
                  {service.images?.[0] ? (
                    <Image
                      src={service.images[0]}
                      alt={service.serviceName}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-gray-400">
                      <Store className="size-8" />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold text-gray-900">
                      {service.serviceName}
                    </h3>
                    <StatusBadge status={service.status} />
                  </div>

                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="size-3.5" />
                      {service.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {service.location}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatMoney(service.price)}
                    </span>
                  </p>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {service.description}
                  </p>

                  {/* Availability + actions */}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={() => toggleAvailability(service)}
                        aria-label={`Toggle availability for ${service.serviceName}`}
                      />
                      {service.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <Eye className="size-3.5" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <EyeOff className="size-3.5" /> Hidden
                        </span>
                      )}
                    </label>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(service)}
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleting(service)}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog ------------------------------------------------- */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>
              Approval status cannot be changed here — only an admin can approve
              or reject a service.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                  Service name
                </Label>
                <Input
                  id="edit-name"
                  value={editing.serviceName}
                  onChange={(event) =>
                    setEditing({ ...editing, serviceName: event.target.value })
                  }
                  required
                  maxLength={150}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(value) =>
                      setEditing({
                        ...editing,
                        category: value ?? editing.category,
                      })
                    }
                  >
                    <SelectTrigger className="h-10 w-full justify-between rounded-lg border-gray-200">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700">
                    Price (USD)
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min={1}
                    value={editing.price}
                    onChange={(event) =>
                      setEditing({ ...editing, price: Number(event.target.value) })
                    }
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-location" className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  value={editing.location}
                  onChange={(event) =>
                    setEditing({ ...editing, location: event.target.value })
                  }
                  required
                  maxLength={200}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  value={editing.description}
                  onChange={(event) =>
                    setEditing({ ...editing, description: event.target.value })
                  }
                  required
                  maxLength={3000}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-image" className="text-sm font-medium text-gray-700">
                  Image URL
                </Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={editing.images?.[0] ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, images: [event.target.value] })
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                  disabled={savingEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-[#7a1f2b] text-white hover:bg-[#661824]"
                >
                  {savingEdit ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog ----------------------------------------------- */}
      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.serviceName} will be removed permanently. Existing booking
              requests for this service are deleted too.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletingBusy}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {deletingBusy ? "Deleting..." : "Delete service"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RoleGuard>
  );
};

export default MyServicesPage;
