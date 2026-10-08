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
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender name */}
        <p
          className={`text-[11px] font-black uppercase tracking-wider mb-1 px-1 text-black/70 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {isOwn ? "You" : message.sender?.name ?? "Other Party"}
        </p>

        {isOffer ? (
          /* Counter-offer bubble */
          <div className="bg-[#00F5A0] text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black mb-1">
              <Tag className="w-4 h-4 stroke-[3]" />
              Official Counter Offer
            </div>
            <div className="flex items-center gap-1 bg-[#FFE600] border-2 border-black px-2.5 py-1 w-fit mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <IndianRupee className="w-5 h-5 stroke-[3] text-black" />
              <span className="text-2xl font-black text-black">
                {message.offer_amount?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ) : (
          /* Normal message bubble */
          <div
            className={`p-3.5 text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] leading-relaxed ${
              isOwn
                ? "bg-[#FFE600] text-black"
                : "bg-white text-black"
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-[10px] font-bold uppercase tracking-wider text-black/60 mt-1 px-1 ${
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
