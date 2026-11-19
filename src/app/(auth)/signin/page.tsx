"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    // Basic validation before sending anything to the server
    if (!email.trim() || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    setSubmitting(true);

    // TODO: Better Auth sign-in will be connected here later
    setTimeout(() => {
      setSubmitting(false);
      setInfo("Static UI only — Better Auth will be connected here later.");
    }, 600);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-rose-900/5">
      {/* Logo (mobile only — the brand panel shows it on desktop) */}
      <Link href="/" className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7a1f2b]">
          <Heart className="h-[18px] w-[18px] fill-white text-white" />
        </span>
        <span className="font-display text-xl font-bold text-[#2b1416]">
          WedPlan
        </span>
      </Link>

      <h1 className="font-display text-2xl font-bold text-gray-900">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-gray-500">
        Sign in to continue planning your perfect wedding.
      </p>

      {/* Google sign-in */}
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
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
          or continue with email
        </span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-rose-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-10 text-sm outline-none transition-colors focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-rose-600 accent-rose-600"
          />
          Remember me
        </label>

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
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-rose-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SigninPage;
