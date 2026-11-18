"use client";

import React from "react";
import Image from "next/image";
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

        {/* User chip */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-4 transition-colors hover:bg-gray-50"
          >
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
              alt="Elena Vance"
              width={34}
              height={34}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="flex flex-col items-start leading-none">
              <span className="text-[13px] font-semibold text-gray-900">
                Elena Vance
              </span>
              <span className="mt-1 text-[10px] text-gray-500">
                Vendor • Premium
              </span>
            </span>
          </button>

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
