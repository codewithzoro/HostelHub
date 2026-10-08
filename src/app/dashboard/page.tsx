"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";
import { MOCK_PROFILES, MOCK_ITEMS } from "@/lib/mock-data";
import type { Item, Profile, ItemCategory, ItemStatus } from "@/lib/types";
import {
  Package,
  Settings,
  CheckCircle,
  ExternalLink,
  Plus,
  Phone,
  MessageCircle,
  Tag,
  IndianRupee,
  Clock,
  MapPin,
  AlertCircle,
  Check,
  Save,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Cpu,
  BookOpen,
  Bike,
  Building,
  User,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Books: BookOpen,
  Electronics: Cpu,
  Essentials: ShoppingBag,
  Vehicles: Bike,
};

const CATEGORY_BADGES: Record<string, string> = {
  Books: "bg-[#00D2FF] text-black",
  Electronics: "bg-[#A855F7] text-white",
  Essentials: "bg-[#00F5A0] text-black",
  Vehicles: "bg-[#FF7A00] text-black",
};

function formatTimeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return "Recently";
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"listings" | "settings">("listings");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Status update states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Settings form states
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [hostelBlock, setHostelBlock] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState<string | null>(null);
  const [settingsErrorAlert, setSettingsErrorAlert] = useState<string | null>(null);

  // Listings filter
  const [listingFilter, setListingFilter] = useState<"All" | "Available" | "Sold">("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Fallback to mock demo data
          setIsDemoUser(true);
          const demoProfile = MOCK_PROFILES[0];
          setProfile(demoProfile);
          setWhatsappNumber(demoProfile.phone || "");
          setUserName(demoProfile.name || "");
          setHostelBlock(demoProfile.hostel_block || "");

          // Load demo items for this seller
          const demoItems = MOCK_ITEMS.filter((i) => i.seller_id === demoProfile.id);
          setItems(demoItems);
          setLoading(false);
          return;
        }

        // Fetch authenticated user's profile
        const { data: profData, error: profError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profError || !profData) {
          // If profile row missing, default to empty
          const fallbackProf: Profile = {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
            hostel_block: "",
            phone: "",
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(fallbackProf);
          setWhatsappNumber("");
          setUserName(fallbackProf.name);
          setHostelBlock("");
        } else {
          setProfile(profData as Profile);
          setWhatsappNumber(profData.phone || "");
          setUserName(profData.name || "");
          setHostelBlock(profData.hostel_block || "");
        }

        // Fetch user's listings from Supabase items table
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*, seller:profiles(*)")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (!itemsError && itemsData) {
          setItems(itemsData as Item[]);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        // Fallback for seamless developer preview
        setIsDemoUser(true);
        const demoProfile = MOCK_PROFILES[0];
        setProfile(demoProfile);
        setWhatsappNumber(demoProfile.phone || "");
        setUserName(demoProfile.name || "");
        setHostelBlock(demoProfile.hostel_block || "");
        setItems(MOCK_ITEMS.filter((i) => i.seller_id === demoProfile.id));
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Quick auto-dismiss notification toast
  const triggerNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  // 'Mark as Sold' handler
  const handleMarkAsSold = async (item: Item) => {
    const newStatus: ItemStatus = "Sold";
    setUpdatingId(item.id);

    try {
      if (!isDemoUser && profile) {
        const supabase = createClient();
        const { error } = await supabase
          .from("items")
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (error) {
          throw error;
        }
      }

      // Optimistic / Local update
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
      triggerNotification(`Listing "${item.title}" successfully marked as SOLD!`);
    } catch (err: unknown) {
      console.error("Failed to mark item as sold:", err);
      // Still update locally for user feedback
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
      triggerNotification(`Listing "${item.title}" marked as SOLD.`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Re-list toggle handler (for user convenience)
  const handleMarkAsAvailable = async (item: Item) => {
    const newStatus: ItemStatus = "Available";
    setUpdatingId(item.id);

    try {
      if (!isDemoUser && profile) {
        const supabase = createClient();
        const { error } = await supabase
          .from("items")
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (error) throw error;
      }

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
      triggerNotification(`Listing "${item.title}" is now back to AVAILABLE!`);
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
      triggerNotification(`Listing "${item.title}" is now AVAILABLE.`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete listing handler
  const handleDeleteItem = async (itemId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setUpdatingId(itemId);
    try {
      if (!isDemoUser && profile) {
        const supabase = createClient();
        const { error } = await supabase.from("items").delete().eq("id", itemId);
        if (error) throw error;
      }

      setItems((prev) => prev.filter((i) => i.id !== itemId));
      triggerNotification(`Item "${title}" deleted.`);
    } catch (err) {
      console.error("Delete failed:", err);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      triggerNotification(`Item "${title}" removed.`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Save Settings handler (WhatsApp Number & Profile)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSavingSettings(true);
    setSettingsSavedAlert(null);
    setSettingsErrorAlert(null);

    // Sanitize WhatsApp number (strip whitespace, dashes)
    const cleanPhone = whatsappNumber.trim().replace(/[^\d+]/g, "");

    try {
      if (!isDemoUser) {
        const supabase = createClient();
        const { error } = await supabase
          .from("profiles")
          .update({
            phone: cleanPhone,
            name: userName.trim() || profile.name,
            hostel_block: hostelBlock.trim() || profile.hostel_block,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) throw error;
      }

      // Update state locally
      setProfile({
        ...profile,
        phone: cleanPhone,
        name: userName.trim() || profile.name,
        hostel_block: hostelBlock.trim() || profile.hostel_block,
      });

      setSettingsSavedAlert("WhatsApp number and settings saved successfully!");
      setTimeout(() => setSettingsSavedAlert(null), 5000);
    } catch (err: unknown) {
      console.error("Settings save error:", err);
      const msg = err instanceof Error ? err.message : "Failed to update WhatsApp number.";
      setSettingsErrorAlert(msg);
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered listings
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter =
        listingFilter === "All"
          ? true
          : listingFilter === "Available"
          ? item.status === "Available" || item.status === "Reserved"
          : item.status === "Sold";

      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [items, listingFilter, searchQuery]);

  // Statistics
  const totalCount = items.length;
  const availableCount = items.filter((i) => i.status === "Available").length;
  const soldCount = items.filter((i) => i.status === "Sold").length;

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Demo Mode Notice Banner */}
        {isDemoUser && (
          <div className="mb-6 bg-[#FFE600] border-4 border-black p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-black text-[#FFE600] font-black text-xs px-2 py-1 uppercase tracking-wider">
                PREVIEW MODE
              </span>
              <p className="font-bold text-sm text-black">
                Viewing demo dashboard as <span className="underline font-black">{profile?.name || "Arjun Mehta"}</span>. Sign in to view and update your live Supabase data.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black hover:bg-neutral-800 transition-all select-none"
            >
              Sign In
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>
        )}

        {/* Global Action Success Toast */}
        {actionSuccessMessage && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce bg-[#00F5A0] border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 max-w-md">
            <CheckCircle className="w-6 h-6 stroke-[3] text-black flex-shrink-0" />
            <p className="font-black text-sm text-black uppercase tracking-tight">
              {actionSuccessMessage}
            </p>
          </div>
        )}

        {/* Header Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-[#FFE600] px-3 py-1 font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                HOSTELHUB DASHBOARD // SELLER HQ
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                {profile?.name ? `${profile.name}'s Dashboard` : "Seller Dashboard"}
              </h1>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-1 flex items-center gap-2">
                <span>Campus Seller</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                  {profile?.hostel_block || "Campus Resident"}
                </span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/items/new"
                className="inline-flex items-center gap-2 bg-[#FFE600] text-black font-black uppercase text-sm tracking-wider border-3 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all select-none"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Post New Listing
              </Link>

              <Link
                href={`/profile`}
                className="inline-flex items-center gap-2 bg-white text-black font-black uppercase text-sm tracking-wider border-3 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all select-none"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                Public Profile
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                Total Listed
              </div>
              <div className="text-3xl font-black text-black">
                {loading ? "..." : totalCount}
              </div>
            </div>

            <div className="bg-[#00F5A0] border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black uppercase tracking-wider text-black mb-1">
                Active Listings
              </div>
              <div className="text-3xl font-black text-black">
                {loading ? "..." : availableCount}
              </div>
            </div>

            <div className="bg-[#FF5D8F] border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black uppercase tracking-wider text-black mb-1">
                Marked as Sold
              </div>
              <div className="text-3xl font-black text-black">
                {loading ? "..." : soldCount}
              </div>
            </div>

            <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                WhatsApp Ready
              </div>
              <div className="flex items-center gap-1.5 text-sm font-black text-black mt-2">
                {profile?.phone ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-[#00F5A0] border border-black inline-block" />
                    <span className="truncate">{profile.phone}</span>
                  </>
                ) : (
                  <span className="text-[#FF5D8F]">Not Configured</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls (High Contrast Neo-Brutalist Switcher) */}
        <div className="flex items-center gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab("listings")}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 font-black uppercase text-sm sm:text-base tracking-wider border-3 sm:border-4 border-black transition-all select-none ${
              activeTab === "listings"
                ? "bg-[#FFE600] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <Package className="w-5 h-5 stroke-[2.5]" />
            My Listings
            <span className="bg-black text-white text-xs px-2 py-0.5 rounded-none font-black ml-1">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 font-black uppercase text-sm sm:text-base tracking-wider border-3 sm:border-4 border-black transition-all select-none ${
              activeTab === "settings"
                ? "bg-[#00F5A0] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <Settings className="w-5 h-5 stroke-[2.5]" />
            Settings
            {(!profile?.phone || profile.phone === "") && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5D8F] border border-black animate-pulse" />
            )}
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: MY LISTINGS                                            */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "listings" && (
          <section className="space-y-6">
            {/* Filter and Search Sub-bar */}
            <div className="bg-white border-3 border-black p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Status pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(["All", "Available", "Sold"] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    onClick={() => setListingFilter(filterOpt)}
                    className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                      listingFilter === filterOpt
                        ? "bg-black text-[#FFE600] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {filterOpt}{" "}
                    {filterOpt === "All"
                      ? `(${totalCount})`
                      : filterOpt === "Available"
                      ? `(${availableCount})`
                      : `(${soldCount})`}
                  </button>
                ))}
              </div>

              {/* Search filter input */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="FILTER MY LISTINGS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f4f4f0] border-2 border-black px-3 py-1.5 text-xs font-black uppercase placeholder-gray-500 focus:bg-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 border-2 border-black w-1/3 mb-4" />
                    <div className="h-8 bg-gray-200 border-2 border-black w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 w-full mb-2" />
                    <div className="h-4 bg-gray-200 w-1/2 mb-6" />
                    <div className="h-10 bg-gray-200 border-2 border-black w-full" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              /* Empty State */
              <div className="bg-white border-4 border-black p-10 sm:p-16 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-[#FFE600] border-3 border-black mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Package className="w-8 h-8 stroke-[2.5] text-black" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
                  No Items Found
                </h3>
                <p className="text-gray-700 text-sm font-bold uppercase tracking-wider max-w-md mx-auto mb-6">
                  {searchQuery || listingFilter !== "All"
                    ? "Try clearing your search query or switching your status filter above."
                    : "You haven't listed any items for campus sale yet. Start decluttering your hostel room!"}
                </p>
                <Link
                  href="/items/new"
                  className="inline-flex items-center gap-2 bg-[#FFE600] text-black font-black uppercase text-sm tracking-wider border-3 border-black px-6 py-3.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              /* Item Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => {
                  const CategoryIcon = CATEGORY_ICONS[item.category] ?? ShoppingBag;
                  const categoryBadge = CATEGORY_BADGES[item.category] ?? "bg-white text-black";
                  const isSold = item.status === "Sold";
                  const isUpdating = updatingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between transition-all ${
                        isSold ? "bg-neutral-50 border-neutral-800 opacity-90" : ""
                      }`}
                    >
                      <div>
                        {/* Top Header: Category & Status Badge */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${categoryBadge}`}
                          >
                            <CategoryIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                            {item.category}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                              isSold
                                ? "bg-[#FF5D8F] text-black"
                                : item.status === "Reserved"
                                ? "bg-[#FFE600] text-black"
                                : "bg-[#00F5A0] text-black"
                            }`}
                          >
                            {isSold && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            {item.status}
                          </span>
                        </div>

                        {/* Image Preview (if present) */}
                        {item.image_url && (
                          <div className="relative w-full h-40 mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-[#FFFDEB]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className={`w-full h-full object-cover ${
                                isSold ? "grayscale contrast-125" : ""
                              }`}
                            />
                            {isSold && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-[#FF5D8F] text-black font-black text-xl uppercase px-4 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-6deg]">
                                  SOLD OUT
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Title and Price */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={`text-xl font-black uppercase tracking-tight leading-snug line-clamp-2 ${
                              isSold ? "line-through text-gray-700" : "text-black"
                            }`}
                          >
                            {item.title}
                          </h3>

                          <div className="inline-flex items-center gap-0.5 bg-[#FFE600] border-2 border-black px-2.5 py-1 text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                            <IndianRupee className="w-3.5 h-3.5 stroke-[3]" />
                            {item.price.toLocaleString("en-IN")}
                          </div>
                        </div>

                        {/* Description Preview */}
                        <p className="text-xs font-semibold text-gray-700 leading-relaxed mb-4 line-clamp-2">
                          {item.description || "No description provided."}
                        </p>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-gray-600 mb-6">
                          <span className="bg-[#f4f4f0] border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            Condition: {item.condition}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 stroke-[2.5]" />
                            {formatTimeAgo(item.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar with 'Mark as Sold' Button */}
                      <div className="pt-4 border-t-2 border-black flex flex-wrap items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {!isSold ? (
                            <button
                              onClick={() => handleMarkAsSold(item)}
                              disabled={isUpdating}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#00F5A0] hover:bg-[#00DF90] text-black font-black uppercase text-xs tracking-wider border-2 border-black px-4 py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 select-none"
                            >
                              {isUpdating ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4 stroke-[3]" />
                              )}
                              Mark as Sold
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsAvailable(item)}
                              disabled={isUpdating}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 text-black font-black uppercase text-xs tracking-wider border-2 border-black px-4 py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 select-none"
                            >
                              {isUpdating ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                              )}
                              Re-list Available
                            </button>
                          )}

                          <Link
                            href={`/items/${item.id}`}
                            className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-black font-black uppercase text-xs tracking-wider border-2 border-black p-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all select-none"
                            title="View public item page"
                          >
                            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                          </Link>

                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center bg-[#FF5D8F] hover:bg-[#FF457D] text-black font-black uppercase text-xs tracking-wider border-2 border-black p-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all select-none"
                            title="Delete this listing"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: SETTINGS (WHATSAPP NUMBER UPDATE)                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <section className="max-w-3xl mx-auto space-y-8">
            {/* Feedback Alerts */}
            {settingsSavedAlert && (
              <div className="bg-[#00F5A0] text-black border-4 border-black p-4 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <CheckCircle className="w-6 h-6 stroke-[3] flex-shrink-0" />
                <span className="text-sm uppercase tracking-tight">{settingsSavedAlert}</span>
              </div>
            )}

            {settingsErrorAlert && (
              <div className="bg-[#FF5D8F] text-black border-4 border-black p-4 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <AlertCircle className="w-6 h-6 stroke-[3] flex-shrink-0" />
                <span className="text-sm uppercase tracking-tight">{settingsErrorAlert}</span>
              </div>
            )}

            {/* Main Settings Card */}
            <div className="bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="inline-flex items-center gap-2 bg-[#00F5A0] border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                COMMUNICATION PREFERENCES
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mb-2">
                WhatsApp & Contact Details
              </h2>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide leading-relaxed mb-8">
                Campus buyers use your WhatsApp number to quickly chat, request photos, and arrange hostel room meetups. Keep this updated to close deals fast.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* WhatsApp Number Field */}
                <div>
                  <label
                    htmlFor="whatsapp-input"
                    className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black mb-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 stroke-[3] text-black" />
                      WhatsApp Number <span className="text-red-600">*</span>
                    </span>
                    <span className="text-gray-500 font-bold">10-Digit Mobile Number</span>
                  </label>

                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-[#FFE600] border-2 border-r-0 border-black font-black text-black text-sm select-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      🇮🇳 +91
                    </span>
                    <input
                      id="whatsapp-input"
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border-2 border-black px-4 py-3.5 text-black font-black placeholder-gray-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all text-base tracking-wider"
                    />
                  </div>

                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-2">
                    Enter your active WhatsApp phone number without country code or spaces.
                  </p>
                </div>

                {/* Live WhatsApp Link Simulator */}
                {whatsappNumber.trim().length >= 10 && (
                  <div className="bg-[#FFFDEB] border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-[#00A884]" />
                        Buyer WhatsApp Click-to-Chat Preview
                      </span>
                      <span className="bg-[#00F5A0] text-black text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                        Active Link
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 truncate font-mono">
                      https://wa.me/91{whatsappNumber.replace(/[^\d]/g, "")}
                    </p>
                    <a
                      href={`https://wa.me/91${whatsappNumber.replace(/[^\d]/g, "")}?text=Hi%2C%20I%20saw%20your%20listing%20on%20HostelHub!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black hover:underline mt-2"
                    >
                      Test WhatsApp Link in new tab
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                    </a>
                  </div>
                )}

                {/* Additional Seller Info (Hostel Block & Display Name) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label
                      htmlFor="user-name"
                      className="block text-xs font-black uppercase tracking-wider text-black mb-2"
                    >
                      Seller Display Name
                    </label>
                    <div className="relative">
                      <input
                        id="user-name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Arjun Mehta"
                        className="w-full bg-white border-2 border-black px-4 py-3 text-black font-black placeholder-gray-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="hostel-block"
                      className="block text-xs font-black uppercase tracking-wider text-black mb-2"
                    >
                      Hostel Block / Wing
                    </label>
                    <div className="relative">
                      <input
                        id="hostel-block"
                        type="text"
                        value={hostelBlock}
                        onChange={(e) => setHostelBlock(e.target.value)}
                        placeholder="e.g. Block A - Narmada"
                        className="w-full bg-white border-2 border-black px-4 py-3 text-black font-black placeholder-gray-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-[#FFDE00] text-black font-black uppercase text-sm sm:text-base tracking-wider border-3 sm:border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 select-none cursor-pointer"
                  >
                    {savingSettings ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin stroke-[2.5]" />
                        Updating WhatsApp Number...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 stroke-[2.5]" />
                        Save WhatsApp Number
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Neo-Brutalist Safety & Privacy Guide */}
            <div className="bg-[#FFE600] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  !
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase tracking-tight text-black mb-1">
                    Campus Safety & WhatsApp Dealing Policy
                  </h4>
                  <ul className="text-xs font-bold text-black uppercase space-y-2 mt-3 list-disc list-inside">
                    <li>Only share UPI QR or cash payments after the buyer inspects the item in person.</li>
                    <li>Arrange handoffs in well-lit hostel common rooms, mess halls, or campus gates.</li>
                    <li>HostelHub will never ask for your UPI PIN, OTPs, or password via WhatsApp.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
