"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Camera,
  Heart,
  ImagePlus,
  Mail,
  UserRound,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { authClient, signUp } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

type AccountRole = "customer" | "vendor";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function fileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Could not read the selected image."));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

const SignupForm = () => {
  const [role, setRole] = useState<AccountRole>("customer");
  const [businessName, setBusinessName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetch: refreshSession } = authClient.useSession();
  const router = useRouter();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Choose an image smaller than 5 MB.");
      event.currentTarget.value = "";
      return;
    }

    setError(null);
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const selectedBusinessName = businessName.trim();

    if (role === "vendor" && !selectedBusinessName) {
      setError("Enter your business or studio name.");
      return;
    }
    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      setError("Password must be at least 6 characters and include an uppercase and a lowercase letter.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: signupError } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (signupError || !data?.user) {
        setError(signupError?.message ?? "Could not create your account.");
        return;
      }

      const completionResponse = await fetch("/api/registration/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ role, businessName: selectedBusinessName }),
      });
      const completionData = await completionResponse.json().catch(() => ({}));
      if (!completionResponse.ok) {
        throw new Error(
          completionData.message ?? "Your account was created, but profile setup did not finish.",
        );
      }

      let photoUploadFailed = false;
      if (profileImage) {
        try {
          const image = await fileAsDataUrl(profileImage);
          const uploaded = await apiFetch<{ url: string }>("/api/upload", {
            method: "POST",
            body: { image },
          });
          await apiFetch("/api/profile", {
            method: "PUT",
            body: { image: uploaded.url },
          });
        } catch {
          photoUploadFailed = true;
        }
      }

      await refreshSession({ query: { disableCookieCache: true } });
      toast.add({
        type: photoUploadFailed ? "error" : "success",
        title: photoUploadFailed ? "Account created" : `Welcome to WedPlan, ${name}`,
        description: photoUploadFailed
          ? "Your account is ready, but the profile photo could not upload. You can add it in Profile Settings."
          : "Your account is ready. Let's start planning.",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <header className="space-y-3 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#8e263a] text-white shadow-sm">
          <Heart className="size-5 fill-current" />
        </span>
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl font-semibold text-[#241518] sm:text-[1.7rem]">
            Create Your WedPlan Account
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-5 text-[#777074]">
            Join as a couple planning your wedding or as a vendor offering curated services.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FieldGroup className="gap-3.5">
          <Field>
            <FieldLabel className="text-sm font-medium text-[#383236]">Account Role</FieldLabel>
            <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Account role">
              {([
                ["customer", "Customer", "Plan and book services"],
                ["vendor", "Vendor", "Publish wedding services"],
              ] as const).map(([value, label, description]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={role === value}
                  onClick={() => setRole(value)}
                  disabled={isLoading}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e263a]/30 ${
                    role === value
                      ? "border-[#8e263a] bg-[#fbf1f2] ring-1 ring-[#8e263a]/20"
                      : "border-[#e9e3e2] bg-white hover:border-[#c8a8ad]"
                  }`}
                >
                  <span className="block text-sm font-semibold text-[#30272a]">{label}</span>
                  <span className="mt-0.5 block text-xs text-[#817a7d]">{description}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="profileImage" className="sr-only">Profile photo</FieldLabel>
            <div className="flex items-center gap-3 rounded-xl border border-[#e9e3e2] bg-[#fdfbfa] p-3">
              <div
                className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f7e7e9] text-sm font-semibold text-[#8e263a]"
                style={imagePreview ? { backgroundImage: `url(${imagePreview})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                aria-label={imagePreview ? "Selected profile photo preview" : "Profile photo placeholder"}
              >
                {!imagePreview && "WP"}
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="profileImage"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e6dedc] bg-white px-3 py-2 text-xs font-medium text-[#484044] hover:bg-[#faf6f5]"
                >
                  <Camera className="size-3.5" />
                  {profileImage ? "Change profile photo" : "Upload Profile Photo (Optional)"}
                </label>
                <p className="mt-1.5 text-[11px] text-[#8b8386]">Hosted on ImgBB · JPG, PNG or WebP · max 5 MB</p>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </div>
              <ImagePlus className="size-4 shrink-0 text-[#a99da0]" />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="name" className="text-sm font-medium text-[#383236]">Full Name</FieldLabel>
            <InputGroup className="h-10 rounded-xl border-[#e5dedd] bg-white focus-within:border-[#8e263a] focus-within:ring-2 focus-within:ring-[#8e263a]/10">
              <InputGroupAddon><UserRound className="text-[#92898c]" /></InputGroupAddon>
              <InputGroupInput id="name" name="name" type="text" autoComplete="name" placeholder="Emma Watson" required maxLength={100} disabled={isLoading} />
            </InputGroup>
          </Field>

          {role === "vendor" && (
            <Field>
              <FieldLabel htmlFor="businessName" className="text-sm font-medium text-[#383236]">Business / Studio Name</FieldLabel>
              <InputGroup className="h-10 rounded-xl border-[#e5dedd] bg-white focus-within:border-[#8e263a] focus-within:ring-2 focus-within:ring-[#8e263a]/10">
                <InputGroupAddon><Building2 className="text-[#92898c]" /></InputGroupAddon>
                <InputGroupInput
                  id="businessName"
                  name="businessName"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  placeholder="Rosewood Wedding Studio"
                  required
                  maxLength={120}
                  disabled={isLoading}
                />
              </InputGroup>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="email" className="text-sm font-medium text-[#383236]">Email</FieldLabel>
            <InputGroup className="h-10 rounded-xl border-[#e5dedd] bg-white focus-within:border-[#8e263a] focus-within:ring-2 focus-within:ring-[#8e263a]/10">
              <InputGroupAddon><Mail className="text-[#92898c]" /></InputGroupAddon>
              <InputGroupInput id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={isLoading} />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password" className="text-sm font-medium text-[#383236]">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Min 6 chars, 1 uppercase & 1 lowercase"
              minLength={6}
              required
              disabled={isLoading}
              aria-describedby="password-hint"
              className="h-10 rounded-xl border-[#e5dedd] bg-white focus-within:border-[#8e263a] focus-within:ring-2 focus-within:ring-[#8e263a]/10"
            />
            <FieldDescription id="password-hint" className="text-[11px] text-[#8b8386]">
              Use at least 6 characters, including one uppercase and one lowercase letter.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-xl bg-[#8e263a] text-sm font-semibold text-white hover:bg-[#762033]"
        >
          {isLoading ? <><Spinner /> Creating account…</> : <>Create Account <ArrowRight data-icon="inline-end" /></>}
        </Button>

        {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
          <>
            <div className="flex items-center gap-3 py-1 text-[11px] uppercase tracking-wider text-[#a0989a]">
              <span className="h-px flex-1 bg-[#eee8e7]" />or continue with<span className="h-px flex-1 bg-[#eee8e7]" />
            </div>
            <GoogleButton label="Continue with Google" flow="signup" disabled={isLoading} />
          </>
        )}
      </form>

      <p className="text-center text-sm text-[#777074]">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-[#8e263a] underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default SignupForm;
