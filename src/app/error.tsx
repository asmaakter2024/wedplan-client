"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("WedPlan page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-display text-2xl font-semibold text-[#241518]">We could not load this page</h1>
        <p className="text-sm leading-6 text-[#777074]">Please try again or return to WedPlan home.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={retry} className="bg-[#8e263a] text-white hover:bg-[#762033]">Try again</Button>
          <Button render={<Link href="/" />} variant="outline" nativeButton={false}>Go home</Button>
        </div>
      </div>
    </main>
  );
}
