"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import SearchFilter from "@/components/SearchFilter";
import { createClient } from "@/lib/supabase";
import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item, ItemCategory } from "@/lib/types";
import { PackageSearch, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ItemCategory | "All">("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("items")
          .select("*, seller:profiles(*)")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setItems(MOCK_ITEMS);
        } else {
          setItems(data as Item[]);
        }
      } catch {
        setItems(MOCK_ITEMS);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  return (
    <>
      <Navbar />
      <main className="page-container">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Your Campus Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-4">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Buy & Sell on
            </span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-accent-cyan bg-clip-text text-transparent">
              Campus, Instantly
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            No more noisy WhatsApp groups. Browse listings from your hostel
            neighbors, bargain in real time, and close deals faster.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-6 sm:gap-10 text-sm">
            {[
              { icon: PackageSearch, label: "Items Listed", value: items.length },
              { icon: TrendingUp, label: "Avg Response", value: "< 2 min" },
              { icon: ShieldCheck, label: "Verified Sellers", value: "100%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-gray-400">
                <Icon className="w-4 h-4 text-brand-400" />
                <span className="font-semibold text-white">{value}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Search & Filters */}
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-300">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "item" : "items"}
            {category !== "All" && (
              <span>
                {" "}
                in <span className="text-brand-400">{category}</span>
              </span>
            )}
          </p>
        </div>

        {/* Item Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-card p-5 h-64 animate-pulse"
              >
                <div className="h-4 bg-white/[0.06] rounded w-1/3 mb-4" />
                <div className="h-5 bg-white/[0.06] rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/[0.06] rounded w-full mb-1" />
                <div className="h-4 bg-white/[0.06] rounded w-2/3 mb-6" />
                <div className="h-6 bg-white/[0.06] rounded w-1/4 mb-4" />
                <div className="mt-auto h-px bg-white/[0.06]" />
                <div className="h-3 bg-white/[0.06] rounded w-1/2 mt-3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-in">
            <PackageSearch className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-600">
          <p>
            Built with ❤️ for campus life &mdash;{" "}
            <span className="text-brand-400 font-medium">HostelHub</span>
          </p>
        </div>
      </footer>
    </>
  );
}
