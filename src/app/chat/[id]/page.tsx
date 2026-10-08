"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChatMessage from "@/components/ChatMessage";
import { createClient } from "@/lib/supabase";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_PROFILES,
} from "@/lib/mock-data";
import type { Message, Conversation, Profile } from "@/lib/types";
import {
  ArrowLeft,
  Send,
  IndianRupee,
  Tag,
  Package,
  X,
  Handshake,
  MessageSquare,
} from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Bargain UI
  const [showBargain, setShowBargain] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation + messages + subscribe
  useEffect(() => {
    let subscription: ReturnType<ReturnType<typeof createClient>["channel"]> | null = null;

    async function load() {
      try {
        const supabase = createClient();

        // Current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id ?? "mock-user-1";
        setCurrentUserId(userId);

        // Fetch conversation
        const { data: conv, error: convErr } = await supabase
          .from("conversations")
          .select("*, item:items(*, seller:profiles(*)), buyer:profiles!conversations_buyer_id_fkey(*), seller:profiles!conversations_seller_id_fkey(*)")
          .eq("id", conversationId)
          .single();

        if (convErr || !conv) {
          // Mock fallback
          const mockConv =
            MOCK_CONVERSATIONS.find((c) => c.id === conversationId) ??
            MOCK_CONVERSATIONS[0];
          setConversation(mockConv);
          setMessages(MOCK_MESSAGES);
          setLoading(false);
          return;
        }

        setConversation(conv as unknown as Conversation);

        // Fetch messages
        const { data: msgs } = await supabase
          .from("messages")
          .select("*, sender:profiles(*)")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        setMessages((msgs as Message[]) ?? []);

        // Realtime subscription
        subscription = supabase
          .channel(`chat-${conversationId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conversationId}`,
            },
            async (payload) => {
              // Fetch the full message with sender profile
              const { data: fullMsg } = await supabase
                .from("messages")
                .select("*, sender:profiles(*)")
                .eq("id", payload.new.id)
                .single();

              if (fullMsg) {
                setMessages((prev) => {
                  // Avoid duplicates
                  if (prev.some((m) => m.id === fullMsg.id)) return prev;
                  return [...prev, fullMsg as Message];
                });
              }
            }
          )
          .subscribe();
      } catch {
        const mockConv =
          MOCK_CONVERSATIONS.find((c) => c.id === conversationId) ??
          MOCK_CONVERSATIONS[0];
        setConversation(mockConv);
        setMessages(MOCK_MESSAGES);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      subscription?.unsubscribe();
    };
  }, [conversationId]);

  const sendMessage = async (
    content: string,
    type: "text" | "offer" = "text",
    offer?: number
  ) => {
    if (!content.trim() || !currentUserId) return;
    setSending(true);

    // Optimistic message
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      message_type: type,
      offer_amount: offer ?? null,
      created_at: new Date().toISOString(),
      sender: MOCK_PROFILES.find((p) => p.id === currentUserId) ?? {
        id: currentUserId,
        name: "You",
        hostel_block: "",
        phone: "",
        avatar_url: null,
        created_at: "",
        updated_at: "",
      },
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content,
          message_type: type,
          offer_amount: offer ?? null,
        })
        .select("*, sender:profiles(*)")
        .single();

      if (!error && data) {
        // Replace optimistic with real
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? (data as Message) : m))
        );
      }
    } catch {
      // Keep optimistic message for demo
    } finally {
      setSending(false);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) return;
    sendMessage(`Counter-offer: ₹${amount.toLocaleString("en-IN")}`, "offer", amount);
    setOfferAmount("");
    setShowBargain(false);
    inputRef.current?.focus();
  };

  // Figure out the other party's name
  const otherParty =
    currentUserId === conversation?.buyer_id
      ? conversation?.seller
      : conversation?.buyer;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container max-w-3xl">
          <div className="glass-card h-[70vh] animate-pulse" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-container max-w-3xl !py-4">
        <div className="glass-card flex flex-col h-[calc(100vh-7rem)] animate-in">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
            <button onClick={() => router.back()} className="btn-ghost !p-2">
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(otherParty?.name?.[0] ?? "?").toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {otherParty?.name ?? "Chat"}
              </p>
              {conversation?.item && (
                <Link
                  href={`/items/${conversation.item.id}`}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-400 transition-colors truncate"
                >
                  <Package className="w-3 h-3 flex-shrink-0" />
                  {conversation.item.title}
                </Link>
              )}
            </div>

            {/* Item price badge */}
            {conversation?.item && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm">
                <IndianRupee className="w-3.5 h-3.5 text-brand-400" />
                <span className="font-semibold text-white">
                  {conversation.item.price.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-12 h-12 text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_id === currentUserId}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Bargain slider */}
          {showBargain && (
            <div className="border-t border-white/[0.06] p-4 bg-white/[0.02] animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
                  <Handshake className="w-4 h-4" />
                  Make a Counter Offer
                </div>
                <button
                  onClick={() => setShowBargain(false)}
                  className="btn-ghost !p-1.5 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSendOffer} className="flex gap-3">
                <div className="relative flex-1">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    autoFocus
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter your price"
                    className="glass-input !pl-10 !border-amber-500/20 !focus:ring-amber-400/30"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded-xl px-5 py-3 transition-all duration-200 active:scale-[0.97]"
                >
                  <Tag className="w-4 h-4" />
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-white/[0.06] p-4">
            <form onSubmit={handleSendText} className="flex gap-3">
              {/* Bargain toggle button */}
              <button
                type="button"
                onClick={() => setShowBargain(!showBargain)}
                className={`flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200 ${
                  showBargain
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                    : "bg-white/[0.04] text-gray-500 border-white/[0.08] hover:text-amber-400 hover:border-amber-500/20"
                }`}
                title="Bargain"
              >
                <IndianRupee className="w-5 h-5" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message…"
                className="glass-input flex-1"
              />

              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn-primary !px-4 !py-3 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
