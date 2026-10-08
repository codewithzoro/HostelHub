import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "HostelHub — Campus Marketplace",
  description:
    "The fastest way to buy and sell on campus. No more noisy WhatsApp groups — browse, bargain, and deal in real time.",
  keywords: ["campus", "marketplace", "hostel", "buy", "sell", "student"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f4f0] text-black antialiased selection:bg-[#FFE600] selection:text-black">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "0px",
              border: "3px solid #000000",
              boxShadow: "5px 5px 0px 0px #000000",
              fontWeight: 700,
            },
            classNames: {
              toast:
                "rounded-none !border-[3px] !border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] font-sans p-4",
              title: "font-black text-black uppercase tracking-tight text-sm",
              description: "text-xs font-bold text-black/85 mt-1",
              actionButton:
                "rounded-none bg-[#FFE600] text-black border-2 border-black font-black uppercase text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
              cancelButton:
                "rounded-none bg-white text-black border-2 border-black font-black uppercase text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
              success:
                "!bg-[#00F5A0] !text-black !border-[3px] !border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
              error:
                "!bg-[#FF5D8F] !text-black !border-[3px] !border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
              warning:
                "!bg-[#FFE600] !text-black !border-[3px] !border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
              info:
                "!bg-[#00ffff] !text-black !border-[3px] !border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
            },
          }}
        />
      </body>
    </html>
  );
}
