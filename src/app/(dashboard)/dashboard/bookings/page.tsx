"use client";

import { authClient } from "@/lib/auth-client";
import type { Role } from "@/lib/dashboard";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";
import BookingRequests from "@/components/dashboard/vendor/BookingRequests";
import MyBookings from "@/components/dashboard/customer/MyBookings";

/**
 * One URL for two dashboards:
 *   /dashboard/bookings  ->  vendor: booking requests (accept / reject)
 *                            customer: my bookings (view / cancel)
 */
const BookingsPage = () => {
  const { data: session } = authClient.useSession();
  const role = (session?.user?.role as Role | undefined) ?? "customer";

  return (
    <RoleGuard allow={["customer", "vendor"]}>
      {role === "vendor" ? <BookingRequests /> : <MyBookings />}
    </RoleGuard>
  );
};

export default BookingsPage;
