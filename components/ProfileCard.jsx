// "use client";
// import { memo } from "react";
// import { motion } from "framer-motion";
// import { MapPin, Heart, X, Sparkles, Star } from "lucide-react";
// import SafeImage, { resolveImageSrc } from "./SafeImage";

// const ProfileCard = memo(function ProfileCard({
//   profile, onClick, style, whileHover,
//   showPassLike = false, onPass, onLike, variant = "stack",
// }) {
//   const { name, age, location, matchScore, interests, bio } = profile;
//   const picture = resolveImageSrc(profile);
//   const isFull = variant === "full" || showPassLike;
//   const sizing = isFull
//     ? "w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] md:max-w-[480px] mx-auto"
//     : "w-52 xs:w-60 sm:w-64 md:w-72 lg:w-80 absolute";

//   return (
//     <motion.div whileHover={whileHover} transition={{ type: "spring", stiffness: 220, damping: 22 }}
//       className={`${sizing} rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 group`}
//       style={{ ...style, background: "linear-gradient(160deg, #1e0f32, #0f081c)" }}
//       onClick={onClick}>
//       <div className={`relative ${isFull ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
//         <SafeImage src={picture} name={name} alt={name} rounded="rounded-none" className="w-full h-full"
//           bgClassName="bg-violet-950/50" textClassName="text-fuchsia-300 text-5xl sm:text-7xl font-light" iconSize={40} loading="eager" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
//         <div className="absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

//         {matchScore && (
//           <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15"
//             style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
//             <Sparkles size={10} className="text-white" />
//             <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-white font-semibold">{matchScore}% match</span>
//           </div>
//         )}

//         <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/15"
//           style={{ background: "linear-gradient(135deg, #0f081c, #1a0f2e)" }}>
//           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
//           <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white font-semibold">Online</span>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
//           <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
//             {name} <span className="text-white/65 font-light text-lg sm:text-xl">{age}</span>
//           </h2>
//           <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-fuchsia-200 font-semibold flex items-center gap-1 mt-1">
//             <MapPin size={9} className="text-fuchsia-300 flex-shrink-0" /> <span className="truncate">{location}</span>
//           </p>
//           {isFull && bio && <p className="text-[11px] sm:text-xs text-white/75 mt-1.5 line-clamp-2 leading-relaxed font-light">{bio}</p>}
//           {isFull && interests?.length > 0 && (
//             <div className="flex flex-wrap gap-1 mt-2">
//               {interests.slice(0, 4).map((interest, i) => (
//                 <span key={i} className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-white border border-white/20 px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
//                   style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>{interest}</span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {!isFull && interests?.length > 0 && (
//         <div className="p-2 sm:p-3 border-t border-white/[0.06]" style={{ background: "linear-gradient(180deg, #0f081c, #1a0f2e)" }}>
//           <div className="flex flex-wrap gap-1">
//             {interests.slice(0, 3).map((interest, i) => (
//               <span key={i} className="text-[8px] uppercase tracking-[0.15em] text-white/70 border border-white/15 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{interest}</span>
//             ))}
//           </div>
//         </div>
//       )}

//       {showPassLike && (
//         <div className="px-4 py-2 sm:py-2.5 border-t border-white/[0.06] flex items-center justify-center gap-3 sm:gap-4"
//           style={{ background: "linear-gradient(180deg, #0f081c, #0a0612)" }}>
//           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//             onClick={(e) => { e.stopPropagation(); onPass?.(); }}
//             className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-white/40 text-white/70 flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
//             <X size={18} strokeWidth={2} />
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//             onClick={(e) => e.stopPropagation()}
//             className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-fuchsia-400/30 flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg, #d946ef, #a855f7)" }}>
//             <Star size={12} strokeWidth={2} className="fill-white text-white" />
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//             onClick={(e) => { e.stopPropagation(); onLike?.(); }}
//             className="w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
//             <Heart size={18} strokeWidth={2} className="fill-white" />
//           </motion.button>
//         </div>
//       )}
//     </motion.div>
//   );
// });

