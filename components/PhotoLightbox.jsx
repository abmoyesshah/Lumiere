"use client";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PhotoLightbox = memo(function PhotoLightbox({ photo, onClose }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}
          onClick={onClose}>
          <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
            className="relative w-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={photo} alt="" className="w-full h-full object-contain max-h-[85vh] rounded-lg" />
            <button onClick={onClose}
              className="absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-[#d946ef]"
              style={{ background: "#0a0612" }}>
              <X size={14} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default PhotoLightbox;