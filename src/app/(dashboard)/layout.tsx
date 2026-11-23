"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import { clearToken } from "@/lib/api";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Unauthenticated visitors are sent to the sign-in page.
  // (Server-side role checks are added on the API routes later.)
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    } else if (!isPending && session?.user.registrationRolePending) {
      router.replace("/signup/complete");
    }
  }, [isPending, session, router]);

  // Loading state while the session is being checked
  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        Checking your session...
      </div>
    );
  }

  // Being redirected to the sign-in page
  if (!session) return null;

  if (session.user.isBlocked) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-[#f9f6f4] px-4">
        <section className="max-w-md rounded-2xl border bg-white p-7 text-center shadow-sm">
          <h1 className="font-display text-xl font-semibold text-[#241518]">Account access is blocked</h1>
          <p className="mt-2 text-sm text-[#777074]">Contact WedPlan support if you believe this is a mistake.</p>
          <button
            type="button"
            onClick={async () => {
              try { await authClient.signOut(); } finally { clearToken(); router.replace("/signin"); }
            }}
            className="mt-5 rounded-lg bg-[#8e263a] px-4 py-2 text-sm font-semibold text-white"
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar />

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-black/5 bg-white px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">
              WedPlan Dashboard
            </span>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
