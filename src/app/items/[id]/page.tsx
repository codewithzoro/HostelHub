"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";
import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item, ItemStatus } from "@/lib/types";
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Phone,
  MessageSquare,
  IndianRupee,
  BookOpen,
  Cpu,
  ShoppingBag,
  Bike,
  ChevronDown,
  Shield,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Books: BookOpen,
  Electronics: Cpu,
  Essentials: ShoppingBag,
  Vehicles: Bike,
};

const STATUS_OPTIONS: ItemStatus[] = ["Available", "Reserved", "Sold"];

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id ?? null);

        // Fetch item
        const { data, error } = await supabase
          .from("items")
          .select("*, seller:profiles(*)")
          .eq("id", itemId)
          .single();

        if (error || !data) {
          // Fallback to mock
          const mock = MOCK_ITEMS.find((i) => i.id === itemId) ?? MOCK_ITEMS[0];
          setItem(mock);
        } else {
          setItem(data as Item);
        }
      } catch {
        const mock = MOCK_ITEMS.find((i) => i.id === itemId) ?? MOCK_ITEMS[0];
        setItem(mock);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [itemId]);

  const isOwner = currentUserId && item && currentUserId === item.seller_id;

  const handleStatusChange = async (newStatus: ItemStatus) => {
    if (!item) return;
    setStatusUpdating(true);
    try {
      const supabase = createClient();
      await supabase.from("items").update({ status: newStatus }).eq("id", item.id);
      setItem({ ...item, status: newStatus });
    } catch {
      // Optimistically update anyway for demo
      setItem({ ...item, status: newStatus });
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!item || !currentUserId) {
      router.push("/auth/login");
      return;
    }
    setChatLoading(true);

    try {
      const supabase = createClient();

      // Check existing conversation
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("item_id", item.id)
        .eq("buyer_id", currentUserId)
        .single();

      if (existing) {
        router.push(`/chat/${existing.id}`);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          item_id: item.id,
          buyer_id: currentUserId,
          seller_id: item.seller_id,
        })
        .select("id")
        .single();

      if (error || !newConv) {
        // Demo fallback: go to mock chat
        router.push(`/chat/mock-conv-1`);
      } else {
        router.push(`/chat/${newConv.id}`);
      }
    } catch {
      router.push(`/chat/mock-conv-1`);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container max-w-4xl">
          <div className="glass-card p-8 animate-pulse">
            <div className="h-6 bg-white/[0.06] rounded w-1/4 mb-4" />
            <div className="h-8 bg-white/[0.06] rounded w-3/4 mb-6" />
            <div className="h-4 bg-white/[0.06] rounded w-full mb-2" />
            <div className="h-4 bg-white/[0.06] rounded w-2/3 mb-8" />
            <div className="h-12 bg-white/[0.06] rounded w-1/3" />
          </div>
        </main>
      </>
    );
  }

  if (!item) return null;

  const CategoryIcon = CATEGORY_ICONS[item.category] ?? ShoppingBag;
  const statusClass =
    item.status === "Available"
      ? "badge-available"
      : item.status === "Reserved"
        ? "badge-reserved"
        : "badge-sold";

  return (
    <>
      <Navbar />
      <main className="page-container max-w-4xl">
        <div className="animate-in">
          <button
            onClick={() => router.back()}
            className="btn-ghost text-sm mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Item header */}
              <div className="glass-card p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {item.category}
                  </span>
                  <span className={statusClass}>{item.status}</span>
                  <span className="text-xs text-gray-600 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                    {item.condition}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-4">
                  {item.title}
                </h1>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <IndianRupee className="w-5 h-5 text-brand-400" />
                  <span className="text-3xl font-display font-extrabold text-white">
                    {item.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-white/[0.06] pt-6">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Description
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/[0.06] text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Owner: Status Toggle */}
              {isOwner && (
                <div className="glass-card p-6">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Manage Listing
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={statusUpdating}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          item.status === s
                            ? s === "Available"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                              : s === "Reserved"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                                : "bg-red-500/15 text-red-400 border-red-500/25"
                            : "bg-white/[0.04] text-gray-400 border-white/[0.08] hover:bg-white/[0.08]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Seller info + CTA */}
            <div className="space-y-6">
              {/* Seller card */}
              <div className="glass-card p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Seller
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg">
                    {(item.seller?.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {item.seller?.name ?? "Unknown Seller"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      Verified Student
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    {item.seller?.hostel_block || "Campus"}
                  </div>
                  {item.seller?.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4 text-gray-600" />
                      {item.seller.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Seller CTA */}
              {!isOwner && (
                <button
                  onClick={handleMessageSeller}
                  disabled={chatLoading}
                  className="btn-primary w-full !py-4 text-base"
                >
                  {chatLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Message Seller
                    </>
                  )}
                </button>
              )}

              {/* Safety tip */}
              <div className="glass-card p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Safety Tip
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Always meet in a common area on campus. Never share personal
                  financial details. Use HostelHub chat for all negotiations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
