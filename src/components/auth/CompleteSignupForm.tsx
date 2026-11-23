"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, Heart, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

type AccountRole = "customer" | "vendor";

export default function CompleteSignupForm() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [role, setRole] = useState<AccountRole>("customer");
  const [businessName, setBusinessName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.replace("/signin");
    else if (!isPending && session && !session.user.registrationRolePending) router.replace("/dashboard");
  }, [isPending, session, router]);

  const completeRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role === "vendor" && !businessName.trim()) {
      toast.add({ type: "error", title: "Business name required", description: "Enter your vendor or studio name." });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/registration/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ role, businessName: businessName.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Could not finish account setup.");

      await refetch({ query: { disableCookieCache: true } });
      toast.add({ type: "success", title: "Account ready", description: "Your WedPlan account has been set up." });
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.add({ type: "error", title: "Could not finish account setup", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !session || !session.user.registrationRolePending) {
    return <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-gray-500"><Spinner /> Checking your account…</div>;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#8e263a] text-white"><Heart className="size-5 fill-current" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#241518]">Finish setting up your account</h1>
          <p className="mt-1 text-sm text-[#777074]">Choose how you want to use WedPlan.</p>
        </div>
      </header>

      <form onSubmit={completeRegistration} className="space-y-5">
        <fieldset disabled={saving}>
          <legend className="mb-2 text-sm font-medium text-[#383236]">Account Role</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              ["customer", "Customer", "Plan and book services"],
              ["vendor", "Vendor", "Publish wedding services"],
            ] as const).map(([value, label, description]) => (
              <button key={value} type="button" onClick={() => setRole(value)} aria-pressed={role === value} className={`rounded-xl border px-3 py-3 text-left ${role === value ? "border-[#8e263a] bg-[#fbf1f2] ring-1 ring-[#8e263a]/20" : "border-[#e9e3e2] bg-white"}`}>
                <span className="block text-sm font-semibold text-[#30272a]">{label}</span>
                <span className="mt-0.5 block text-xs text-[#817a7d]">{description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {role === "vendor" && (
          <label className="block space-y-2 text-sm font-medium text-[#383236]" htmlFor="completeBusinessName">
            Business / Studio Name
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input id="completeBusinessName" value={businessName} onChange={(event) => setBusinessName(event.target.value)} maxLength={120} required placeholder="Rosewood Wedding Studio" className="pl-9" />
            </div>
          </label>
        )}

        <p className="flex items-center gap-2 text-xs text-[#777074]"><UserRound className="size-4" />Signed in as {session.user.name} ({session.user.email})</p>
        <Button type="submit" disabled={saving} className="h-10 w-full bg-[#8e263a] text-white hover:bg-[#762033]">{saving ? <><Spinner /> Saving account…</> : "Continue to WedPlan"}</Button>
      </form>
    </div>
  );
}
