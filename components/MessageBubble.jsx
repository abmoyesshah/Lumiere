import { memo } from "react";
import SafeImage from "./SafeImage";

const Avatar = memo(function Avatar({ src, name, onClick }) {
  return (
    <SafeImage
      src={src} name={name} onClick={onClick}
      className="w-7 h-7 sm:w-8 sm:h-8 border border-white/15 hover:border-fuchsia-400/50 transition flex-shrink-0"
      textClassName="text-fuchsia-300 text-xs font-semibold"
      iconSize={12}
    />
  );
});

const MessageBubble = memo(function MessageBubble({
  message, isOwn,
  userProfilePicture, matchProfilePicture,
  userName, matchName, onAvatarClick,
}) {
  return (
    <div className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && <Avatar src={matchProfilePicture} name={matchName} onClick={onAvatarClick} />}
      <div
        className={`max-w-[78%] sm:max-w-md px-4 py-2.5 text-sm leading-relaxed transition ${
          isOwn ? "text-white rounded-3xl rounded-br-md" : "text-white border border-white/[0.1] rounded-3xl rounded-bl-md"
        }`}
        style={isOwn
          ? { background: "linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #7c3aed 100%)", boxShadow: "0 8px 20px -6px rgba(168,85,247,0.5)" }
          : { background: "rgba(255,255,255,0.06)" }
        }
      >
        {message.text}
      </div>
      {isOwn && <Avatar src={userProfilePicture} name={userName} onClick={onAvatarClick} />}
    </div>
  );
});

export default MessageBubble;