"use client";

import type { ItemCategory } from "@/lib/types";
import { Search, BookOpen, Cpu, ShoppingBag, Bike, LayoutGrid } from "lucide-react";

const CATEGORIES: { label: string; value: ItemCategory | "All"; icon: React.ElementType }[] = [
  { label: "All Items", value: "All", icon: LayoutGrid },
  { label: "Books", value: "Books", icon: BookOpen },
  { label: "Electronics", value: "Electronics", icon: Cpu },
  { label: "Essentials", value: "Essentials", icon: ShoppingBag },
  { label: "Vehicles", value: "Vehicles", icon: Bike },
];

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  category: ItemCategory | "All";
  onCategoryChange: (val: ItemCategory | "All") => void;
}

export default function SearchFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex flex-col gap-5 mb-10 select-none">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black stroke-[3] pointer-events-none" />
        <input
          id="search-input"
          type="text"
          placeholder="SEARCH BOOKS, ELECTRONICS, ESSENTIALS..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border-4 border-black pl-12 pr-4 py-4 text-black font-black text-sm uppercase placeholder-gray-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FFFDEB] focus:outline-none transition-all"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map(({ label, value, icon: Icon }) => {
          const isActive = category === value;
          return (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                isActive
                  ? "bg-[#FFE600] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFDEB] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.5]" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
