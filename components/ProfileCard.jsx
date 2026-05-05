import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Heart, X, Sparkles, Star } from "lucide-react";
import SafeImage, { resolveImageSrc } from "./SafeImage";

const ProfileCard = memo(function ProfileCard({
  profile, onClick, style, whileHover,
  showPassLike = false, onPass, onLike,
  variant = "stack",
}) {
  const { name, age, location, matchScore, interests, bio } = profile;
  const picture = resolveImageSrc(profile);

  const isFull = variant === "full" || showPassLike;

  const sizing = isFull
    ? "w-full max-w-[440px] sm:max-w-[480px] md:max-w-[520px] mx-auto"
    : "w-64 sm:w-72 md:w-80 absolute";

  return (
    <motion.div
      whileHover={whileHover}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`${sizing} rounded-[2rem] overflow-hidden cursor-pointer transform-gpu border border-white/10 group`}
      style={{
        ...style,
        background: "linear-gradient(160deg, rgba(30,15,50,0.6), rgba(15,8,28,0.9))",
        boxShadow: "0 40px 80px -25px rgba(168,85,247,0.45), 0 0 0 1px rgba(217,70,239,0.08)",
      }}
      onClick={onClick}
    >
      <div className={`relative ${isFull ? "aspect-[3/4.2] sm:aspect-[3/4]" : "aspect-[3/4]"}`}>
        <SafeImage
          src={picture} name={name} alt={name}
          rounded="rounded-none"
          className="w-full h-full"
          bgClassName="bg-violet-950/50"
          textClassName="text-fuchsia-300 text-7xl sm:text-8xl font-light"
          iconSize={56}
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {matchScore && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/15"
            style={{ background: "linear-gradient(135deg, rgba(217,70,239,0.85), rgba(124,58,237,0.85))" }}>
            <Sparkles size={11} className="text-white" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-white font-semibold">{matchScore}% match</span>
          </div>
        )}

        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/55 backdrop-blur-md rounded-full border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white font-semibold">Online</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight drop-shadow-lg">
            {name} <span className="text-white/65 font-light">{age}</span>
          </h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-fuchsia-200 font-semibold flex items-center gap-1.5 mt-2">
            <MapPin size={11} className="text-fuchsia-300" /> {location}
          </p>
          {isFull && bio && <p className="text-sm text-white/75 mt-3 line-clamp-2 leading-relaxed font-light">{bio}</p>}
          {isFull && interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {interests.slice(0, 4).map((interest, i) => (
                <span key={i} className="text-[10px] uppercase tracking-[0.18em] text-white bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full font-medium">{interest}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isFull && interests?.length > 0 && (
        <div className="p-4 sm:p-5 border-t border-white/[0.06]" style={{ background: "rgba(15,8,28,0.6)" }}>
          <div className="flex flex-wrap gap-1.5">
            {interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="text-[10px] uppercase tracking-[0.15em] text-white/70 border border-white/15 px-2.5 py-1 rounded-full font-medium">{interest}</span>
            ))}
          </div>
        </div>
      )}

      {showPassLike && (
        <div className="p-5 sm:p-6 border-t border-white/[0.06] flex items-center justify-center gap-5" style={{ background: "rgba(15,8,28,0.7)" }}>
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); onPass?.(); }}
            className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/80 flex items-center justify-center transition"
            aria-label="Pass"
          >
            <X size={26} strokeWidth={2} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.92 }}
            onClick={(e) => e.stopPropagation()}
            className="w-14 h-14 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500/20 flex items-center justify-center transition"
            aria-label="Super like"
          >
            <Star size={20} strokeWidth={2} className="fill-fuchsia-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); onLike?.(); }}
            className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full text-white flex items-center justify-center transition"
            style={{
              background: "linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #7c3aed 100%)",
              boxShadow: "0 18px 40px -10px rgba(217,70,239,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
            aria-label="Like"
          >
            <Heart size={32} strokeWidth={2} className="fill-white" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
});

export default ProfileCard;