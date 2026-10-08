"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building,
  Phone,
  Zap,
  CheckCircle2,
} from "lucide-react";

/* ── Framer Motion variants ── */
const brandLineVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2 + i * 0.15,
      type: "spring",
      stiffness: 100,
      damping: 14,
    },
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

/* ── Shared brutalist input classes ── */
const INPUT_CLASS =
  "w-full bg-white border-2 border-black rounded-none px-4 py-3 text-black font-bold placeholder-black/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-[#00ffff]/20 focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-150";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [hostel, setHostel] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Sign up
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Update profile with hostel & phone
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ name, hostel_block: hostel, phone })
          .eq("id", data.user.id);
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════
     SUCCESS STATE — Neo-Brutalist
     ═══════════════════════════════════════════════ */
  if (success) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
            <div className="relative bg-[#00F5A0] border-4 border-black p-8 text-center">
              <div className="w-20 h-20 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-3">
                Account Created! 🎉
              </h1>
              <p className="font-bold text-black/70 text-sm uppercase tracking-wide mb-6">
                Check your email to verify your account, then sign in to start
                buying and selling on campus.
              </p>
              <Link
                href="/auth/login"
                className="neo-btn bg-[#FFE600] hover:bg-[#FFDE00] w-full justify-center text-base"
              >
                Go to Sign In
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Brand copy lines for left panel ── */
  const brandLines = [
    "JOIN THE",
    "HUB.",
    "DITCH THE",
    "WHATSAPP",
    "GROUPS.",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ═══════════════════════════════════════════════
          LEFT — Branding Panel (hidden on mobile)
          ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#ff66c4] border-r-4 border-black relative overflow-hidden flex-col justify-center px-12 xl:px-16">
        {/* Decorative corner blocks */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFE600] border-b-4 border-l-4 border-black" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#00ffff] border-t-4 border-r-4 border-black" />
        <div className="absolute bottom-1/3 right-10 w-16 h-16 bg-black -rotate-12" />
        <div className="absolute top-1/4 left-8 w-12 h-12 bg-[#9333ea] rotate-6 border-3 border-black" />

        {/* Stagger-animated massive typography */}
        <div className="relative z-10 space-y-1">
          {brandLines.map((line, i) => (
            <motion.h1
              key={`${line}-${i}`}
              custom={i}
              variants={brandLineVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl xl:text-7xl font-black uppercase tracking-tighter text-black leading-[0.92]"
            >
              {line}
            </motion.h1>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="text-sm xl:text-base font-bold text-black/70 mt-6 max-w-xs uppercase tracking-wide !mt-6"
          >
            The exclusive student-to-student marketplace for Pondicherry
            University.
          </motion.p>

          {/* Decorative badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 4 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 120 }}
            className="inline-block mt-8 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 !mt-8"
          >
            <span className="font-black text-sm uppercase tracking-widest">
              🏫 Kalapet Campus • 605014
            </span>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT — Sign-Up Form
          ═══════════════════════════════════════════════ */}
      <div className="flex-1 bg-[#f4f4f0] flex items-center justify-center px-5 py-10 lg:py-0 relative">
        {/* Mobile-only compact branding strip */}
        <div className="lg:hidden absolute top-0 left-0 right-0 bg-[#ff66c4] border-b-4 border-black p-4 text-center">
          <p className="font-black text-base uppercase tracking-tight text-black">
            JOIN THE HUB. DITCH THE WHATSAPP GROUPS.
          </p>
        </div>

        <motion.div
          variants={formCardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mt-16 lg:mt-0"
        >
          {/* ── Logo + Header ── */}
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="flex items-center justify-center w-12 h-12 bg-[#9333ea] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-3xl font-black uppercase tracking-tight text-black">
              Hostel
              <span className="bg-black text-[#FFE600] px-1.5 py-0.5 ml-1">
                Hub
              </span>
            </span>
          </Link>

          {/* ── Form Card ── */}
          <div className="relative">
            {/* Hard shadow layer */}
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
            <div className="relative bg-white border-4 border-black p-6 md:p-8">
              {/* Card header */}
              <div className="mb-5">
                <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                  Create Account 🚀
                </h1>
                <p className="text-sm font-bold text-black/50 mt-1 uppercase tracking-wide">
                  Join the campus marketplace
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
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

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="signup-name"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black mb-1.5"
                  >
                    <User className="w-3.5 h-3.5 stroke-[2.5]" />
                    👤 Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ankan Ghosh"
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Hostel Block */}
                <div>
                  <label
                    htmlFor="signup-hostel"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black mb-1.5"
                  >
                    <Building className="w-3.5 h-3.5 stroke-[2.5]" />
                    🏢 Hostel Block
                  </label>
                  <input
                    id="signup-hostel"
                    type="text"
                    required
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    placeholder="e.g., Birsa Munda Hostel - Room 426"
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="signup-phone"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black mb-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                    📞 Phone Number
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black mb-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
                    📧 Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ankan@pondiuni.edu.in"
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="signup-password"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black mb-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPw ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className={`${INPUT_CLASS} !pr-12`}
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

                {/* Submit button — Massive green */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00F5A0] text-black font-black text-lg uppercase tracking-wider border-4 border-black rounded-none px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 mt-2"
                >
                  {loading ? (
                    <span className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>CLAIM YOUR ACCOUNT ➔</>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-[3px] bg-black" />
                <span className="text-xs font-black uppercase tracking-widest text-black/40">
                  OR
                </span>
                <div className="flex-1 h-[3px] bg-black" />
              </div>

              {/* Sign in link */}
              <Link
                href="/auth/login"
                className="w-full neo-btn bg-[#FFE600] hover:bg-[#FFDE00] justify-center text-sm"
              >
                Already have an account? Sign In
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

          {/* Campus footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs font-bold text-black/30 mt-5 uppercase tracking-wider"
          >
            Pondicherry University • Kalapet 605014 • Student-Only Marketplace
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
