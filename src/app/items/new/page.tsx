"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";
import type { ItemCategory, ItemCondition } from "@/lib/types";
import {
  Package,
  Type,
  AlignLeft,
  Tag,
  IndianRupee,
  Layers,
  ImagePlus,
  ArrowLeft,
  Rocket,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

const CATEGORIES: ItemCategory[] = ["Books", "Electronics", "Essentials", "Vehicles"];
const CONDITIONS: ItemCondition[] = ["New", "Like New", "Good", "Fair", "Poor"];

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("Books");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("Good");

  // File upload & preview state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      let uploadedImageUrl: string | null = null;

      // Upload image to Supabase Storage if selected
      if (imageFile) {
        setUploadProgress(true);
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const sanitizedExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
        const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;

        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("item-images")
          .getPublicUrl(filePath);

        uploadedImageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("items").insert({
        seller_id: user.id,
        title,
        description,
        category,
        price: parseFloat(price),
        condition,
        image_url: uploadedImageUrl,
      });

      if (insertError) {
        setError(insertError.message);
        toast.error("Listing Failed", {
          description: insertError.message,
        });
      } else {
        toast.success("Listing Published!", {
          description: `"${title}" is now live on the marketplace.`,
        });
        router.push("/");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to create listing. Please try again.";
      setError(msg);
      toast.error("Error", {
        description: msg,
      });
    } finally {
      setLoading(false);
      setUploadProgress(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-8 bg-white border-2 border-black px-4 py-2 font-black text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          Back to feed
        </button>

        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-block bg-[#FFE600] border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
            Campus Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black">
            Post an Item for Sale
          </h1>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-1">
            Fill in the details below to notify students in your hostel blocks.
          </p>
        </div>

        {/* Main Form Card with stark 4px black border and 8px hard shadow */}
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
              <div className="bg-[#FF5D8F] text-black border-2 border-black p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 stroke-[2.5] flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label
                htmlFor="item-title"
                className="block text-xs font-black uppercase tracking-wider text-black mb-2"
              >
                1. Item Title <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="item-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Engineering Mathematics — B.S. Grewal (8th Ed)"
                  className="w-full bg-white border-2 border-black rounded-none px-4 py-3.5 text-black font-bold placeholder-gray-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="item-desc"
                className="block text-xs font-black uppercase tracking-wider text-black mb-2"
              >
                2. Detailed Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="item-desc"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, reasons for selling, what's included in the deal..."
                className="w-full bg-white border-2 border-black rounded-none px-4 py-3.5 text-black font-bold placeholder-gray-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Category and Condition 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="item-category"
                  className="block text-xs font-black uppercase tracking-wider text-black mb-2"
                >
                  3. Category <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    id="item-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full bg-white border-2 border-black rounded-none px-4 py-3.5 text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none appearance-none cursor-pointer transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="font-bold">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 font-black text-black">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="item-condition"
                  className="block text-xs font-black uppercase tracking-wider text-black mb-2"
                >
                  4. Condition <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    id="item-condition"
                    value={condition}
                    onChange={(e) =>
                      setCondition(e.target.value as ItemCondition)
                    }
                    className="w-full bg-white border-2 border-black rounded-none px-4 py-3.5 text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none appearance-none cursor-pointer transition-all"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c} className="font-bold">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 font-black text-black">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label
                htmlFor="item-price"
                className="block text-xs font-black uppercase tracking-wider text-black mb-2"
              >
                5. Price (INR ₹) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-black text-xl text-black">
                  ₹
                </span>
                <input
                  id="item-price"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  className="w-full bg-white border-2 border-black rounded-none pl-10 pr-4 py-3.5 text-black font-black text-lg placeholder-gray-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* File Upload with Preview */}
            <div>
              <label
                htmlFor="item-image-file"
                className="block text-xs font-black uppercase tracking-wider text-black mb-2"
              >
                6. Product Photo (Optional)
              </label>

              {/* Visual Preview Box */}
              {previewUrl && (
                <div className="relative mb-4 w-fit border-4 border-black bg-[#FFE600] p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative w-44 h-44 border-2 border-black overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Item preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 p-1.5 bg-[#FF5D8F] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                  </button>
                  {imageFile && (
                    <p className="text-[11px] font-black uppercase text-black mt-1.5 truncate max-w-[176px]">
                      {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>
              )}

              {/* Actual hidden file input */}
              <input
                ref={fileInputRef}
                id="item-image-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Neo-brutalist upload button / drop area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-3 border-dashed border-black bg-[#FFFBEA] hover:bg-[#FFE600] p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group select-none"
              >
                <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-3 group-hover:bg-black group-hover:text-[#FFE600] transition-colors">
                  <Upload className="w-6 h-6 stroke-[2.5]" />
                </div>
                <p className="text-sm font-black uppercase tracking-wider text-black">
                  {imageFile ? "Click to change photo" : "Click to select a photo from device"}
                </p>
                <p className="text-xs font-bold text-gray-700 mt-1 uppercase">
                  Supports PNG, JPG, WEBP (Max 5MB)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFE600] hover:bg-[#FFD000] text-black font-black text-lg uppercase tracking-wider py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{uploadProgress ? "Uploading photo…" : "Publishing listing…"}</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 stroke-[3]" />
                  Publish Item Listing
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
