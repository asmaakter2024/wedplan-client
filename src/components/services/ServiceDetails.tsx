"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { apiFetch, API_URL } from "@/lib/api";
import type { Service } from "@/lib/services";
import { DEMO_SERVICES } from "@/lib/demo-services";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const ServiceDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // Booking form state
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const role = session?.user?.role as string | undefined;

  /* Load the service ------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadService() {
      setLoading(true);
      setError(null);

      // Reject obviously invalid ids early (the API would return 400)
      if (!/^[a-zA-Z0-9-]{6,}$/.test(id)) {
        setError("Invalid service id. This service does not exist.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/services/${id}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || "Service not found.");
        }

        if (!cancelled) {
          setService(data.service);
          setActiveImage(0);
        }
      } catch (err) {
        // Offline fallback: look the id up in the demo data
        const demo = DEMO_SERVICES.find((item) => item._id === id);
        if (demo && !cancelled) {
          setService(demo);
          setActiveImage(0);
        } else if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Service not found.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadService();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* Booking --------------------------------------------------------- */

  const handleBooking = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!session) {
        router.push("/signin");
        return;
      }

      if (!eventDate || !eventLocation) {
        toast.add({
          type: "error",
          title: "Missing information",
          description: "Please provide an event date and location.",
        });
        return;
      }

      setSubmitting(true);
      try {
        const data = await apiFetch<{ message: string }>("/api/bookings", {
          method: "POST",
          body: {
            serviceId: id,
            eventDate,
            eventLocation,
            message,
          },
        });

        toast.add({
          type: "success",
          title: "Booking request sent!",
          description: data.message,
        });
        setBooked(true);
        setEventDate("");
        setEventLocation("");
        setMessage("");
      } catch (err) {
        toast.add({
          type: "error",
          title: "Could not send booking request",
          description:
            err instanceof Error ? err.message : "Something went wrong.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [session, id, eventDate, eventLocation, message, router],
  );

  /* Render states --------------------------------------------------- */

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-[#f7f5f2] py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Spinner className="h-8 w-8 text-[#7a1f2b]" />
          <p className="text-sm text-gray-500">Loading service details...</p>
        </div>
      </section>
    );
  }

  if (error || !service) {
    return (
      <section className="min-h-[70vh] bg-[#f7f5f2] py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
            <Package className="h-7 w-7 text-rose-600" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            Service not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
            {error ||
              "This service does not exist, was removed, or is no longer available."}
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7a1f2b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#661824]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse Services
          </Link>
        </div>
      </section>
    );
  }

  /* Derived data ---------------------------------------------------- */

  const vendor =
    typeof service.vendorId === "object" && service.vendorId !== null
      ? service.vendorId
      : null;
  const vendorName = vendor?.businessName || vendor?.name || "WedPlan Vendor";
  const images =
    service.images && service.images.length > 0
      ? service.images
      : [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
        ];

  // Booking rules (also enforced server-side):
  // - only signed-in customers may book
  // - vendors cannot book their own services
  // - admins cannot submit customer booking requests
  const isOwnService =
    role === "vendor" && vendor?._id === session?.user?.id;

  let bookingNotice: { icon: typeof Lock; text: string } | null = null;
  if (isPending) {
    bookingNotice = null; // still checking the session
  } else if (!session) {
    bookingNotice = {
      icon: Lock,
      text: "Sign in as a customer to send a booking request.",
    };
  } else if (role === "admin") {
    bookingNotice = {
      icon: ShieldCheck,
      text: "Admin accounts cannot submit customer booking requests.",
    };
  } else if (isOwnService) {
    bookingNotice = {
      icon: ShieldCheck,
      text: "This is your own service — vendors cannot book their own services.",
    };
  } else if (role !== "customer") {
    bookingNotice = {
      icon: Lock,
      text: "Only customers can submit booking requests.",
    };
  }

  /* Render ---------------------------------------------------------- */

  return (
    <section className="min-h-[70vh] bg-[#f7f5f2] py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#7a1f2b]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse Services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Left — image gallery */}
          <div>
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <Image
                src={images[activeImage]}
                alt={`${service.serviceName} — image ${activeImage + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm">
                {service.category}
              </span>
              <span className="absolute bottom-3 right-3 rounded-full bg-[#1c0f12] px-4 py-2 text-sm font-semibold text-white">
                ${service.price.toLocaleString()}
              </span>
            </div>

            {/* Thumbnails (only when there are multiple images) */}
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`relative aspect-[3/2] overflow-hidden rounded-lg border-2 transition-colors ${
                      index === activeImage
                        ? "border-[#7a1f2b]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — info + booking */}
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                <Sparkles className="h-3 w-3" />
                Featured Partner
              </span>

              <h1 className="mt-3 font-display text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                {service.serviceName}
              </h1>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4 shrink-0" />
                {service.location}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                {service.description}
              </p>

              {/* Vendor information */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                {vendor?.image ? (
                  <Image
                    src={vendor.image}
                    alt={vendorName}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-base font-semibold text-rose-700">
                    {vendorName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-900">
                    {vendorName}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Verified WedPlan Vendor
                  </p>
                </div>
              </div>

              <hr className="my-5 border-gray-100" />

              {/* Booking option */}
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                <Calendar className="h-4.5 w-4.5 text-[#7a1f2b]" />
                Request a Booking
              </h2>

              {booked ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                  <p className="mt-2 text-sm font-semibold text-emerald-800">
                    Your booking request has been sent!
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-700">
                    Track its status from My Bookings in your dashboard.
                  </p>
                  <Link
                    href="/dashboard"
                    className="mt-3 inline-block rounded-lg bg-[#7a1f2b] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#661824]"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : bookingNotice ? (
                /* Not allowed to book — explain why */
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <bookingNotice.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gray-500" />
                  <p className="text-sm leading-relaxed text-gray-600">
                    {bookingNotice.text}{" "}
                    {!session && (
                      <Link
                        href="/signin"
                        className="font-semibold text-[#7a1f2b] underline-offset-2 hover:underline"
                      >
                        Sign in
                      </Link>
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="mt-4 space-y-4">
                  {/* Event date */}
                  <div>
                    <label
                      htmlFor="eventDate"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Event Date
                    </label>
                    <input
                      id="eventDate"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={eventDate}
                      onChange={(event) => setEventDate(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
                    />
                  </div>

                  {/* Event location */}
                  <div>
                    <label
                      htmlFor="eventLocation"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Event Location
                    </label>
                    <input
                      id="eventLocation"
                      type="text"
                      required
                      placeholder="Venue name or city"
                      value={eventLocation}
                      onChange={(event) =>
                        setEventLocation(event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
                    />
                  </div>

                  {/* Additional message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Additional Message{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Tell the vendor about your wedding style, guest count, or special requests..."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7a1f2b] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#661824] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4" />
                        Send Booking Request
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    The vendor will review and accept or reject your request.
                  </p>
                </form>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, text: "Verified Vendors" },
                { icon: CheckCircle2, text: "Secure Booking" },
                { icon: Sparkles, text: "Premium Quality" },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2 py-3 text-center"
                >
                  <badge.icon className="h-4.5 w-4.5 text-[#c9a227]" />
                  <span className="text-[11px] font-medium text-gray-600">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
