"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  Store,
  Plus,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  Menu,
  X,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? undefined } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FFE600] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with stark border and hard drop shadow */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-11 h-11 bg-black text-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tight text-black">
              Hostel<span className="bg-black text-[#FFE600] px-1.5 py-0.5 ml-1">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 font-black text-sm uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            >
              <Store className="w-4 h-4 stroke-[2.5]" />
              Marketplace
            </Link>

            <Link
              href="/items/new"
              className="flex items-center gap-1.5 px-4 py-2 font-black text-sm uppercase tracking-wider text-black bg-[#00F5A0] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Sell Item
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 font-black text-sm uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            >
              <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
              Dashboard
            </Link>

            {user && (
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-4 py-2 font-black text-sm uppercase tracking-wider text-black bg-[#00D2FF] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                Profile
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 font-black text-sm uppercase tracking-wider text-black bg-[#FF5D8F] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-4 py-2 font-black text-sm uppercase tracking-wider text-white bg-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-5 pt-3 border-t-2 border-black">
            <div className="flex flex-col gap-2.5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-3 font-black text-sm uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Store className="w-4 h-4 stroke-[2.5]" />
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-3 font-black text-sm uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
                Dashboard
              </Link>
              <Link
                href="/items/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-3 font-black text-sm uppercase tracking-wider text-black bg-[#00F5A0] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Sell Item
              </Link>
              {user && (
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-3 font-black text-sm uppercase tracking-wider text-black bg-[#00D2FF] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <User className="w-4 h-4 stroke-[2.5]" />
                  Profile
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 font-black text-sm uppercase tracking-wider text-black bg-[#FF5D8F] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-3 font-black text-sm uppercase tracking-wider text-white bg-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
