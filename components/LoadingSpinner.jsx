import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import React from "react";

const SpinnerContent = React.memo(function SpinnerContent({ label }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-white/[0.08]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, #d946ef 30%, #a855f7 60%, transparent 100%)",
            mask: "radial-gradient(transparent 60%, black 62%)",
            WebkitMask: "radial-gradient(transparent 60%, black 62%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart size={18} className="text-fuchsia-300 fill-fuchsia-300/40" />
        </div>
      </div>
      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-fuchsia-200/80 font-medium">
        {label || "Just a moment"}
      </p>
    </div>
  );
});

export default function LoadingSpinner({ variant = "default", label, show = true }) {
  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-2 text-fuchsia-300">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-fuchsia-400/25 border-t-fuchsia-400 animate-spin" />
        {label && <span className="text-xs tracking-wider uppercase">{label}</span>}
      </span>
    );
  }

  if (variant === "overlay") {
    if (!show) return null;
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(10,6,18,0.85)", backdropFilter: "blur(16px)" }}
      >
        <SpinnerContent label={label} />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0612" }}>
      <SpinnerContent label={label} />
    </div>
  );
}