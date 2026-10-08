// ──────────────────────────────────────────────
// Shared TypeScript types for HostelHub
// ──────────────────────────────────────────────

export type ItemCategory = "Books" | "Electronics" | "Essentials" | "Vehicles";
export type ItemCondition = "New" | "Like New" | "Good" | "Fair" | "Poor";
export type ItemStatus = "Available" | "Reserved" | "Sold";
export type MessageType = "text" | "offer";

export interface Profile {
  id: string;
  name: string;
  hostel_block: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: ItemCategory;
  price: number;
  condition: ItemCondition;
  status: ItemStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  seller?: Profile;
}

export interface Conversation {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  // Joined
  item?: Item;
  buyer?: Profile;
  seller?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  offer_amount: number | null;
  created_at: string;
  // Joined
  sender?: Profile;
}
