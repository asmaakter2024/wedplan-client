"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Ban,
  CheckCircle2,
  Eye,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatDate, formatDateTime, type AdminUser, type Role } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
];

const ManageUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (applied when the form is submitted)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const [viewing, setViewing] = useState<AdminUser | null>(null);
  const [blocking, setBlocking] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  /* Load ------------------------------------------------------------ */

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (role !== "all") params.set("role", role);

      const qs = params.toString();
      const data = await apiFetch<{ users: AdminUser[] }>(
        `/api/admin/users${qs ? `?${qs}` : ""}`,
        { auth: true },
      );
      setUsers(data.users ?? []);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load users",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [search, role]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  /* Block / unblock -------------------------------------------------- */

  const confirmBlock = useCallback(async () => {
    if (!blocking) return;

    const next = !blocking.isBlocked;
    setBusy(true);

    try {
      const data = await apiFetch<{ message: string }>(
        `/api/admin/users/${blocking._id}/block`,
        { method: "PATCH", body: { isBlocked: next } },
      );

      toast.add({
        type: "success",
        title: next ? "User blocked" : "User unblocked",
        description: data.message,
      });

      setUsers((current) =>
        current.map((user) =>
          user._id === blocking._id ? { ...user, isBlocked: next } : user,
        ),
      );
      setBlocking(null);
      setViewing((current) =>
        current && current._id === blocking._id
          ? { ...current, isBlocked: next }
          : current,
      );
    } catch (error) {
      toast.add({
        type: "error",
        title: next ? "Could not block the user" : "Could not unblock the user",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }, [blocking]);

  /* Derived ---------------------------------------------------------- */

  const roleCounts = useMemo(
    () => ({
      total: users.length,
      blocked: users.filter((user) => user.isBlocked).length,
    }),
    [users],
  );

  /* Render ----------------------------------------------------------- */

  return (
    <RoleGuard allow={["admin"]}>
      <div className="space-y-6">
        <PageHeader
          title="Manage Users"
          description="Search accounts, review details and block or unblock users."
        />

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or email..."
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

          <Select value={role} onValueChange={(value) => setRole(value ?? "all")}>
            <SelectTrigger className="h-9 w-44 justify-between rounded-lg border-gray-200">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-gray-500">
          Showing {roleCounts.total} user{roleCounts.total === 1 ? "" : "s"}
          {roleCounts.blocked > 0 && ` · ${roleCounts.blocked} blocked`}
        </p>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && users.length === 0 && (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try a different search term or switch the role filter."
          />
        )}

        {/* Table */}
        {!loading && users.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-rose-100">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center font-semibold text-rose-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="capitalize">{user.role}</TableCell>

                    <TableCell>
                      <StatusBadge status={user.subscription ?? "free"} />
                    </TableCell>

                    <TableCell>
                      {user.isBlocked ? (
                        <StatusBadge status="blocked" />
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="size-3.5" />
                          Active
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-gray-500">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewing(user)}
                        >
                          <Eye />
                          View
                        </Button>

                        {user.role !== "admin" && (
                          <Button
                            size="sm"
                            variant={user.isBlocked ? "outline" : "destructive"}
                            onClick={() => setBlocking(user)}
                          >
                            {user.isBlocked ? (
                              <>
                                <ShieldCheck />
                                Unblock
                              </>
                            ) : (
                              <>
                                <Ban />
                                Block
                              </>
                            )}
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
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>User details</DialogTitle>
            <DialogDescription>
              Read-only overview of this account.
            </DialogDescription>
          </DialogHeader>

          {viewing && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-rose-100">
                  {viewing.image ? (
                    <Image
                      src={viewing.image}
                      alt={viewing.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center font-semibold text-rose-700">
                      {viewing.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {viewing.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">{viewing.email}</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Role</dt>
                  <dd className="flex items-center gap-1 font-medium capitalize text-gray-800">
                    <UserRound className="size-3.5" />
                    {viewing.role}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Plan</dt>
                  <dd className="font-medium capitalize text-gray-800">
                    {viewing.role === "vendor"
                      ? viewing.subscription ?? "free"
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Status</dt>
                  <dd className="font-medium text-gray-800">
                    {viewing.isBlocked ? "Blocked" : "Active"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Joined</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDateTime(viewing.createdAt)}
                  </dd>
                </div>
              </dl>

              <p className="text-xs leading-relaxed text-gray-500">
                Blocked users cannot sign in to their dashboard or call any
                protected API route until they are unblocked.
              </p>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
                {viewing.role !== "admin" && (
                  <Button
                    variant={viewing.isBlocked ? "default" : "destructive"}
                    onClick={() => setBlocking(viewing)}
                  >
                    {viewing.isBlocked ? "Unblock user" : "Block user"}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block confirmation ------------------------------------------- */}
      <Dialog open={blocking !== null} onOpenChange={(open) => !open && setBlocking(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {blocking?.isBlocked ? "Unblock this user?" : "Block this user?"}
            </DialogTitle>
            <DialogDescription>
              {blocking?.isBlocked
                ? `${blocking?.name} will be able to sign in and use WedPlan again.`
                : `${blocking?.name} will lose access to the dashboard and all protected routes immediately.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBlocking(null)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={confirmBlock}
              disabled={busy}
              variant={blocking?.isBlocked ? "default" : "destructive"}
            >
              {busy ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Saving...
                </>
              ) : blocking?.isBlocked ? (
                "Unblock"
              ) : (
                "Block user"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  );
};

export default ManageUsersPage;
