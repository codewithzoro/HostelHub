"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import SearchFilter from "@/components/SearchFilter";
import { createClient } from "@/lib/supabase";
import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item, ItemCategory } from "@/lib/types";
import { motion } from "framer-motion";
import {
  PackageSearch,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
  Bike,
  Cpu,
  MapPin,
  Users,
  BadgeCheck,
  Package,
  AlertTriangle,
  FileText,
  Phone,
  MessageCircle,
  Star,
  Clock,
  IndianRupee,
} from "lucide-react";

// ── Animation Variants ──────────────────────────────────────────────────────
const fadeSlideUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeSlideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

// ── How It Works card data ───────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Verified Students Only",
    bg: "bg-[#FFE600]",
    accent: "bg-black",
    accentText: "text-[#FFE600]",
    icon: BadgeCheck,
    description:
      "Every seller and buyer on HostelHub is a registered Pondicherry University student. Zero outsiders, zero scammers — only your campus neighbours.",
    tags: ["PU Student ID", "Email Verified", "Hostel Confirmed"],
  },
  {
    number: "02",
    title: "Hostel-to-Hostel Delivery",
    bg: "bg-[#00F5A0]",
    accent: "bg-black",
    accentText: "text-[#00F5A0]",
    icon: MapPin,
    description:
      "Arrange meetups at Birsa Munda Hostel, Sarojini Naidu Wing, Kasturba Gandhi Block, or the main academic gate — all within walking distance. No courier, no wait.",
    tags: ["Birsa Munda", "Sarojini Naidu", "Kasturba Gandhi"],
  },
  {
    number: "03",
    title: "No Brokerage. No Scams.",
    bg: "bg-[#FF5D8F]",
    accent: "bg-black",
    accentText: "text-[#FF5D8F]",
    icon: ShieldCheck,
    description:
      "HostelHub takes zero commission and zero listing fees. No middlemen, no fake listings. Pay your batchmate directly in cash or UPI — right after inspecting the item.",
    tags: ["₹0 Commission", "Cash / UPI", "Inspect First"],
  },
];

// ── Category quick-nav ────────────────────────────────────────────────────────
const CATEGORY_QUICK = [
  { label: "Electronics", icon: Cpu, color: "bg-[#A855F7] text-white", count: "12 listings" },
  { label: "Books", icon: BookOpen, color: "bg-[#00D2FF] text-black", count: "8 listings" },
  { label: "Vehicles", icon: Bike, color: "bg-[#FF7A00] text-black", count: "5 listings" },
  { label: "Essentials", icon: Package, color: "bg-[#00F5A0] text-black", count: "9 listings" },
];

// ── Marquee text ─────────────────────────────────────────────────────────────
const MARQUEE_TEXT =
  "EXCLUSIVE MARKETPLACE FOR PONDICHERRY UNIVERSITY • KALAPET 605014 • ZERO BROKERAGE • HOSTEL-TO-HOSTEL DEALS • VERIFIED STUDENTS ONLY • ";

