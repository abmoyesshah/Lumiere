"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { Video, Phone, Camera, Mic } from "lucide-react";

const CallSetupScreen = memo(function CallSetupScreen({ onStartCall }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto px-4">
      <div className="relative rounded-2xl p-6 sm:p-10 text-center overflow-hidden border border-white/[0.08]" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-7">
          <span className="absolute inset-0 rounded-full border border-[#d946ef]/30 animate-ping" />
          <div className="relative w-full h-full rounded-full border border-[#d946ef]/50 flex items-center justify-center">
            <Video className="w-6 h-6 sm:w-7 sm:h-7 text-[#d946ef]" />
          </div>
        </div>
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[#d946ef] font-light mb-2">Live · HD</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">Ready when you are</h1>
        <p className="text-xs sm:text-sm text-white/50 mb-6 sm:mb-8 font-light">Connect face-to-face with your match</p>
        <motion.button whileTap={{ scale: 0.98 }} onClick={onStartCall}
          className="w-full text-white px-6 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
          <Phone size={13} /> Start Call
        </motion.button>
        <div className="flex items-center justify-center gap-4 mt-5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-light">
          <span className="flex items-center gap-1"><Camera size={10} className="text-[#d946ef]/60" /> HD</span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1"><Mic size={10} className="text-[#d946ef]/60" /> Clear</span>
        </div>
      </div>
    </motion.div>
  );
});

export default CallSetupScreen;