import type { Metadata } from "next";
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
    <html lang="en" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
