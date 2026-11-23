"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Info,
  Loader2,
  Store,
  UploadCloud,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/services";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import RoleGuard from "@/components/dashboard/shared/RoleGuard";

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

const AddServicePage = () => {
  const router = useRouter();

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* Image upload ---------------------------------------------------- */

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null;

    if (chosen && !["image/jpeg", "image/png", "image/webp"].includes(chosen.type)) {
      toast.add({
        type: "error",
        title: "Unsupported file",
        description: "Please choose a JPG, PNG or WebP image.",
      });
      return;
    }
    if (chosen && chosen.size > 5 * 1024 * 1024) {
      toast.add({
        type: "error",
        title: "Image too large",
        description: "Please choose an image smaller than 5 MB.",
      });
      return;
    }

    setFile(chosen);
  };

  /* Submit ---------------------------------------------------------- */

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // 1. Validate the required fields
      if (!serviceName.trim() || !category || !description.trim() || !price || !location.trim()) {
        toast.add({
          type: "error",
          title: "Missing information",
          description: "Please fill in all required fields.",
        });
        return;
      }

      setSubmitting(true);
      try {
        // 2. Upload the chosen picture to ImgBB (if any)
        let url = imageUrl.trim();

        if (file) {
          setUploading(true);
          const base64 = await fileToBase64(file);
          const uploaded = await apiFetch<{ url: string }>("/api/upload", {
            method: "POST",
            body: { image: base64 },
          });
          url = uploaded.url;
          setUploading(false);
        }

        if (!url) {
          toast.add({
            type: "error",
            title: "Service image required",
            description: "Upload an image or paste an image URL.",
          });
          return;
        }

        // 3. Save the service (status starts as "pending")
        await apiFetch<{ message: string }>("/api/vendor/services", {
          method: "POST",
          body: {
            serviceName: serviceName.trim(),
            category,
            description: description.trim(),
            price: Number(price),
            location: location.trim(),
            images: [url],
          },
        });

        toast.add({
          type: "success",
          title: "Service submitted",
          description: "Your service is waiting for admin approval.",
        });

        router.push("/dashboard/services");
      } catch (error) {
        toast.add({
          type: "error",
          title: "Could not create the service",
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      } finally {
        setUploading(false);
        setSubmitting(false);
      }
    },
    [
      serviceName,
      category,
      description,
      price,
      location,
      imageUrl,
      file,
      router,
    ],
  );

  return (
    <RoleGuard allow={["vendor"]}>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Add Service"
          description="Create a new wedding service. An admin reviews it before customers can see it."
          action={
            <Button render={<Link href="/dashboard/services" />} variant="outline" nativeButton={false}>
              <ArrowLeft />
              My Services
            </Button>
          }
        />

        {/* Free plan reminder */}
        <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            New services are saved with the status <b>pending</b>. Customers only
            see a service after it is approved and active. The free plan allows up
            to 3 active services — Premium has no limit.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
        >
          {/* Service name */}
          <div className="space-y-1.5">
            <Label htmlFor="serviceName" className="text-sm font-medium text-gray-700">
              Service name *
            </Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(event) => setServiceName(event.target.value)}
              placeholder="e.g. Garden Ceremony Decoration"
              maxLength={150}
              required
              className={inputClass}
            />
          </div>

          {/* Category + price */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger className="h-10 w-full justify-between rounded-lg border-gray-200">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price (USD) *
              </Label>
              <Input
                id="price"
                type="number"
                min={1}
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="2500"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location *
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or venue area"
              maxLength={200}
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what is included, duration, guest capacity, highlights..."
              maxLength={3000}
              required
              className={inputClass}
            />
          </div>

          {/* Image */}
          <div className="space-y-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <ImagePlus className="size-4 text-gray-500" />
              <Label className="text-sm font-medium text-gray-700">
                Service image *
              </Label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud className="size-4" />
                )}
                {file ? file.name : "Choose an image file"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading || submitting}
                />
              </label>

              <span className="text-center text-xs text-gray-400 sm:w-10">or</span>

              <Input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Paste an image URL"
                type="url"
                className="flex-1"
                disabled={uploading || submitting}
              />
            </div>

            <p className="text-xs text-gray-500">
              The file is uploaded to ImgBB. Maximum size: 5 MB.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/services")}
              disabled={submitting}
              className="h-10"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting || uploading}
              className="h-10 bg-[#7a1f2b] text-white hover:bg-[#661824]"
            >
              {submitting || uploading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  {uploading ? "Uploading image..." : "Saving..."}
                </>
              ) : (
                <>
                  <Store />
                  Submit for approval
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
};

export default AddServicePage;
