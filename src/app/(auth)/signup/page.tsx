"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Loader2,
  Mail,
  Lock,
  User,
  Store,
  Users,
  Check,
  X,
  ImagePlus,
} from "lucide-react";

type Role = "vendor" | "customer";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password rules required by the assignment
  const rules = useMemo(
    () => [
      { label: "At least 6 characters", passed: password.length >= 6 },
      { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
      { label: "One lowercase letter", passed: /[a-z]/.test(password) },
    ],
    [password],
  );
  const allRulesPassed = rules.every((rule) => rule.passed);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    // Local preview only — ImgBB upload will be added with Better Auth
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    // Basic validation before sending anything to the server
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (!allRulesPassed) {
      setError("Your password does not meet the requirements yet.");
      return;
    }

    console.log("sign up submitted:",{
      name,
      email,
      password:"[hidden]",
      role,
      imagePreview,
    });

    setSubmitting(true);

    // TODO: Better Auth sign-up will be connected here later
    setTimeout(() => {
      setSubmitting(false);
      setInfo("Static UI only — Better Auth will be connected here later.");
    }, 600);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-rose-900/5">
      {/* Logo (mobile only — the brand panel shows it on desktop) */}
      <Link
        href="/"
        className="mb-6 flex items-center justify-center gap-2.5 lg:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7a1f2b]">
          <Heart className="h-[18px] w-[18px] fill-white text-white" />
        </span>
        <span className="font-display text-xl font-bold text-[#2b1416]">
          WedPlan
        </span>
      </Link>

      <h1 className="font-display text-2xl font-bold text-gray-900">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-gray-500">
        Start planning your dream wedding in minutes.
      </p>

      {/* Google sign-up */}
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          or sign up with email
        </span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Role selection */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            I want to join as
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex flex-col items-start gap-1.5 rounded-lg border p-3.5 text-left transition-colors ${
                role === "customer"
                  ? "border-rose-400 bg-rose-50 ring-2 ring-rose-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Users
                className={`h-4 w-4 ${role === "customer" ? "text-rose-600" : "text-gray-400"}`}
              />
              <span className="text-sm font-semibold text-gray-900">
                Customer
              </span>
              <span className="text-xs text-gray-500">
                Book wedding services
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`flex flex-col items-start gap-1.5 rounded-lg border p-3.5 text-left transition-colors ${
                role === "vendor"
                  ? "border-rose-400 bg-rose-50 ring-2 ring-rose-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Store
                className={`h-4 w-4 ${role === "vendor" ? "text-rose-600" : "text-gray-400"}`}
              />
              <span className="text-sm font-semibold text-gray-900">
                Vendor
              </span>
              <span className="text-xs text-gray-500">Offer my services</span>
            </button>
          </div>
        </div>

        {/* Full name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        {/* Password + live rules */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <ul className="mt-2.5 grid gap-1.5">
            {rules.map((rule) => (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 text-xs ${
                  rule.passed ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    rule.passed ? "bg-emerald-100" : "bg-gray-100"
                  }`}
                >
                  {rule.passed ? (
                    <Check className="h-2.5 w-2.5" />
                  ) : (
                    <X className="h-2.5 w-2.5" />
                  )}
                </span>
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Profile image (optional) */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Profile Image{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </span>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-4 py-3 transition-colors hover:border-rose-300 hover:bg-rose-50/50">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400">
                <ImagePlus className="h-4 w-4" />
              </span>
            )}
            <span className="text-sm text-gray-600">
              <span className="font-medium text-rose-600">Upload a photo</span>{" "}
              or drag it here
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7a1f2b] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/15 transition-colors hover:bg-[#661824] disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-rose-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
