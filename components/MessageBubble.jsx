"use client";
import { memo } from "react";
import SafeImage from "./SafeImage";

const Avatar = memo(function Avatar({ src, name, onClick }) {
  return (
    <SafeImage src={src} name={name} onClick={onClick}
      className="w-6 h-6 sm:w-7 sm:h-7 border border-white/15 hover:border-fuchsia-400/50 transition flex-shrink-0"
      textClassName="text-fuchsia-300 text-[10px] font-semibold" iconSize={10} />
  );
});

const MessageBubble = memo(function MessageBubble({
  message, isOwn, userProfilePicture, matchProfilePicture,
  userName, matchName, onAvatarClick,
}) {
  return (
    <div className={`flex items-end gap-1.5 sm:gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && <Avatar src={matchProfilePicture} name={matchName} onClick={onAvatarClick} />}
      <div className={`max-w-[75%] sm:max-w-[70%] md:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm leading-relaxed break-words ${
        isOwn ? "text-white rounded-2xl sm:rounded-3xl rounded-br-md" : "text-white border border-white/[0.1] rounded-2xl sm:rounded-3xl rounded-bl-md"
      }`}
        style={isOwn
          ? { background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }
          : { background: "linear-gradient(135deg, #1e0f32, #0f081c)" }
        }>
        {message.text}
      </div>
      {isOwn && <Avatar src={userProfilePicture} name={userName} onClick={onAvatarClick} />}
    </div>
  );
});

export default MessageBubble;