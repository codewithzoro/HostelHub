"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

const CATEGORIES: ItemCategory[] = ["Books", "Electronics", "Essentials", "Vehicles"];
const CONDITIONS: ItemCondition[] = ["New", "Like New", "Good", "Fair", "Poor"];

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("Books");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("Good");
  const [imageUrl, setImageUrl] = useState("");

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

      const { error: insertError } = await supabase.from("items").insert({
        seller_id: user.id,
        title,
        description,
        category,
        price: parseFloat(price),
        condition,
        image_url: imageUrl || null,
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        router.push("/");
      }
    } catch {
      setError("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-container max-w-2xl">
        <div className="animate-in">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="btn-ghost text-sm mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="section-heading">Sell an Item</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                List something for your campus neighbors
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="item-title" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Type className="w-4 h-4" /> Title
                </label>
                <input
                  id="item-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Engineering Mathematics — B.S. Grewal"
                  className="glass-input"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="item-desc" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <AlignLeft className="w-4 h-4" /> Description
                </label>
                <textarea
                  id="item-desc"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the item — condition details, why you're selling, etc."
                  className="glass-input resize-none"
                />
              </div>

              {/* Category + Condition row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="item-category" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Tag className="w-4 h-4" /> Category
                  </label>
                  <select
                    id="item-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="glass-select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-surface-50">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="item-condition" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Layers className="w-4 h-4" /> Condition
                  </label>
                  <select
                    id="item-condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="glass-select"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c} className="bg-surface-50">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="item-price" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <IndianRupee className="w-4 h-4" /> Price (₹)
                </label>
                <input
                  id="item-price"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="500"
                  className="glass-input"
                />
              </div>

              {/* Image URL (optional) */}
              <div>
                <label htmlFor="item-image" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <ImagePlus className="w-4 h-4" /> Image URL
                  <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <input
                  id="item-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="glass-input"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3.5"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    Publish Listing
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
