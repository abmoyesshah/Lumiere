import { motion } from "framer-motion";

export default function PhotosTab({ photos, onPhotoClick }) {
  return (
    <div className="bg-[#15082a]/60 border border-white/[0.06] rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl text-white tracking-wide">Gallery</h3>
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">
          {photos?.length ?? 0} photos
        </span>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2.5 sm:gap-3">
        {photos?.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ scale: 1.02 }}
            className="relative group overflow-hidden rounded-lg cursor-pointer border border-white/[0.06] hover:border-[#d946ef]/40 transition"
            onClick={() => onPhotoClick(photo)}
          >
            <img src={photo} alt={`Photo ${index + 1}`}
              className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
