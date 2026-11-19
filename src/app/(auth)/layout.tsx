import React from "react";
import Link from "next/link";
import { Heart, BadgeCheck, CalendarDays, ShieldCheck } from "lucide-react";

/**
 * Shared shell for all authentication pages (sign in / sign up).
 * Left side = wedding-themed brand panel (hidden on mobile).
 * Right side = the form card rendered by each page.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-[#1c0f12] lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12">
        {/* Background photo + overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1c0f12]/95 via-[#2b1416]/90 to-[#7a1f2b]/70"
          aria-hidden="true"
        />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Heart className="h-5 w-5 fill-white text-white" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold text-white">
              WedPlan
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/60">
              Wedding Marketplace
            </span>
          </span>
        </Link>

        {/* Headline + benefits */}
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Every love story deserves a{" "}
            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text italic text-transparent">
              flawless
            </span>{" "}
            celebration.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Join thousands of couples and vendors who plan, book, and celebrate
            with WedPlan.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              {
                icon: BadgeCheck,
                text: "Admin-vetted vendors you can trust",
              },
              {
                icon: CalendarDays,
                text: "Send booking requests in seconds",
              },
              {
                icon: ShieldCheck,
                text: "Secure payments powered by Stripe",
              },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4 text-amber-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="relative text-xs text-white/50">
          © 2026 WedPlan. All rights reserved.
        </p>
      </aside>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-rose-50 via-white to-rose-50 px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
