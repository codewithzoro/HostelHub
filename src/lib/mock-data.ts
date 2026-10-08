// ──────────────────────────────────────────────
// Mock data fallback for demo / offline mode
// ──────────────────────────────────────────────

import type { Item, Profile, Conversation, Message } from "./types";

export const MOCK_PROFILES: Profile[] = [
  {
    id: "mock-user-1",
    name: "Arjun Mehta",
    hostel_block: "Block A - Narmada",
    phone: "9876543210",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-2",
    name: "Priya Sharma",
    hostel_block: "Block C - Ganga",
    phone: "9123456789",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-3",
    name: "Rahul Verma",
    hostel_block: "Block B - Yamuna",
    phone: "9988776655",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-4",
    name: "Sneha Iyer",
    hostel_block: "Block D - Kaveri",
    phone: "9112233445",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_ITEMS: Item[] = [
  {
    id: "mock-item-1",
    seller_id: "mock-user-1",
    title: "Engineering Mathematics — B.S. Grewal (8th Ed.)",
    description:
      "Lightly used, all chapters intact. Highlighted some key formulas. Perfect for 1st-year students.",
    category: "Books",
    price: 250,
    condition: "Good",
    status: "Available",
    image_url: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    seller: MOCK_PROFILES[0],
  },
  {
    id: "mock-item-2",
    seller_id: "mock-user-2",
    title: "Sony WH-1000XM4 Headphones",
    description:
      "Noise-cancelling headphones, 11 months old. Original box and cable included. Battery life still great.",
    category: "Electronics",
    price: 12500,
    condition: "Like New",
    status: "Available",
    image_url: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    seller: MOCK_PROFILES[1],
  },
  {
    id: "mock-item-3",
    seller_id: "mock-user-3",
    title: "Study Desk Lamp (LED, USB rechargeable)",
    description:
      "3 brightness modes. Clip-on style, perfect for hostel desks. Selling because I graduated.",
    category: "Essentials",
    price: 450,
    condition: "Good",
    status: "Available",
    image_url: null,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    seller: MOCK_PROFILES[2],
  },
  {
    id: "mock-item-4",
    seller_id: "mock-user-4",
    title: "Honda Activa 6G (2023 model)",
    description:
      "Single owner, 8000 km driven. Serviced regularly. All documents clear. Ideal for campus commute.",
    category: "Vehicles",
    price: 65000,
    condition: "Like New",
    status: "Available",
    image_url: null,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    seller: MOCK_PROFILES[3],
  },
  {
    id: "mock-item-5",
    seller_id: "mock-user-1",
    title: "Scientific Calculator — Casio FX-991EX",
    description:
      "Works perfectly. Selling because I switched to a graphing calculator. Batteries included.",
    category: "Electronics",
    price: 800,
    condition: "Good",
    status: "Reserved",
    image_url: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    seller: MOCK_PROFILES[0],
  },
  {
    id: "mock-item-6",
    seller_id: "mock-user-2",
    title: "Bucket, Mug & Hanger Set",
    description:
      "Complete hostel essentials kit. Used for one semester. Clean and in good shape.",
    category: "Essentials",
    price: 200,
    condition: "Fair",
    status: "Available",
    image_url: null,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    seller: MOCK_PROFILES[1],
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "mock-conv-1",
    item_id: "mock-item-2",
    buyer_id: "mock-user-1",
    seller_id: "mock-user-2",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    item: MOCK_ITEMS[1],
    buyer: MOCK_PROFILES[0],
    seller: MOCK_PROFILES[1],
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "mock-msg-1",
    conversation_id: "mock-conv-1",
    sender_id: "mock-user-1",
    content: "Hey! Is the XM4 still available? Any scratches?",
    message_type: "text",
    offer_amount: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    sender: MOCK_PROFILES[0],
  },
  {
    id: "mock-msg-2",
    conversation_id: "mock-conv-1",
    sender_id: "mock-user-2",
    content: "Yes, absolutely mint condition! No scratches at all.",
    message_type: "text",
    offer_amount: null,
    created_at: new Date(Date.now() - 3500000).toISOString(),
    sender: MOCK_PROFILES[1],
  },
  {
    id: "mock-msg-3",
    conversation_id: "mock-conv-1",
    sender_id: "mock-user-1",
    content: "Counter-offer submitted",
    message_type: "offer",
    offer_amount: 10000,
    created_at: new Date(Date.now() - 3400000).toISOString(),
    sender: MOCK_PROFILES[0],
  },
];
