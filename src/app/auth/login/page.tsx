"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";

/* ── Framer Motion variants ── */
const brandLineVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.15, type: "spring", stiffness: 100, damping: 14 },
  }),
};

const formCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 16, delay: 0.1 },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Brand copy lines for left panel ── */
  const brandLines = [
    "TRADE GEAR.",
    "MEET AT",
    "BIRSA MUNDA.",
    "NO SCAMS.",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ═══════════════════════════════════════════════
          LEFT — Branding Panel (hidden on mobile)
          ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#00ffff] border-r-4 border-black relative overflow-hidden flex-col justify-center px-12 xl:px-16">
        {/* Decorative corner blocks */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFE600] border-b-4 border-r-4 border-black" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#ff66c4] border-t-4 border-l-4 border-black" />
        <div className="absolute top-1/4 right-8 w-20 h-20 bg-black rotate-12" />

        {/* Stagger-animated massive typography */}
        <div className="relative z-10 space-y-2">
          {brandLines.map((line, i) => (
            <motion.h1
              key={line}
              custom={i}
              variants={brandLineVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl xl:text-7xl font-black uppercase tracking-tighter text-black leading-[0.95]"
            >
              {line}
            </motion.h1>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-base xl:text-lg font-bold text-black/70 mt-6 max-w-sm uppercase tracking-wide"
          >
            The exclusive marketplace for Pondicherry University.
          </motion.p>

          {/* Decorative badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 120 }}
            className="inline-block mt-8 bg-[#FFE600] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3"
          >
            <span className="font-black text-sm uppercase tracking-widest">
              🎓 Kalapet 605014 • Est. 2026
            </span>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT — Login Form
          ═══════════════════════════════════════════════ */}
      <div className="flex-1 bg-[#f4f4f0] flex items-center justify-center px-5 py-12 lg:py-0 relative">
        {/* Mobile-only compact branding strip */}
        <div className="lg:hidden absolute top-0 left-0 right-0 bg-[#00ffff] border-b-4 border-black p-4 text-center">
          <p className="font-black text-lg uppercase tracking-tight text-black">
            TRADE GEAR. MEET AT BIRSA MUNDA. NO SCAMS.
          </p>
        </div>

        <motion.div
          variants={formCardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mt-16 lg:mt-0"
        >
          {/* ── Logo + Header ── */}
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="flex items-center justify-center w-12 h-12 bg-[#9333ea] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-3xl font-black uppercase tracking-tight text-black">
              Hostel<span className="bg-black text-[#FFE600] px-1.5 py-0.5 ml-1">Hub</span>
            </span>
          </Link>

          {/* ── Form Card ── */}
          <div className="relative">
            {/* Hard shadow layer */}
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
            <div className="relative bg-white border-4 border-black p-7 md:p-8">
              {/* Card header */}
              <div className="mb-6">
                <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                  Welcome Back 👋
                </h1>
                <p className="text-sm font-bold text-black/50 mt-1 uppercase tracking-wide">
                  Sign in to your campus marketplace
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Error banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FF5D8F] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-3 text-sm font-bold text-black"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black mb-2"
                  >
                    <Mail className="w-4 h-4 stroke-[2.5]" />
                    📧 Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ankan@pondiuni.edu.in"
                    className="w-full bg-white border-2 border-black rounded-none px-4 py-3.5 text-black font-bold placeholder-black/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-[#ffebcd] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-150"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black mb-2"
                  >
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPw ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-black rounded-none px-4 py-3.5 pr-12 text-black font-bold placeholder-black/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-[#ffebcd] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#f4f4f0] border-2 border-black hover:bg-[#FFE600] transition-colors"
                    >
                      {showPw ? (
                        <EyeOff className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button — Massive purple */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#9333ea] text-white font-black text-lg uppercase tracking-wider border-4 border-black rounded-none px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      ENTER THE HUB ➔
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-[3px] bg-black" />
                <span className="text-xs font-black uppercase tracking-widest text-black/40">
                  OR
                </span>
                <div className="flex-1 h-[3px] bg-black" />
              </div>

              {/* Sign up link */}
              <Link
                href="/auth/signup"
                className="w-full neo-btn bg-[#FFE600] hover:bg-[#FFDE00] justify-center text-sm"
              >
                Create New Account
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

          {/* Campus footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs font-bold text-black/30 mt-6 uppercase tracking-wider"
          >
            Pondicherry University • Kalapet 605014 • Exclusive Student Marketplace
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
