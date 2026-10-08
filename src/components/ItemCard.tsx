"use client";

import Link from "next/link";
import type { Item } from "@/lib/types";
import {
  BookOpen,
  Cpu,
  ShoppingBag,
  Bike,
  MapPin,
  Clock,
  IndianRupee,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Books: BookOpen,
  Electronics: Cpu,
  Essentials: ShoppingBag,
  Vehicles: Bike,
};

// Bold Neo-Brutalist Card Background colors per category
const CATEGORY_CARD_BG: Record<string, string> = {
  Books: "bg-[#ffde59]",       // Bright yellow
  Electronics: "bg-[#00ffff]", // Bright cyan
  Vehicles: "bg-[#ff66c4]",    // Vibrant pink
};

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-[#00F5A0] text-black",
  Reserved: "bg-[#FFE600] text-black",
  Sold: "bg-[#FF5D8F] text-black",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ItemCard({ item }: { item: Item }) {
  const CategoryIcon = CATEGORY_ICONS[item.category] ?? ShoppingBag;
  // Dynamic category color coding: Books -> #ffde59, Electronics -> #00ffff, Vehicles -> #ff66c4, default -> #f4f4f0
  const cardBgColor = CATEGORY_CARD_BG[item.category] ?? "bg-[#f4f4f0]";
  const statusStyle = STATUS_STYLES[item.status] ?? "bg-white text-black";

  return (
    <Link href={`/items/${item.id}`} className="block group select-none h-full">
      <div
        className={`${cardBgColor} border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all p-5 h-full flex flex-col`}
      >
        {/* Header: Category Badge + Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <CategoryIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            {item.category}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${statusStyle}`}
          >
            {item.status}
          </span>
        </div>

        {/* Product Image Thumbnail */}
        {item.image_url ? (
          <div className="relative w-full h-48 mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <div className="w-full h-32 mb-4 border-2 border-dashed border-black bg-white/70 flex items-center justify-center text-xs font-black uppercase tracking-widest text-black/70">
            No Photo Attached
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-black text-black uppercase tracking-tight leading-snug mb-2 line-clamp-2 group-hover:underline">
          {item.title}
        </h3>

        {/* Description preview */}
        <p className="text-xs font-bold text-black/80 leading-relaxed mb-4 line-clamp-2 flex-1">
          {item.description}
        </p>

        {/* Price Tag with bold neo-brutalist badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1 bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <IndianRupee className="w-4 h-4 stroke-[3] text-black" />
            <span className="text-2xl font-black text-black">
              {item.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-black mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="truncate max-w-[100px]">
              {item.seller?.hostel_block || "Campus"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase bg-white border-2 border-black px-2 py-1 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {item.condition}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-black uppercase">
              <Clock className="w-3 h-3 stroke-[2.5]" />
              {timeAgo(item.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
