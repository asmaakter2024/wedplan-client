"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CreditCard,
  FileCheck,
  Heart,
  Inbox,
  LayoutDashboard,
  LogIn,
  LogOut,
  PlusCircle,
  Settings,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

/* ------------------------------------------------------------------ */
/* Role-based navigation                                              */
/* ------------------------------------------------------------------ */

type Role = "customer" | "vendor" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  customer: [
    {
      label: "General",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Profile Settings", href: "/dashboard/profile", icon: Settings },
      ],
    },
  ],
  vendor: [
    {
      label: "General",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "My Services", href: "/dashboard/services", icon: Store },
        { label: "Add Service", href: "/dashboard/services/new", icon: PlusCircle },
        { label: "Booking Requests", href: "/dashboard/bookings", icon: Inbox },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
        { label: "Profile Settings", href: "/dashboard/profile", icon: Settings },
      ],
    },
  ],
  admin: [
    {
      label: "General",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Manage Users", href: "/dashboard/users", icon: Users },
        { label: "Manage Services", href: "/dashboard/manage-services", icon: FileCheck },
        { label: "Transactions", href: "/dashboard/transactions", icon: Wallet },
      ],
    },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};

const ROLE_BADGE_CLASS: Record<Role, string> = {
  customer: "text-sky-600",
  vendor: "text-amber-600",
  admin: "text-rose-600",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Reads the role from the Better Auth session (never trusted from URLs). */
function getSessionRole(user: { role?: unknown } | null | undefined): Role {
  if (user?.role === "vendor" || user?.role === "admin") return user.role;
  return "customer";
}

/** The Overview link only counts as active on /dashboard exactly. */
function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = getSessionRole(user as { role?: unknown } | null | undefined);
  const navGroups = NAV_BY_ROLE[role];

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      {/* Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="WedPlan"
              render={<Link href="/" />}
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-[#7a1f2b]">
                <Heart className="size-4 fill-white text-white" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">WedPlan</span>
                <span className="truncate text-xs text-muted-foreground">
                  Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {isPending ? (
          /* Loading state while the session is being fetched */
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isItemActive(pathname, item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={active}
                          render={<Link href={item.href} />}
                          className={cn(
                            active &&
                              "bg-rose-100 font-medium text-rose-700 hover:bg-rose-100 hover:text-rose-700",
                          )}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>

      {/* User + sign out */}
      <SidebarFooter>
        <SidebarMenu>
          {user ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Profile Settings"
                  render={<Link href="/dashboard/profile" />}
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? "User"}
                    />
                    <AvatarFallback className="bg-rose-100 text-xs font-semibold text-rose-700">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-semibold">
                      {user.name || "User"}
                    </span>
                    <span
                      className={cn(
                        "truncate text-xs font-medium",
                        ROLE_BADGE_CLASS[role],
                      )}
                    >
                      {ROLE_LABEL[role]}
                      {role === "vendor" ? " • Premium" : ""}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sign out" onClick={handleSignOut}>
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign in"
                render={<Link href="/signin" />}
              >
                <LogIn />
                <span>Sign in</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
