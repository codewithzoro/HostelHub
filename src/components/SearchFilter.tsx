"use client";

import type { ItemCategory } from "@/lib/types";
import { Search, BookOpen, Cpu, ShoppingBag, Bike, LayoutGrid } from "lucide-react";

const CATEGORIES: { label: string; value: ItemCategory | "All"; icon: React.ElementType }[] = [
  { label: "All", value: "All", icon: LayoutGrid },
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
    <div className="flex flex-col gap-4 mb-8 animate-in">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        <input
          id="search-input"
          type="text"
          placeholder="Search items, books, electronics…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-input !pl-12 !pr-4"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onCategoryChange(value)}
            className={
              category === value ? "category-pill-active" : "category-pill-inactive"
            }
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
