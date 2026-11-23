import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f9f6f4] px-4 py-16">
      <div className="max-w-md text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#8e263a] text-white">
          <Heart className="size-6 fill-current" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#8e263a]">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#241518]">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-[#777074]">That WedPlan page may have moved or the address may be incorrect.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8e263a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#762033]">
          <ArrowLeft className="size-4" /> Back to WedPlan
        </Link>
      </div>
    </main>
  );
}
