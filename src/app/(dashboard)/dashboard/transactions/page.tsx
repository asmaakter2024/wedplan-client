"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lock, RefreshCw, Search, Wallet } from "lucide-react";
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
import { formatDateTime, formatMoney, type Transaction } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

/**
 * Payment records created by Stripe.
 * Read-only by design: admins can never change an amount or a status.
 */
const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ transactions: Transaction[] }>(
        "/api/admin/transactions",
        { auth: true },
      );
      setTransactions(data.transactions ?? []);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load transactions",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  /* Filtering (client side — the list is small) ---------------------- */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const vendorName = (
        transaction.vendorId?.businessName ||
        transaction.vendorId?.name ||
        transaction.vendorId?.email ||
        ""
      ).toLowerCase();

      const matchesSearch = !term || vendorName.includes(term);
      const matchesStatus = status === "all" || transaction.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, status]);

  const totalRevenue = useMemo(
    () =>
      transactions
        .filter((item) => item.status === "succeeded")
        .reduce((sum, item) => sum + (item.amount || 0), 0),
    [transactions],
  );

  /* Render ----------------------------------------------------------- */

  return (
    <RoleGuard allow={["admin"]}>
      <div className="space-y-6">
        <PageHeader
          title="Transactions"
          description="Every Stripe payment made by vendors for the Premium plan."
          action={
            <Button variant="outline" onClick={loadTransactions} disabled={loading}>
              <RefreshCw className={loading ? "animate-spin" : undefined} />
              Refresh
            </Button>
          }
        />

        {/* Read-only notice + totals */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:col-span-2">
            <Lock className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Read-only payment records
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Amounts, statuses and dates come straight from Stripe webhooks.
                This dashboard never modifies them — changes are only possible
                inside Stripe itself.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total revenue</p>
            <p className="mt-1 font-display text-3xl font-bold text-gray-900">
              {formatMoney(totalRevenue)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {transactions.filter((item) => item.status === "succeeded").length}{" "}
              successful payment(s)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3">
            <Search className="size-4 shrink-0 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by vendor name or email..."
              className="h-9 w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger className="h-9 w-44 justify-between rounded-lg border-gray-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="succeeded">Succeeded</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && visible.length === 0 && (
          <EmptyState
            icon={Wallet}
            title="No transactions yet"
            description={
              transactions.length === 0
                ? "When a vendor upgrades to Premium, the Stripe payment appears here."
                : "No transaction matches the current filters."
            }
          />
        )}

        {/* Table */}
        {!loading && visible.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {transaction.vendorId?.businessName ||
                            transaction.vendorId?.name ||
                            "Unknown vendor"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {transaction.vendorId?.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="capitalize">{transaction.plan}</TableCell>

                    <TableCell className="font-semibold text-gray-900">
                      {formatMoney(transaction.amount, transaction.currency === "usd" ? "USD" : transaction.currency)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>

                    <TableCell className="text-gray-500">
                      {formatDateTime(transaction.paidAt || transaction.createdAt)}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-gray-400">
                      {transaction.stripeSessionId
                        ? `...${transaction.stripeSessionId.slice(-10)}`
                        : transaction._id.slice(-8).toUpperCase()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default TransactionsPage;
