// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Heart } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Browse Services", href: "/services" },
//   { label: "Vendor Hub", href: "/vendors" },
// ];

// const Navbar = () => {
//   const pathname = usePathname();

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-3">
//           <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a1f2b] shadow-sm">
//             <Heart className="h-5 w-5 fill-white text-white" />
//           </span>
//           <span className="flex flex-col leading-none">
//             <span className="font-display text-xl font-bold tracking-tight text-[#2b1416]">
//               WedPlan
//             </span>
//             <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-gray-500">
//               Wedding Marketplace
//             </span>
//           </span>
//         </Link>

//         {/* Center navigation */}
//         <nav className="hidden items-center gap-1 md:flex">
//           {navLinks.map((link) => {
//             const isActive = pathname === link.href;
//             return (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 className={cn(
//                   "rounded-full px-4 py-2 text-sm font-medium transition-colors",
//                   isActive
//                     ? "bg-rose-100 text-rose-700"
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
//                 )}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Actions */}
//         <div className="flex items-center gap-2 sm:gap-3">
//           <Link
//             href="/signin"
//             className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
//           >
//             Sign In
//           </Link>

//           {/* Mobile menu toggle */}
//           <button
//             type="button"
//             aria-label="Open menu"
//             className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 md:hidden"
//           >
//             <span className="flex flex-col gap-1">
//               <span className="block h-0.5 w-4 bg-current" />
//               <span className="block h-0.5 w-4 bg-current" />
//               <span className="block h-0.5 w-4 bg-current" />
//             </span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Heart, UserRound } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { authClient } from "@/lib/auth-client";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Browse Services", href: "/services" },
//   { label: "Vendor Hub", href: "/vendors" },
// ];

// const Navbar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { data: session, isPending } = authClient.useSession();

//   const handleSignOut = async () => {
//     await authClient.signOut();
//     router.push("/signin");
//     router.refresh();
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
//         <Link href="/" className="flex items-center gap-3">
//           <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a1f2b] shadow-sm">
//             <Heart className="h-5 w-5 fill-white text-white" />
//           </span>
//           <span className="flex flex-col leading-none">
//             <span className="font-display text-xl font-bold tracking-tight text-[#2b1416]">
//               WedPlan
//             </span>
//             <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-gray-500">
//               Wedding Marketplace
//             </span>
//           </span>
//         </Link>

//         <nav className="hidden items-center gap-1 md:flex">
//           {navLinks.map((link) => {
//             const isActive = pathname === link.href;

//             return (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 className={cn(
//                   "rounded-full px-4 py-2 text-sm font-medium transition-colors",
//                   isActive
//                     ? "bg-rose-100 text-rose-700"
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
//                 )}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="flex items-center gap-2 sm:gap-3">
//           {!isPending &&
//             (session ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button
//                     type="button"
//                     className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-rose-50"
//                   >
//                     <UserRound className="h-4 w-4" />
//                     <span>{session.user.name || "Profile"}</span>
//                   </button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuLabel>
//                     {session.user.name || "My account"}
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild>
//                     <Link href="/dashboard">Dashboard</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/profile">My Profile</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onSelect={(event) => {
//                       event.preventDefault();
//                       void handleSignOut();
//                     }}
//                     className="cursor-pointer text-red-600 focus:text-red-600"
//                   >
//                     Sign out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <Link
//                 href="/signin"
//                 className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
//               >
//                 Sign In
//               </Link>
//             ))}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, UserRound } from "lucide-react";
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
  { label: "Vendor Hub", href: "/vendors" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  }

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

        <div>
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
                  <Link href="/profile">My Profile</Link>
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
