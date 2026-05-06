"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Camera, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import SafeImage from "./SafeImage";

const ProfileInfoBar = memo(function ProfileInfoBar({ profileData, isOwnProfile = false, onEditClick }) {
  const router = useRouter();
  const { name, age, location, coverPhoto, profilePicture, _id } = profileData || {};

  return (
    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.06] w-full" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d946ef]/30 to-transparent" />
      <div className="relative h-32 sm:h-48 md:h-64 overflow-hidden" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
        {coverPhoto ? <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white/15" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0612] via-transparent to-transparent" />
      </div>
      <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="absolute -top-10 sm:-top-14 left-4 sm:left-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-[2px] bg-gradient-to-br from-[#d946ef] to-[#7c3aed]">
            <SafeImage src={profilePicture} name={name} className="w-full h-full" bgClassName="bg-[#1a0f2e]" textClassName="text-[#d946ef] font-serif text-2xl sm:text-3xl" iconSize={32} />
          </div>
        </div>
        <div className="pt-10 sm:pt-14 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-none truncate">
              {name}{age && <span className="font-light text-white/50 ml-1.5 text-lg sm:text-xl">{age}</span>}
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/50 mt-2 flex items-center gap-1 font-light truncate">
              <MapPin size={10} className="text-[#d946ef] flex-shrink-0" /> {location}
            </p>
          </div>
          <div className="flex-shrink-0">
            {isOwnProfile ? (
              <motion.button whileTap={{ scale: 0.97 }} onClick={onEditClick}
                className="text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium flex items-center gap-1.5"
                style={{ background: "linear-gradient(135deg, #d946ef, #a855f7)" }}>
                <Pencil size={11} /> Edit
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/chat?userId=${_id}`)}
                className="text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium flex items-center gap-1.5"
                style={{ background: "linear-gradient(135deg, #d946ef, #a855f7)" }}>
                <MessageCircle size={11} /> Message
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileInfoBar;