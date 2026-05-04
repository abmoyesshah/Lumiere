import { Heart, MessageCircle, Share2 } from "lucide-react";
import SafeImage from "./SafeImage";

function PostHeader({ name, profilePicture, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <SafeImage src={profilePicture} name={name}
        className="w-10 h-10 border border-white/10"
        textClassName="text-[#d946ef] font-serif text-base" />
      <div>
        <h3 className="font-serif text-white text-base tracking-wide">{name}</h3>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function PostActions() {
  return (
    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06] text-white/40">
      <button className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-light hover:text-[#d946ef] transition">
        <Heart size={13} /> Like
      </button>
      <button className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-light hover:text-[#d946ef] transition">
        <MessageCircle size={13} /> Comment
      </button>
      <button className="ml-auto hover:text-[#d946ef] transition">
        <Share2 size={13} />
      </button>
    </div>
  );
}

export default function TimelineTab({ profileData, onPhotoClick }) {
  const { name, bio, profilePicture, timelinePhotos } = profileData;

  return (
    <div className="space-y-4">
      {bio && (
        <div className="bg-[#15082a]/60 border border-white/[0.06] rounded-2xl p-6">
          <PostHeader name={name} profilePicture={profilePicture} subtitle="Just now" />
          <p className="font-light text-white/80 leading-relaxed text-[15px]">{bio}</p>
          <PostActions />
        </div>
      )}

      {timelinePhotos?.map((photo, index) => (
        <div key={index} className="bg-[#15082a]/60 border border-white/[0.06] rounded-2xl p-6">
          <PostHeader name={name} profilePicture={profilePicture} subtitle="Shared a moment" />
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <img src={photo} alt={`Post ${index + 1}`}
              className="w-full cursor-pointer hover:scale-[1.02] transition-transform duration-700"
              onClick={() => onPhotoClick(photo)} />
          </div>
          <PostActions />
        </div>
      ))}
    </div>
  );
}
