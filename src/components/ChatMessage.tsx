"use client";

import type { Message } from "@/lib/types";
import { IndianRupee, Tag } from "lucide-react";

interface Props {
  message: Message;
  isOwn: boolean;
}

export default function ChatMessage({ message, isOwn }: Props) {
  const isOffer = message.message_type === "offer";

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-slide-up`}
    >
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender name */}
        <p
          className={`text-[11px] font-medium mb-1 px-1 ${
            isOwn ? "text-right text-brand-400/70" : "text-left text-gray-500"
          }`}
        >
          {message.sender?.name ?? "Unknown"}
        </p>

        {isOffer ? (
          /* Offer bubble */
          <div
            className={`offer-bubble ${
              isOwn ? "rounded-br-md" : "rounded-bl-md"
            }`}
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[11px] text-amber-400/70 font-medium uppercase tracking-wider">
                Counter Offer
              </p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <IndianRupee className="w-4 h-4 text-amber-300" />
                <span className="text-lg font-display font-bold text-amber-200">
                  {message.offer_amount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Normal text bubble */
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isOwn
                ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-br-md"
                : "bg-white/[0.07] text-gray-200 border border-white/[0.08] rounded-bl-md"
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-[10px] text-gray-600 mt-1 px-1 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
