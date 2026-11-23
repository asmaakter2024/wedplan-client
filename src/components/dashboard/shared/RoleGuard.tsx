"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import type { Role } from "@/lib/dashboard";

/**
 * Makes sure a page is only shown to the right role.
 *
 *   <RoleGuard allow={["vendor"]}> ...vendor only... </RoleGuard>
 *
 * Everyone else is sent back to their own dashboard (the API checks the
 * role again on every request — this only protects the UI).
 */
const RoleGuard = ({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const role = (session?.user?.role as Role | undefined) ?? "customer";
  const allowed = allow.includes(role);

  useEffect(() => {
    if (!isPending && !allowed) {
      router.replace("/dashboard");
    }
  }, [isPending, allowed, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        Checking your access...
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
};

export default RoleGuard;
