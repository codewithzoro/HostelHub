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

const CATEGORY_COLORS: Record<string, string> = {
  Books: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Electronics: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Essentials: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Vehicles: "text-orange-400 bg-orange-500/10 border-orange-500/20",
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
  const statusClass =
    item.status === "Available"
      ? "badge-available"
      : item.status === "Reserved"
        ? "badge-reserved"
        : "badge-sold";

  return (
    <Link href={`/items/${item.id}`} className="block group">
      <div className="glass-card-hover p-5 h-full flex flex-col">
        {/* Header: Category + Status */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${CATEGORY_COLORS[item.category]}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            {item.category}
          </span>
          <span className={statusClass}>{item.status}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-100 leading-snug mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors duration-200">
          {item.title}
        </h3>

        {/* Description preview */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {item.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <IndianRupee className="w-4 h-4 text-brand-400" />
          <span className="text-xl font-display font-bold text-white">
            {item.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">
              {item.seller?.hostel_block || "Campus"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-white/[0.04] px-2 py-0.5 rounded-md">
              {item.condition}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              {timeAgo(item.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