// export default ProfileCard;

"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Heart, X, Sparkles, Star } from "lucide-react";
import SafeImage, { resolveImageSrc } from "./SafeImage";

const ProfileCard = memo(function ProfileCard({
  profile, onClick, style, whileHover,
  showPassLike = false, onPass, onLike, variant = "stack",
}) {
  const { name, age, location, matchScore, interests, bio } = profile;
  const picture = resolveImageSrc(profile);
  const isFull = variant === "full" || showPassLike;
  const sizing = isFull
    ? "w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] md:max-w-[480px] mx-auto"
    : "w-52 xs:w-60 sm:w-64 md:w-72 lg:w-80 absolute";

  const handleDragEnd = (event, info) => {
    const threshold = 80;
    if (info.offset.x < -threshold) {
      // Swiped left = pass
      onPass?.();
    } else if (info.offset.x > threshold) {
      // Swiped right = like
      onLike?.();
    }
  };

  return (
    <motion.div
      whileHover={whileHover}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`${sizing} rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 group`}
      style={{ ...style, background: "linear-gradient(160deg, #1e0f32, #0f081c)" }}
      onClick={onClick}
      drag={showPassLike ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03, rotate: 0 }}
    >
      <div className={`relative ${isFull ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
        <SafeImage src={picture} name={name} alt={name} rounded="rounded-none" className="w-full h-full"
          bgClassName="bg-violet-950/50" textClassName="text-fuchsia-300 text-5xl sm:text-7xl font-light" iconSize={40} loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {matchScore && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15"
            style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
            <Sparkles size={10} className="text-white" />
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-white font-semibold">{matchScore}% match</span>
          </div>
        )}

        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/15"
          style={{ background: "linear-gradient(135deg, #0f081c, #1a0f2e)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white font-semibold">Online</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
            {name} <span className="text-white/65 font-light text-lg sm:text-xl">{age}</span>
          </h2>
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-fuchsia-200 font-semibold flex items-center gap-1 mt-1">
            <MapPin size={9} className="text-fuchsia-300 flex-shrink-0" /> <span className="truncate">{location}</span>
          </p>
          {isFull && bio && <p className="text-[11px] sm:text-xs text-white/75 mt-1.5 line-clamp-2 leading-relaxed font-light">{bio}</p>}
          {isFull && interests?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {interests.slice(0, 4).map((interest, i) => (
                <span key={i} className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-white border border-white/20 px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>{interest}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isFull && interests?.length > 0 && (
        <div className="p-2 sm:p-3 border-t border-white/[0.06]" style={{ background: "linear-gradient(180deg, #0f081c, #1a0f2e)" }}>
          <div className="flex flex-wrap gap-1">
            {interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="text-[8px] uppercase tracking-[0.15em] text-white/70 border border-white/15 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{interest}</span>
            ))}
          </div>
        </div>
      )}

      {showPassLike && (
        <div className="px-4 py-2 sm:py-2.5 border-t border-white/[0.06] flex items-center justify-center gap-3 sm:gap-4"
          style={{ background: "linear-gradient(180deg, #0f081c, #0a0612)" }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onPass?.(); }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-white/40 text-white/70 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
            <X size={18} strokeWidth={2} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-fuchsia-400/30 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d946ef, #a855f7)" }}>
            <Star size={12} strokeWidth={2} className="fill-white text-white" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onLike?.(); }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
            <Heart size={18} strokeWidth={2} className="fill-white" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
});

export default ProfileCard;


// "use client";
// import { memo } from "react";
// import { motion } from "framer-motion";
// import { MapPin, Heart, X, Sparkles, Star } from "lucide-react";
// import SafeImage, { resolveImageSrc } from "./SafeImage";

// const ProfileCard = memo(function ProfileCard({
//   profile, onClick, style, whileHover,
//   showPassLike = false, onPass, onLike, variant = "stack",
// }) {
//   const { name, age, location, matchScore, interests, bio } = profile;
//   const picture = resolveImageSrc(profile);
//   const isFull = variant === "full" || showPassLike;
//   const sizing = isFull
//     ? "w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] md:max-w-[480px] mx-auto"
//     : "w-52 xs:w-60 sm:w-64 md:w-72 lg:w-80 absolute";

//   return (
//     <motion.div whileHover={whileHover} transition={{ type: "spring", stiffness: 220, damping: 22 }}
//       className={`${sizing} rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 group`}
//       style={{ ...style, background: "linear-gradient(160deg, #1e0f32, #0f081c)" }}
//       onClick={onClick}>
//       <div className={`relative ${isFull ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
//         <SafeImage src={picture} name={name} alt={name} rounded="rounded-none" className="w-full h-full"
//           bgClassName="bg-violet-950/50" textClassName="text-fuchsia-300 text-5xl sm:text-7xl font-light" iconSize={40} loading="eager" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
//         <div className="absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

//         {matchScore && (
//           <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15"
//             style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
//             <Sparkles size={10} className="text-white" />
//             <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-white font-semibold">{matchScore}% match</span>
//           </div>
//         )}

//         <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/15"
//           style={{ background: "linear-gradient(135deg, #0f081c, #1a0f2e)" }}>
//           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
//           <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white font-semibold">Online</span>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-7 text-white">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
//             {name} <span className="text-white/65 font-light">{age}</span>
//           </h2>
//           <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-fuchsia-200 font-semibold flex items-center gap-1 mt-1.5 sm:mt-2">
//             <MapPin size={10} className="text-fuchsia-300 flex-shrink-0" /> <span className="truncate">{location}</span>
//           </p>
//           {isFull && bio && <p className="text-xs sm:text-sm text-white/75 mt-2 sm:mt-3 line-clamp-2 leading-relaxed font-light">{bio}</p>}
//           {isFull && interests?.length > 0 && (
//             <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-3 sm:mt-4">
//               {interests.slice(0, 4).map((interest, i) => (
//                 <span key={i} className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] text-white border border-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap"
//                   style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>{interest}</span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {!isFull && interests?.length > 0 && (
//         <div className="p-3 sm:p-4 border-t border-white/[0.06]" style={{ background: "linear-gradient(180deg, #0f081c, #1a0f2e)" }}>
//           <div className="flex flex-wrap gap-1">
//             {interests.slice(0, 3).map((interest, i) => (
//               <span key={i} className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] text-white/70 border border-white/15 px-2 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap">{interest}</span>
//             ))}
//           </div>
//         </div>
//       )}

//       {showPassLike && (
//         <div className="px-4 sm:px-5 py-4 sm:py-5 border-t border-white/[0.06] flex items-center justify-center gap-3 sm:gap-5"
//           style={{ background: "linear-gradient(180deg, #0f081c, #0a0612)" }}>
//           <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
//             onClick={(e) => { e.stopPropagation(); onPass?.(); }}
//             className="w-12 h-12 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-full border border-white/20 hover:border-white/40 text-white/80 flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
//             <X size={22} strokeWidth={2} className="w-5 h-5 sm:w-6 sm:h-6" />
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
//             onClick={(e) => e.stopPropagation()}
//             className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg, #d946ef, #a855f7)" }}>
//             <Star size={16} strokeWidth={2} className="w-4 h-4 sm:w-5 sm:h-5 fill-fuchsia-300" />
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
//             onClick={(e) => { e.stopPropagation(); onLike?.(); }}
//             className="w-14 h-14 sm:w-20 sm:h-20 md:w-[88px] md:h-[88px] rounded-full text-white flex items-center justify-center"
//             style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
//             <Heart size={24} strokeWidth={2} className="w-6 h-6 sm:w-8 sm:h-8 fill-white" />
//           </motion.button>
//         </div>
//       )}
//     </motion.div>
//   );
// });

// export default ProfileCard;