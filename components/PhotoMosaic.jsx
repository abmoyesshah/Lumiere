import { motion } from "framer-motion";
import { resolveImageSrc } from "./SafeImage";
import { Heart } from "lucide-react";

/**
 * Premium editorial photo mosaic — purple/pink theme.
 */
export default function PhotoMosaic({ profiles = [], onPhotoClick }) {
  const patterns = [
    "col-span-2 row-span-2 aspect-square",
    "col-span-1 row-span-1 aspect-[3/4]",
    "col-span-1 row-span-1 aspect-[3/4]",
    "col-span-1 row-span-2 aspect-[3/5]",
    "col-span-2 row-span-1 aspect-[2/1]",
    "col-span-1 row-span-1 aspect-[3/4]",
    "col-span-1 row-span-1 aspect-[3/4]",
    "col-span-1 row-span-1 aspect-[3/4]",
    "col-span-2 row-span-2 aspect-square",
    "col-span-1 row-span-1 aspect-[3/4]",
    "col-span-1 row-span-2 aspect-[3/5]",
    "col-span-1 row-span-1 aspect-[3/4]",
  ];

  return (
    <div className="relative max-w-7xl mx-auto mt-14 sm:mt-20 mb-20 px-1 sm:px-0">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 bg-gradient-to-t from-violet-500/15 to-transparent blur-3xl" />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 auto-rows-[90px] sm:auto-rows-[120px] md:auto-rows-[140px] gap-2 sm:gap-3">
        {profiles.map((profile, idx) => {
          const cls = patterns[idx % patterns.length];
          const src = resolveImageSrc(profile);
          const isHero = cls.includes("col-span-2 row-span-2");
          return (
            <motion.button
              key={profile.id || idx}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: (idx % 8) * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              onClick={() => onPhotoClick?.(profile)}
              className={`relative overflow-hidden rounded-3xl group ${cls} bg-violet-950/40 border border-white/[0.08]`}
              style={{ boxShadow: "0 20px 50px -20px rgba(139,92,246,0.35)" }}
            >
              {src ? (
                <img
                  src={src} alt={profile.name || "member"} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-fuchsia-300 text-3xl font-light">
                  {(profile.name || "?").charAt(0)}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-purple-950/30 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Always-visible name on hero */}
              {isHero && profile.name && (
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-white text-base sm:text-xl font-semibold tracking-tight leading-tight">
                    {profile.name}
                    {profile.age && <span className="text-white/70 font-light ml-1.5">{profile.age}</span>}
                  </p>
                  {profile.location && (
                    <p className="text-[10px] uppercase tracking-[0.22em] text-fuchsia-300 font-medium mt-1">
                      {profile.location}
                    </p>
                  )}
                </div>
              )}

              {/* On hover for small */}
              {!isHero && profile.name && (
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white text-xs sm:text-sm font-medium tracking-tight">
                    {profile.name}
                    {profile.age && <span className="text-white/60 font-light ml-1">{profile.age}</span>}
                  </p>
                </div>
              )}

              {isHero && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Heart size={9} className="text-fuchsia-300 fill-fuchsia-300" />
                  <span className="text-[8px] uppercase tracking-[0.25em] text-white font-medium">Featured</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
