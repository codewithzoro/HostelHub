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
  Phone,
  MessageSquare,
  IndianRupee,
  BookOpen,
  Cpu,
  ShoppingBag,
  Bike,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Books: BookOpen,
  Electronics: Cpu,
  Essentials: ShoppingBag,
  Vehicles: Bike,
};

const CATEGORY_STYLES: Record<string, string> = {
  Books: "bg-[#00D2FF] text-black",
  Electronics: "bg-[#A855F7] text-white",
  Essentials: "bg-[#00F5A0] text-black",
  Vehicles: "bg-[#FF7A00] text-black",
};

const STATUS_OPTIONS: ItemStatus[] = ["Available", "Reserved", "Sold"];

const STATUS_ACTIVE_STYLES: Record<ItemStatus, string> = {
  Available: "bg-[#00F5A0] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
  Reserved: "bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
  Sold: "bg-[#FF5D8F] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
};

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
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse h-96" />
        </main>
      </>
    );
  }

  if (!item) return null;

  const CategoryIcon = CATEGORY_ICONS[item.category] ?? ShoppingBag;
  const categoryStyle = CATEGORY_STYLES[item.category] ?? "bg-white text-black";

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-8 bg-white border-2 border-black px-4 py-2 font-black text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          Back to marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Item Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${categoryStyle}`}
                >
                  <CategoryIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                  {item.category}
                </span>

                <span className="inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#00F5A0] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {item.status}
                </span>

                <span className="inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Condition: {item.condition}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black leading-tight mb-4">
                {item.title}
              </h1>

              {/* Price Banner */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1 bg-[#FFE600] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <IndianRupee className="w-6 h-6 stroke-[3] text-black" />
                  <span className="text-3xl sm:text-4xl font-black text-black">
                    {item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Product Photo */}
              {item.image_url && (
                <div className="relative w-full h-72 sm:h-96 mb-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-[#FFFDEB]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description Section */}
              <div className="border-t-4 border-black pt-6 mt-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-black/60 mb-2">
                  Seller Description
                </h2>
                <p className="text-base font-bold text-black leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t-2 border-black text-xs font-black uppercase text-black/70">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                  Listed on {new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Owner: Status Toggle Controls */}
            {isOwner && (
              <div className="bg-[#FFE600] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-sm font-black uppercase tracking-wider text-black mb-3">
                  Manage Listing Status (Seller Controls)
                </h2>
                <div className="flex flex-wrap gap-3">
                  {STATUS_OPTIONS.map((s) => {
                    const isSelected = item.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={statusUpdating}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                          isSelected
                            ? STATUS_ACTIVE_STYLES[s]
                            : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        }`}
                      >
                        Set as {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info Card */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xs font-black uppercase tracking-widest text-black/60 mb-4">
                Seller Information
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {(item.seller?.name?.[0] ?? "?").toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-lg text-black uppercase leading-tight">
                    {item.seller?.name ?? "Campus Student"}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-black uppercase text-emerald-700 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />
                    Hostel Verified
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t-2 border-black text-xs font-black uppercase">
                <div className="flex items-center gap-2 bg-[#f4f4f0] border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <MapPin className="w-4 h-4 stroke-[2.5]" />
                  <span>Hostel: {item.seller?.hostel_block || "Campus"}</span>
                </div>
                {item.seller?.phone && (
                  <div className="flex items-center gap-2 bg-[#f4f4f0] border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Phone className="w-4 h-4 stroke-[2.5]" />
                    <span>Phone: {item.seller.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Seller CTA Button */}
            {!isOwner && (
              <button
                onClick={handleMessageSeller}
                disabled={chatLoading}
                className="w-full bg-[#FFE600] hover:bg-[#FFD000] text-black font-black text-lg uppercase tracking-wider py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {chatLoading ? (
                  <>
                    <span className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Opening Chat…</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 stroke-[3]" />
                    Message & Bargain
                  </>
                )}
              </button>
            )}

            {/* Campus Safety Notice */}
            <div className="bg-[#FFFDEB] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black mb-1.5">
                <ShieldAlert className="w-4 h-4 stroke-[3]" />
                Hostel Safety Rule
              </div>
              <p className="text-xs font-bold text-gray-800 leading-relaxed uppercase">
                Always inspect items in person at a hostel mess or campus common area before transferring money.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
