"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { BadgeCheck, ImageUp, Loader2, Save, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import type { Role } from "@/lib/dashboard";
import PageHeader from "@/components/dashboard/shared/PageHeader";

type Profile = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  businessName?: string | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  subscription?: "free" | "premium";
};

/** Reads a picture from the computer and returns it as a base64 string. */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7a1f2b] focus:outline-none focus:ring-1 focus:ring-[#7a1f2b]";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  /* Load ------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await apiFetch<{ user: Profile }>("/api/profile", {
          auth: true,
        });
        if (!cancelled) setProfile(data.user);
      } catch (error) {
        if (!cancelled) {
          toast.add({
            type: "error",
            title: "Could not load your profile",
            description:
              error instanceof Error ? error.message : "Please try again.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Save ------------------------------------------------------------ */

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!profile) return;

      if (!profile.name.trim()) {
        toast.add({
          type: "error",
          title: "Name is required",
          description: "Please enter your full name.",
        });
        return;
      }

      setSaving(true);
      try {
        let image = profile.image ?? "";

        // Upload a new picture first if one was chosen
        if (file) {
          setUploading(true);
          const base64 = await fileToBase64(file);
          const uploaded = await apiFetch<{ url: string }>("/api/upload", {
            method: "POST",
            body: { image: base64 },
          });
          image = uploaded.url;
        }

        await apiFetch<{ message: string }>("/api/profile", {
          method: "PUT",
          body: {
            name: profile.name.trim(),
            image,
            businessName: profile.businessName ?? "",
            phone: profile.phone ?? "",
            address: profile.address ?? "",
            bio: profile.bio ?? "",
          },
        });

        setProfile({ ...profile, image });
        setFile(null);

        toast.add({
          type: "success",
          title: "Profile updated",
          description: "Your changes were saved successfully.",
        });
      } catch (error) {
        toast.add({
          type: "error",
          title: "Could not update your profile",
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setUploading(false);
        setSaving(false);
      }
    },
    [profile, file],
  );

  /* Render ---------------------------------------------------------- */

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (!profile) return null;

  const planLabel =
    profile.role === "vendor"
      ? profile.subscription === "premium"
        ? "Premium"
        : "Free"
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Keep your personal details up to date."
      />

      {/* Read-only account info */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-rose-100 font-semibold text-rose-700 capitalize">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
            <p className="text-xs text-gray-500">
              Role: <span className="capitalize font-medium">{profile.role}</span>
              {planLabel && <> · Plan: {planLabel}</>}
            </p>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="size-4 text-emerald-600" />
          Role and plan cannot be changed here.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
      >
        {/* Profile image */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-2xl font-semibold text-gray-400">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Profile image</Label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImageUp className="size-4" />
                )}
                {file ? file.name : "Choose an image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={saving || uploading}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">
              Or paste a new URL below. Uploaded images are hosted on ImgBB.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="image" className="text-sm font-medium text-gray-700">
            Image URL
          </Label>
          <Input
            id="image"
            type="url"
            value={profile.image ?? ""}
            onChange={(event) => setProfile({ ...profile, image: event.target.value })}
            placeholder="https://example.com/photo.jpg"
            className={inputClass}
            disabled={saving || uploading}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full name *
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              required
              maxLength={100}
              className={inputClass}
              disabled={saving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className={`${inputClass} bg-gray-50 text-gray-500`}
            />
          </div>
        </div>

        {profile.role === "vendor" && (
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
              Business name
            </Label>
            <Input
              id="businessName"
              value={profile.businessName ?? ""}
              onChange={(event) =>
                setProfile({ ...profile, businessName: event.target.value })
              }
              placeholder="Your studio or company name"
              maxLength={150}
              className={inputClass}
              disabled={saving}
            />
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </Label>
            <Input
              id="phone"
              value={profile.phone ?? ""}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              placeholder="+880 1XXX XXXXXX"
              maxLength={30}
              className={inputClass}
              disabled={saving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address
            </Label>
            <Input
              id="address"
              value={profile.address ?? ""}
              onChange={(event) => setProfile({ ...profile, address: event.target.value })}
              placeholder="City, Country"
              maxLength={200}
              className={inputClass}
              disabled={saving}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
            About you
          </Label>
          <Textarea
            id="bio"
            rows={4}
            value={profile.bio ?? ""}
            onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
            placeholder="A short introduction..."
            maxLength={1000}
            className={inputClass}
            disabled={saving}
          />
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button
            type="submit"
            disabled={saving || uploading}
            className="h-10 bg-[#7a1f2b] text-white hover:bg-[#661824]"
          >
            {saving || uploading ? (
              <>
                <Spinner className="h-4 w-4" />
                {uploading ? "Uploading image..." : "Saving..."}
              </>
            ) : (
              <>
                <Save />
                Save changes
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <BadgeCheck className="size-4" />
        Changes are saved on the server — other users see them right away.
      </p>
    </div>
  );
};

export default ProfilePage;
