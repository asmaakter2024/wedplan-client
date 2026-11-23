import BookingsPageClient from "./BookingsPageClient";

// The dashboard route depends on the vendor/customer session in the browser.
// It can show its own loading state, but it cannot provide a public instant shell.
export const instant = false;

export default function BookingsPage() {
  return <BookingsPageClient />;
}
