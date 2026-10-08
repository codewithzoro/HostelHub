// ──────────────────────────────────────────────
// Mock data fallback for demo / offline mode
// Seed data: Pondicherry University, Kalapet — B.Tech CSE student marketplace
// ──────────────────────────────────────────────

import type { Item, Profile, Conversation, Message } from "./types";

export const MOCK_PROFILES: Profile[] = [
  {
    id: "mock-user-1",
    name: "Arjun Mehta",
    hostel_block: "Birsa Munda Hostel — Block A",
    phone: "9876543210",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-2",
    name: "Priya Sharma",
    hostel_block: "Sarojini Naidu Hostel — Wing C",
    phone: "9123456789",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-3",
    name: "Rahul Verma",
    hostel_block: "Birsa Munda Hostel — Block B",
    phone: "9988776655",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-4",
    name: "Sneha Iyer",
    hostel_block: "Kasturba Gandhi Hostel — Room 214",
    phone: "9112233445",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-user-5",
    name: "Karthik Raja",
    hostel_block: "Birsa Munda Hostel — Block C",
    phone: "9445566778",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_ITEMS: Item[] = [
  {
    id: "mock-item-1",
    seller_id: "mock-user-3",
    title: "Gigabyte G6 Gaming Laptop (2023) — RTX 4060",
    description:
      "16GB RAM, 512GB NVMe SSD, 165Hz FHD display. Used for one semester. Runs VS Code, Unity, Blender without breaking a sweat. Original charger + carry bag included. Selling because switching to MacBook for final year project.",
    category: "Electronics",
    price: 62000,
    condition: "Like New",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    seller: MOCK_PROFILES[2],
  },
  {
    id: "mock-item-2",
    seller_id: "mock-user-1",
    title: "Digital Electronics Lab Kit — Full Set with IC Chips",
    description:
      "Complete set for DE lab: breadboard, logic gates (74LS series), flip-flops, 7-segment displays, connecting wires, 9V adapter. Used for 3rd semester labs at PU. Works 100%. Ideal for juniors who don't want to buy individually.",
    category: "Electronics",
    price: 1400,
    condition: "Good",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    seller: MOCK_PROFILES[0],
  },
  {
    id: "mock-item-3",
    seller_id: "mock-user-2",
    title: "C Programming — Let Us C (17th Ed.) + DS by Lipschutz",
    description:
      "Two essential CSE books bundled. 'Let Us C' by Yashavant Kanetkar — clean, no missing pages. Schaum's 'Data Structures' by Lipschutz — few pencil marks in ch.4. Selling together at a discount. Pickup at Sarojini Naidu Hostel.",
    category: "Books",
    price: 320,
    condition: "Good",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    seller: MOCK_PROFILES[1],
  },
  {
    id: "mock-item-4",
    seller_id: "mock-user-4",
    title: "Hero Splendor Plus (2021) — Campus Commuter",
    description:
      "42 kmpl mileage. 14,000 km driven, all PUC & insurance documents valid till 2026. Serviced at official Hero center 3 months ago. Perfect for Kalapet–Auroville rides or reaching the railway station. Negotiable for PU students.",
    category: "Vehicles",
    price: 48000,
    condition: "Good",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    seller: MOCK_PROFILES[3],
  },
  {
    id: "mock-item-5",
    seller_id: "mock-user-5",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    description:
      "30hr battery, multi-device pairing, industry-best ANC. 8 months old, mint condition. Original box, USB-C cable, pouch included. Bought for Rs.27,000. Perfect for coding sessions in the hostel or PU library.",
    category: "Electronics",
    price: 16500,
    condition: "Like New",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    seller: MOCK_PROFILES[4],
  },
  {
    id: "mock-item-6",
    seller_id: "mock-user-1",
    title: "Casio FX-991EX ClassWiz Scientific Calculator",
    description:
      "552 functions, spreadsheet mode, QR code result display. Mandatory for 1st & 2nd year engineering maths at PU. Barely used — I prefer Python now. Solar + battery powered. Meet at Birsa Munda common room.",
    category: "Electronics",
    price: 950,
    condition: "Like New",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    seller: MOCK_PROFILES[0],
  },
  {
    id: "mock-item-7",
    seller_id: "mock-user-3",
    title: "Firefox Traction 26T Bicycle — Campus Rider",
    description:
      "Used for campus rides for 2 years. Brakes and tyres replaced 4 months ago. Chain recently oiled. Great for the Kalapet-beach road stretch or hostel to academic block. Helmet included. Very light frame.",
    category: "Vehicles",
    price: 3800,
    condition: "Fair",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    seller: MOCK_PROFILES[2],
  },
  {
    id: "mock-item-8",
    seller_id: "mock-user-2",
    title: "Hostel Starter Pack — Bucket, Mug, Hangers, Bedsheet",
    description:
      "Everything for your first week at PU. 20L bucket, steel mug, 12 plastic hangers, one single bedsheet. All clean. Selling because moving off-campus. Great deal for new joiners at Sarojini Naidu or Kasturba Gandhi hostel.",
    category: "Essentials",
    price: 350,
    condition: "Good",
    status: "Available",
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    seller: MOCK_PROFILES[1],
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "mock-conv-1",
    item_id: "mock-item-5",
    buyer_id: "mock-user-1",
    seller_id: "mock-user-5",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    item: MOCK_ITEMS[4],
    buyer: MOCK_PROFILES[0],
    seller: MOCK_PROFILES[4],
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "mock-msg-1",
    conversation_id: "mock-conv-1",
    sender_id: "mock-user-1",
    content: "Hey! Is the XM5 still available? Any scratches on the headband?",
    message_type: "text",
    offer_amount: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    sender: MOCK_PROFILES[0],
  },
  {
    id: "mock-msg-2",
    conversation_id: "mock-conv-1",
    sender_id: "mock-user-5",
    content:
      "Yes, absolutely mint! No scratches. Can meet you at Birsa Munda common room tonight.",
    message_type: "text",
    offer_amount: null,
    created_at: new Date(Date.now() - 3500000).toISOString(),
    sender: MOCK_PROFILES[4],
  },
  {
    id: "mock-msg-3",
    conversation_id: "mock-conv-1",
    sender_id: "mock-user-1",
    content: "Counter-offer submitted",
    message_type: "offer",
    offer_amount: 14000,
    created_at: new Date(Date.now() - 3400000).toISOString(),
    sender: MOCK_PROFILES[0],
  },
];
