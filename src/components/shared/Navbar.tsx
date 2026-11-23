"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignoutCompo from "./Signout";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a1f2b]">
            <Heart className="h-5 w-5 fill-white text-white" />
          </span>
          <span className="font-bold text-[#2b1416]">WedPlan</span>
        </Link>

        <nav className="hidden gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm",
                pathname === link.href
                  ? "bg-rose-100 text-rose-700"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <details className="relative md:hidden" open={mobileMenuOpen}>
            <summary
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={(event) => {
                event.preventDefault();
                setMobileMenuOpen((open) => !open);
              }}
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </summary>
            {mobileMenuOpen && (
              <nav className="absolute right-0 top-12 z-50 flex min-w-48 flex-col gap-1 rounded-xl border bg-white p-2 shadow-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </details>
          {isPending ? null : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
                  <UserRound className="h-4 w-4" />
                  {session.user.name || "Profile"}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/dashboard/profile">Profile Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <SignoutCompo />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/signin"
              className="rounded-full border px-5 py-2 text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
