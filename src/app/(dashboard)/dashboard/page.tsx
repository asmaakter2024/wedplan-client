import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Placeholder overview page.
 * Statistics cards will be filled with real database data later.
 */
export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here is a snapshot of your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Total Bookings", "Pending Requests", "Accepted Bookings"].map(
          (label) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="font-display text-3xl font-bold text-gray-900">
                  0
                </span>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
