"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";
import { MOCK_PROFILES, MOCK_ITEMS, MOCK_CONVERSATIONS } from "@/lib/mock-data";
import type { Profile, Item, Conversation } from "@/lib/types";
import {
  User,
  Building,
  Phone,
  Save,
  Package,
  MessageSquare,
  IndianRupee,
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";

/* ── colour palette for listing cards ── */
const CARD_COLORS = [
  "bg-[#ffde59]", // yellow
  "bg-[#ff66c4]", // pink
  "bg-[#00ffff]", // cyan
  "bg-[#00F5A0]", // green
  "bg-[#FF5D8F]", // rose
  "bg-[#c4b5fd]", // purple
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [myConversations, setMyConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editHostel, setEditHostel] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Mock fallback
          setProfile(MOCK_PROFILES[0]);
          setMyItems(MOCK_ITEMS.filter((i) => i.seller_id === MOCK_PROFILES[0].id));
          setMyConversations(MOCK_CONVERSATIONS);
          setEditName(MOCK_PROFILES[0].name);
          setEditHostel(MOCK_PROFILES[0].hostel_block);
          setEditPhone(MOCK_PROFILES[0].phone);
          setLoading(false);
          return;
        }

        // Fetch profile
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (prof) {
          setProfile(prof as Profile);
          setEditName(prof.name);
          setEditHostel(prof.hostel_block);
          setEditPhone(prof.phone);
        }

        // My items
        const { data: items } = await supabase
          .from("items")
          .select("*, seller:profiles(*)")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        setMyItems((items as Item[]) ?? []);

        // My conversations
        const { data: convs } = await supabase
          .from("conversations")
          .select("*, item:items(*), buyer:profiles!conversations_buyer_id_fkey(*), seller:profiles!conversations_seller_id_fkey(*)")
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order("updated_at", { ascending: false });

        setMyConversations((convs as unknown as Conversation[]) ?? []);
      } catch {
        setProfile(MOCK_PROFILES[0]);
        setMyItems(MOCK_ITEMS.filter((i) => i.seller_id === MOCK_PROFILES[0].id));
        setMyConversations(MOCK_CONVERSATIONS);
        setEditName(MOCK_PROFILES[0].name);
        setEditHostel(MOCK_PROFILES[0].hostel_block);
        setEditPhone(MOCK_PROFILES[0].phone);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          name: editName,
          hostel_block: editHostel,
          phone: editPhone,
        })
        .eq("id", profile.id);

      setProfile({
        ...profile,
        name: editName,
        hostel_block: editHostel,
        phone: editPhone,
      });
      setEditing(false);
    } catch {
      // Still update locally for demo
      setProfile({
        ...profile,
        name: editName,
        hostel_block: editHostel,
        phone: editPhone,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container max-w-5xl">
          <div className="neo-card p-8 animate-pulse h-48 bg-[#ff66c4]" />
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="neo-card p-8 animate-pulse h-64 bg-[#ffde59]" />
            <div className="neo-card p-8 animate-pulse h-64 bg-white" />
          </div>
        </main>
      </>
    );
  }

  if (!profile) return null;

  const displayName = profile.name || "Student";
  const initials = displayName[0]?.toUpperCase() ?? "?";

  return (
    <>
      <Navbar />
      <main className="page-container max-w-5xl">
        <div className="space-y-8">

          {/* ═══════════════════════════════════════════════
              SECTION 1 — Striking Top Profile Card
              ═══════════════════════════════════════════════ */}
          <section className="relative">
            {/* Orange background "drop" */}
            <div className="absolute inset-0 bg-[#ff8c42] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-2 translate-y-2" />
            {/* Pink foreground card */}
            <div className="relative bg-[#ff66c4] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
              {/* Top row: Avatar + Name + Edit Button */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-5">
                  {/* Big purple circle avatar */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#9333ea] border-4 border-black flex items-center justify-center text-white font-black text-5xl md:text-6xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black leading-none">
                      {displayName}
                    </h1>
                    <p className="text-sm md:text-base font-bold text-black/80 mt-1 uppercase tracking-wide">
                      VERIFIED STUDENT • PONDICHERRY UNIVERSITY 🎓 (Kalapet 605014)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="neo-btn bg-[#FFE600] hover:bg-[#FFDE00] text-sm md:text-base flex-shrink-0"
                >
                  Edit Profile ✏️
                </button>
              </div>

              {/* Detail cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Name card — yellow */}
                <div className="bg-[#ffde59] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
                  <span className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 stroke-[3]" />
                    👤 NAME
                  </span>
                  <p className="text-xl md:text-2xl font-black text-black mt-1 truncate">
                    {profile.name || "—"}
                  </p>
                </div>
                {/* Hostel card — cyan */}
                <div className="bg-[#00ffff] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
                  <span className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 stroke-[3]" />
                    🏢 HOSTEL
                  </span>
                  <p className="text-xl md:text-2xl font-black text-black mt-1 truncate">
                    {profile.hostel_block || "—"}
                  </p>
                </div>
                {/* Phone card — orange */}
                <div className="bg-[#ffa07a] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
                  <span className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 stroke-[3]" />
                    📞 PHONE
                  </span>
                  <p className="text-xl md:text-2xl font-black text-black mt-1 truncate">
                    {profile.phone ? `+91 ${profile.phone}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              SECTION 2 — Listings + Conversations Grid
              ═══════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Left: My Listings (3/5 width) ── */}
            <div className="lg:col-span-3 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                  <Package className="w-7 h-7 stroke-[2.5]" />
                  📦 MY LISTINGS
                </h2>
                <Link
                  href="/items/new"
                  className="neo-btn bg-[#00F5A0] hover:bg-[#00DF90] text-sm"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Post New Item
                </Link>
              </div>

              {myItems.length === 0 ? (
                <div className="neo-card p-10 text-center bg-[#ffde59]">
                  <Package className="w-12 h-12 text-black/40 mx-auto mb-3 stroke-[2.5]" />
                  <p className="font-black text-lg text-black uppercase">
                    No Listings Yet! 📦
                  </p>
                  <p className="font-bold text-black/60 text-sm mt-1">
                    Start selling your campus stuff
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {myItems.map((item, idx) => {
                    const cardColor = CARD_COLORS[idx % CARD_COLORS.length];
                    const statusBadge =
                      item.status === "Available"
                        ? { text: "AVAILABLE 🟢", bg: "bg-[#00F5A0]" }
                        : item.status === "Reserved"
                          ? { text: "RESERVED 🟡", bg: "bg-[#FFE600]" }
                          : { text: "SOLD 🔴", bg: "bg-[#FF5D8F]" };

                    return (
                      <div
                        key={item.id}
                        className={`${cardColor} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between relative group`}
                      >
                        {/* Status badge */}
                        <div className="flex justify-between items-start mb-3">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 border-2 border-black bg-white overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-black/30">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <span
                            className={`${statusBadge.bg} border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                          >
                            {statusBadge.text}
                          </span>
                        </div>

                        {/* Item info */}
                        <div className="flex-1">
                          <p className="font-black text-base md:text-lg text-black uppercase leading-tight">
                            {item.category}
                          </p>
                          <p className="text-sm font-bold text-black/70 mt-0.5 line-clamp-2">
                            {item.title}
                          </p>
                        </div>

                        {/* Price + actions */}
                        <div className="flex items-end justify-between mt-4">
                          <p className="text-2xl font-black text-black flex items-center">
                            <IndianRupee className="w-5 h-5 stroke-[3]" />
                            {item.price.toLocaleString("en-IN")}
                          </p>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/items/${item.id}`}
                              className="neo-btn bg-white text-xs px-3 py-2"
                            >
                              <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                              Edit
                            </Link>
                            <button className="neo-btn bg-[#FF5D8F] text-xs px-3 py-2">
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Right: My Conversations (2/5 width) ── */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <MessageSquare className="w-7 h-7 stroke-[2.5]" />
                💬 MY CONVERSATIONS
              </h2>

              {myConversations.length === 0 ? (
                <div className="border-4 border-dashed border-black p-8 md:p-10 text-center bg-white">
                  {/* Giant chat bubble icon */}
                  <div className="flex justify-center mb-4">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-black/20"
                    >
                      <path
                        d="M40 8C21.2 8 6 20.8 6 36.4c0 8.8 4.8 16.8 12.4 22L16 72l16-10.4c2.4.4 5.2.8 8 .8 18.8 0 34-12.8 34-28.4S58.8 8 40 8z"
                        fill="currentColor"
                        stroke="black"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <p className="font-black text-xl text-black uppercase">
                    NO CONVERSATIONS YET! 💬
                  </p>
                  <p className="font-bold text-black/60 text-sm mt-2">
                    • Let&apos;s get trading!
                  </p>
                  <Link
                    href="/"
                    className="neo-btn-primary mt-5 text-sm inline-flex"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myConversations.map((conv) => {
                    const other =
                      profile.id === conv.buyer_id ? conv.seller : conv.buyer;
                    return (
                      <Link
                        key={conv.id}
                        href={`/chat/${conv.id}`}
                        className="neo-card-hover p-4 flex items-center gap-4 bg-white"
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-[#9333ea] border-3 border-black flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {(other?.name?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-black text-sm uppercase truncate">
                            {other?.name ?? "Unknown"}
                          </p>
                          <p className="text-xs font-bold text-black/50 truncate">
                            Re: {conv.item?.title ?? "Item"}
                          </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-black/40 flex-shrink-0 stroke-[2.5]" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════
          MODAL — Edit Profile (Neo-Brutalist)
          ═══════════════════════════════════════════════ */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditing(false)}
          />
          {/* Modal card */}
          <div className="relative w-full max-w-lg mx-4">
            {/* Shadow layer */}
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
            <div className="relative bg-[#FFE600] border-4 border-black p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black uppercase text-black">
                  ✏️ Edit Profile
                </h3>
                <button
                  onClick={() => setEditing(false)}
                  className="w-10 h-10 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black mb-2">
                    <User className="w-4 h-4 stroke-[2.5]" />
                    👤 Name
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="neo-input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black mb-2">
                    <Building className="w-4 h-4 stroke-[2.5]" />
                    🏢 Hostel Block
                  </label>
                  <input
                    value={editHostel}
                    onChange={(e) => setEditHostel(e.target.value)}
                    className="neo-input"
                    placeholder="e.g. Birsa Munda Hostel — Block A"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black mb-2">
                    <Phone className="w-4 h-4 stroke-[2.5]" />
                    📞 Phone
                  </label>
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="neo-input"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="neo-btn bg-[#00F5A0] hover:bg-[#00DF90] flex-1"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 stroke-[2.5]" />
                  )}
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="neo-btn bg-white flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
