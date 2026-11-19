"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Vendor Hub", href: "/vendors" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a1f2b] shadow-sm">
            <Heart className="h-5 w-5 fill-white text-white" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-[#2b1416]">
              WedPlan
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-gray-500">
              Wedding Marketplace
            </span>
          </span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-rose-100 text-rose-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/signin"
            className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            Sign In
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 md:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
