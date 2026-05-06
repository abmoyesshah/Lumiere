"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function LoadingSpinner({ variant = "default", label, show = true }) {
  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-2 text-fuchsia-300">
        <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-fuchsia-400/25 border-t-fuchsia-400 animate-spin" />
        {label && <span className="text-[10px] sm:text-xs tracking-wider uppercase">{label}</span>}
      </span>
    );
  }

  if (variant === "overlay") {
    if (!show) return null;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}>
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <div className="absolute inset-0 rounded-full border border-white/[0.08] animate-spin" style={{ animationDuration: "2.4s" }} />
            <div className="absolute inset-0 rounded-full animate-spin" style={{
              background: "conic-gradient(from 0deg, transparent, #d946ef, #a855f7, transparent)",
              mask: "radial-gradient(transparent 60%, black 62%)",
              WebkitMask: "radial-gradient(transparent 60%, black 62%)",
              animationDuration: "1.4s",
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={16} className="text-fuchsia-300 fill-fuchsia-300/40 sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-fuchsia-200/80 font-medium">
            {label || "Just a moment"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}>
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <div className="absolute inset-0 rounded-full border border-white/[0.08] animate-spin" style={{ animationDuration: "2.4s" }} />
          <div className="absolute inset-0 rounded-full animate-spin" style={{
            background: "conic-gradient(from 0deg, transparent, #d946ef, #a855f7, transparent)",
            mask: "radial-gradient(transparent 60%, black 62%)",
            WebkitMask: "radial-gradient(transparent 60%, black 62%)",
            animationDuration: "1.4s",
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={16} className="text-fuchsia-300 fill-fuchsia-300/40 sm:w-[18px] sm:h-[18px]" />
          </div>
        </div>
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-fuchsia-200/80 font-medium">
          {label || "Just a moment"}
        </p>
      </div>
    </div>
  );
}