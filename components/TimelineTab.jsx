"use client";
import { memo } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import SafeImage from "./SafeImage";

const PostActions = memo(function PostActions() {
  return (
    <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/[0.06] text-white/40">
      <button className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-light hover:text-[#d946ef]"><Heart size={11} /> Like</button>
      <button className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-light hover:text-[#d946ef]"><MessageCircle size={11} /> Comment</button>
      <button className="ml-auto hover:text-[#d946ef]"><Share2 size={11} /></button>
    </div>
  );
});

const TimelineTab = memo(function TimelineTab({ profileData, onPhotoClick }) {
  const { name, bio, profilePicture, timelinePhotos } = profileData;

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      {bio && (
        <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/[0.06]" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <SafeImage src={profilePicture} name={name} className="w-8 h-8 sm:w-10 sm:h-10 border border-white/10" textClassName="text-[#d946ef] font-serif text-sm sm:text-base" />
            <div>
              <h3 className="font-serif text-white text-sm sm:text-base">{name}</h3>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">Just now</p>
            </div>
          </div>
          <p className="font-light text-white/80 leading-relaxed text-sm sm:text-[15px]">{bio}</p>
          <PostActions />
        </div>
      )}
      {timelinePhotos?.map((photo, index) => (
        <div key={index} className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/[0.06]" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <SafeImage src={profilePicture} name={name} className="w-8 h-8 sm:w-10 sm:h-10 border border-white/10" textClassName="text-[#d946ef] font-serif text-sm sm:text-base" />
            <div>
              <h3 className="font-serif text-white text-sm sm:text-base">{name}</h3>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">Shared a moment</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <img src={photo} alt="" className="w-full cursor-pointer" onClick={() => onPhotoClick(photo)} loading="lazy" />
          </div>
          <PostActions />
        </div>
      ))}
    </div>
  );
});

export default TimelineTab;