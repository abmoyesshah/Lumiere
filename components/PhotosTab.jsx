"use client";
import { memo } from "react";
import { motion } from "framer-motion";

const PhotosTab = memo(function PhotosTab({ photos, onPhotoClick }) {
  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/[0.06] w-full" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-serif text-lg sm:text-xl text-white">Gallery</h3>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">{photos?.length ?? 0} photos</span>
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3">
        {photos?.map((photo, index) => (
          <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.02 }}
            className="relative group overflow-hidden rounded-lg cursor-pointer border border-white/[0.06] hover:border-[#d946ef]/40 aspect-square"
            onClick={() => onPhotoClick(photo)}>
            <img src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default PhotosTab;