"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";

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

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container max-w-4xl">
          <div className="glass-card p-8 animate-pulse h-48" />
        </main>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <main className="page-container max-w-4xl">
        <div className="animate-in space-y-8">
          {/* Profile Card */}
          <div className="glass-card p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl shadow-glow">
                  {(profile.name?.[0] ?? "?").toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    {profile.name || "Your Profile"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your account and listings
                  </p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <User className="w-4 h-4" /> Name
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Building className="w-4 h-4" /> Hostel Block
                  </label>
                  <input
                    value={editHostel}
                    onChange={(e) => setEditHostel(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Phone className="w-4 h-4" /> Phone
                  </label>
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: User, label: "Name", value: profile.name || "—" },
                  { icon: Building, label: "Hostel", value: profile.hostel_block || "—" },
                  { icon: Phone, label: "Phone", value: profile.phone || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Listings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-heading text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-400" />
                My Listings
              </h2>
              <Link href="/items/new" className="btn-secondary text-sm">
                Post New Item
              </Link>
            </div>

            {myItems.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Package className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  You haven&apos;t listed anything yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/items/${item.id}`}
                    className="glass-card-hover p-4 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />
                          {item.price.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={
                            item.status === "Available"
                              ? "text-emerald-400"
                              : item.status === "Reserved"
                                ? "text-amber-400"
                                : "text-red-400"
                          }
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* My Conversations */}
          <div>
            <h2 className="section-heading text-xl flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-brand-400" />
              My Conversations
            </h2>

            {myConversations.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myConversations.map((conv) => {
                  const other =
                    profile.id === conv.buyer_id ? conv.seller : conv.buyer;
                  return (
                    <Link
                      key={conv.id}
                      href={`/chat/${conv.id}`}
                      className="glass-card-hover p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500/60 to-brand-700/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(other?.name?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                          {other?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Re: {conv.item?.title ?? "Item"}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