// ── Stats row ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: Users, label: "Active Students", value: "1,200+" },
  { icon: Package, label: "Live Listings", value: "340+" },
  { icon: Clock, label: "Avg. Deal Time", value: "< 24 hrs" },
  { icon: IndianRupee, label: "Saved on Brokerage", value: "₹0" },
];

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
    <div className="bg-[#f4f4f0] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1 — ANIMATED HERO                                               */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#00D2FF] border-b-4 border-black overflow-hidden">
        {/* Decorative offset grid squares (neo-brutalist texture) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, black 0, black 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, black 0, black 1px, transparent 1px, transparent 40px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Eyebrow badge */}
          <motion.div
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 bg-[#FFE600] border-2 border-black px-3 py-1.5 font-black text-xs uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current stroke-none" />
            Pondicherry University — Kalapet 605014
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none text-black mb-6 max-w-5xl"
          >
            The Campus
            <br />
            <span className="inline-block bg-black text-[#FFE600] px-3 py-0 leading-tight">
              Marketplace
            </span>
            <br />
            Built for PU.
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="text-base sm:text-xl font-bold text-black/80 max-w-2xl leading-snug mb-10"
          >
            Sell your old textbooks, lab kits, laptops, and two-wheelers directly to
            Birsa Munda, Sarojini Naidu & Kasturba Gandhi hostel students.
            Zero noise. Zero brokerage. Real campus deals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
            className="flex flex-wrap gap-4 mb-14"
          >
            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 bg-black text-[#FFE600] font-black uppercase text-sm tracking-wider border-3 border-black px-7 py-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.25)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all select-none"
            >
              <Zap className="w-5 h-5 fill-current stroke-none" />
              Sell Your Item
            </Link>
            <a
              href="#listings"
              className="inline-flex items-center gap-2 bg-white text-black font-black uppercase text-sm tracking-wider border-3 border-black px-7 py-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all select-none"
            >
              Browse Listings
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {STATS.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                variants={fadeSlideUp}
                custom={0.04}
                className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-black/60">
                    {label}
                  </p>
                  <p className="text-base font-black uppercase text-black leading-tight">
                    {value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom decorative jagged edge */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#f4f4f0] border-t-4 border-black" />
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 — INFINITE MARQUEE BANNER                                    */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <div className="bg-[#FFE600] border-y-4 border-black py-4 overflow-hidden relative z-10">
        <div className="marquee-track select-none">
          {/* Repeat twice to create seamless loop */}
          {[0, 1].map((n) => (
            <div key={n} className="flex items-center gap-0 flex-nowrap">
              {MARQUEE_TEXT.split(" • ").map((chunk, i) => (
                <span key={i} className="flex items-center gap-0">
                  <span className="text-black font-black text-base sm:text-xl uppercase tracking-widest whitespace-nowrap px-4">
                    {chunk}
                  </span>
                  <span className="text-black font-black text-xl flex-shrink-0">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3 — HOW IT WORKS (SCROLL-TRIGGERED)                            */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Section Header */}
        <motion.div
          variants={fadeSlideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-black text-[#FFE600] border-2 border-black px-3 py-1.5 font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] mb-4">
            <Star className="w-3.5 h-3.5 fill-current stroke-none" />
            Why HostelHub Beats WhatsApp Groups
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none max-w-3xl">
            How It Works
          </h2>
        </motion.div>

        {/* 3 cards — stagger in on scroll */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {HOW_IT_WORKS.map(({ number, title, bg, accent, accentText, icon: Icon, description, tags }) => (
            <motion.div
              key={number}
              variants={fadeSlideUp}
              custom={0}
              className={`${bg} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-7 flex flex-col gap-5 group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-150`}
            >
              {/* Number + Icon row */}
              <div className="flex items-center justify-between">
                <span className="text-6xl font-black text-black/20 leading-none select-none">
                  {number}
                </span>
                <div
                  className={`w-14 h-14 ${accent} flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]`}
                >
                  <Icon className={`w-7 h-7 ${accentText} stroke-[2.5]`} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm font-bold text-black/75 leading-relaxed flex-1">
                {description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border border-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4 — CATEGORY QUICK BROWSE (SCROLL-TRIGGERED)                   */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="border-y-4 border-black bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeSlideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FF5D8F] border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
                Browse By Category
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
                What Do You Need?
              </h2>
            </div>
            <a
              href="#listings"
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:underline"
            >
              See all listings
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {CATEGORY_QUICK.map(({ label, icon: Icon, color, count }) => (
              <motion.button
                key={label}
                variants={fadeSlideUp}
                custom={0}
                onClick={() => {
                  setCategory(label as ItemCategory);
                  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`${color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-start gap-4 group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 text-left select-none`}
              >
                <div className="w-12 h-12 bg-black/20 flex items-center justify-center border-2 border-black/30">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xl font-black uppercase tracking-tight leading-tight">
                    {label}
                  </p>
                  <p className="text-xs font-bold uppercase opacity-70 mt-0.5">{count}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 5 — MARKETPLACE LISTINGS (MAIN)                                */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section
        id="listings"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
      >
        {/* Section header */}
        <motion.div
          variants={fadeSlideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00F5A0] border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Package className="w-3.5 h-3.5 stroke-[2.5]" />
              Fresh Campus Drops
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
              Live Listings
            </h2>
          </div>
          <Link
            href="/items/new"
            className="inline-flex items-center gap-2 bg-[#FFE600] text-black font-black uppercase text-sm tracking-wider border-3 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all select-none"
          >
            <Zap className="w-4 h-4 fill-current stroke-none" />
            Post Your Item
          </Link>
        </motion.div>

        {/* Search & Filter */}
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        {/* Results counter */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-black">
          <p className="text-sm font-black uppercase tracking-wider text-black">
            Showing{" "}
            <span className="bg-[#FFE600] border border-black px-1.5 py-0.5">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "Listing" : "Listings"}
            {category !== "All" && (
              <span className="ml-1 text-gray-700">
                in <strong className="text-black uppercase">{category}</strong>
              </span>
            )}
          </p>
        </div>

        {/* Item Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border-4 border-black p-5 h-80 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="h-6 bg-black/10 border border-black mb-3 w-1/3" />
                  <div className="h-40 bg-black/10 border border-black mb-4 w-full" />
                  <div className="h-5 bg-black/10 border border-black mb-2 w-3/4" />
                  <div className="h-4 bg-black/10 border border-black mb-1 w-full" />
                </div>
                <div className="h-8 bg-black/10 border border-black w-1/3 mt-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            className="bg-white border-4 border-black p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <PackageSearch className="w-16 h-16 stroke-[2.5] text-black mx-auto mb-3" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-1">
              No Listings Found
            </h3>
            <p className="text-sm font-bold text-gray-700 uppercase">
              Try a different search or category filter.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((item) => (
              <motion.div key={item.id} variants={fadeSlideUp} custom={0}>
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 6 — TRUST STRIP (SCROLL-TRIGGERED)                             */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section className="bg-black border-y-4 border-black py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {[
              {
                icon: Users,
                stat: "1,200+",
                label: "PU Students Trust Us",
                color: "text-[#FFE600]",
              },
              {
                icon: ShieldCheck,
                stat: "100%",
                label: "Zero Commission, Forever",
                color: "text-[#00F5A0]",
              },
              {
                icon: MessageCircle,
                stat: "< 2 min",
                label: "Average Seller Response",
                color: "text-[#FF5D8F]",
              },
            ].map(({ icon: Icon, stat, label, color }) => (
              <motion.div
                key={label}
                variants={fadeSlideUp}
                custom={0}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-white/10 border-2 border-white/20 flex items-center justify-center mb-2">
                  <Icon className={`w-7 h-7 ${color} stroke-[2.5]`} />
                </div>
                <p className={`text-4xl sm:text-5xl font-black ${color} uppercase`}>{stat}</p>
                <p className="text-sm font-black uppercase tracking-wider text-white/60">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 7 — HEAVY NEO-BRUTALIST FOOTER                                 */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#FFE600] border-t-4 border-black">
        {/* Top content area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand column */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-11 h-11 bg-black text-[#FFE600] flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                <Zap className="w-6 h-6 fill-current stroke-none" />
              </div>
              <span className="text-2xl font-black uppercase text-black tracking-tight">
                Hostel
                <span className="bg-black text-[#FFE600] px-1.5 ml-1">Hub</span>
              </span>
            </div>
            <p className="text-sm font-bold text-black/70 leading-relaxed max-w-xs">
              The only zero-commission, campus-native marketplace for Pondicherry University
              students. Buy. Sell. Graduate. Repeat.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 bg-black text-[#FFE600] border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              Kalapet, Puducherry — 605014
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-5">
              Campus Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#", label: "Campus Trading Guidelines", icon: FileText },
                { href: "#", label: "Report an Issue", icon: AlertTriangle },
                { href: "/items/new", label: "Post a Listing", icon: Package },
                { href: "/dashboard", label: "Seller Dashboard", icon: Users },
                { href: "/auth/login", label: "Sign In / Register", icon: ShieldCheck },
              ].map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-black uppercase text-black hover:underline underline-offset-2 group"
                  >
                    <span className="w-6 h-6 bg-black text-[#FFE600] flex items-center justify-center border border-black flex-shrink-0 group-hover:bg-[#FF5D8F] transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / WhatsApp CTA column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-5">
              Need Help?
            </h4>
            <p className="text-sm font-bold text-black/70 mb-5 leading-relaxed">
              Got a dispute, a suspicious listing, or just want to give feedback on HostelHub?
              Reach our student moderation team via WhatsApp.
            </p>
            <a
              href="https://wa.me/919999999999?text=Hi%20HostelHub%20Team!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-[#FFE600] font-black uppercase text-sm tracking-wider border-2 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all select-none"
            >
              <Phone className="w-4 h-4 stroke-[2.5]" />
              WhatsApp Support
            </a>
            <div className="mt-6 bg-black/10 border-2 border-black/20 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-black mb-1">
                Hostel Moderators
              </p>
              <p className="text-sm font-bold text-black/70">
                Birsa Munda • Sarojini Naidu • Kasturba Gandhi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-4 border-black bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-widest text-[#FFE600]">
              © 2026 HostelHub — Made in Pondicherry. All Rights Reserved.
            </p>
            <p className="text-xs font-bold uppercase text-white/40 tracking-wider">
              For PU Students · By PU Students · Zero Commission, Always
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
