import { motion } from "framer-motion";
import { Video, Phone, Camera, Mic } from "lucide-react";

export default function CallSetupScreen({ onStartCall }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="max-w-md mx-auto"
    >
      <div className="relative bg-[#15082a]/60 border border-white/[0.08] rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent" />

        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 mx-auto mb-7"
        >
          <span className="absolute inset-0 rounded-full border border-[#d946ef]/30 animate-ping" />
          <div className="relative w-full h-full rounded-full border border-[#d946ef]/50 flex items-center justify-center">
            <Video className="w-7 h-7 text-[#d946ef]" />
          </div>
        </motion.div>

        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d946ef] font-light mb-3">
          Live · HD
        </p>
        <h1 className="font-serif text-3xl text-white mb-3 tracking-wide">
          Ready when you are
        </h1>
        <p className="text-sm text-white/50 mb-9 font-light">
          Connect face-to-face with your match
        </p>

        <motion.button
          whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
          onClick={onStartCall}
          className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white px-6 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-medium transition flex items-center justify-center gap-2"
        >
          <Phone size={14} />
          <span>Start Call</span>
        </motion.button>

        <div className="flex items-center justify-center gap-5 mt-6 text-[10px] uppercase tracking-[0.2em] text-white/40 font-light">
          <div className="flex items-center gap-1.5"><Camera size={11} className="text-[#d946ef]/60" /> HD Video</div>
          <span className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5"><Mic size={11} className="text-[#d946ef]/60" /> Clear Audio</div>
        </div>
      </div>
    </motion.div>
  );
}
