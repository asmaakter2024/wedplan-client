import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

/** Shared, responsive card shell for the sign-in and account-creation pages. */
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex min-h-svh items-center justify-center bg-[#fbf8f7] px-4 py-8 sm:py-12">
    <div className="w-full max-w-[30rem]">
      <section className="rounded-2xl border border-[#eee7e5] bg-white px-5 py-7 shadow-[0_12px_40px_rgba(57,31,35,0.07)] sm:px-7 sm:py-8">
        {children}
      </section>
      <p className="mt-5 text-center text-xs text-[#948b8d]">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#8e263a]">
          <Heart className="size-3 fill-current" /> WedPlan · Plan your day, your way
        </Link>
      </p>
    </div>
  </main>
);

export default AuthLayout;
