"use client";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

const PhotoLightbox = memo(function PhotoLightbox({ photo, onClose }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}
          onClick={onClose}>
          <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
            className="relative w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-lg overflow-hidden border border-white/10">
              <img src={photo} alt="Full size" className="w-full h-full object-contain max-h-[88vh]" />
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-light">Preview</span>
                <div className="flex items-center gap-2">
                  <a href={photo} download onClick={(e) => e.stopPropagation()}
                    className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-[#d946ef]">
                    <Download size={14} />
                  </a>
                  <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-[#d946ef]">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default PhotoLightbox;