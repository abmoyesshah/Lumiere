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
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]"
      style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d946ef]/30 to-transparent" />
      <div className="relative h-44 sm:h-64 md:h-80 overflow-hidden" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
        {coverPhoto ? (
          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Camera className="w-10 h-10 text-white/15" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0612] via-transparent to-transparent" />
      </div>
      <div className="relative px-5 sm:px-8 pb-6">
        <div className="absolute -top-14 sm:-top-16 left-5 sm:left-8">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[2px] bg-gradient-to-br from-[#d946ef] to-[#7c3aed]">
            <SafeImage src={profilePicture} name={name} className="w-full h-full"
              bgClassName="bg-[#1a0f2e]" textClassName="text-[#d946ef] font-serif text-4xl" iconSize={40} />
          </div>
        </div>
        <div className="pt-14 sm:pt-20 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-wide leading-none">
              {name}{age && <span className="font-light text-white/50 ml-2">{age}</span>}
            </h1>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mt-3 flex items-center gap-1.5 font-light">
              <MapPin size={11} className="text-[#d946ef]" /> {location}
            </p>
          </div>
          <div>
            {isOwnProfile ? (
              <motion.button whileTap={{ scale: 0.97 }} onClick={onEditClick}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium flex items-center gap-2">
                <Pencil size={12} /> Edit
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push(`/chat?userId=${_id}`)}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium flex items-center gap-2">
                <MessageCircle size={12} /> Message
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileInfoBar;