import type { Metadata } from "next";
import ServiceDetails from "@/components/services/ServiceDetails";

export const metadata: Metadata = {
  title: "Service Details | WedPlan",
  description:
    "View full service details, gallery, and vendor information — then send a booking request.",
};

/**
 * This route depends on runtime data (the dynamic service id), so it is
 * rendered on demand instead of being prerendered at build time.
 */
export const instant = false;

/** In Next 16 `params` is a Promise and must be awaited. */
export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ServiceDetails id={id} />;
}
