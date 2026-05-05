"use client";
import { useState, useMemo, memo } from "react";
import { User } from "lucide-react";

function ensureDataUrl(value) {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:image")) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) return trimmed;
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length > 50) {
    let mime = "image/jpeg";
    if (trimmed.startsWith("iVBORw0KGgo")) mime = "image/png";
    else if (trimmed.startsWith("R0lGODlh")) mime = "image/gif";
    return `data:${mime};base64,${trimmed}`;
  }
  return trimmed;
}

export function resolveImageSrc(input) {
  if (!input) return "";
  if (typeof input === "string") return ensureDataUrl(input);
  const directFields = [
    input.profilePhoto, input.profilePicture, input.picture,
    input.avatar, input.photo, input.image, input.coverPhoto,
  ];
  for (const field of directFields) {
    if (field && typeof field === "string" && field.trim()) {
      const result = ensureDataUrl(field);
      if (result) return result;
    }
  }
  if (Array.isArray(input.photos) && input.photos[0]) return ensureDataUrl(input.photos[0]);
  if (Array.isArray(input.images) && input.images[0]) return ensureDataUrl(input.images[0]);
  return "";
}

const SafeImage = memo(function SafeImage({
  src, user, name, alt, className = "", rounded = "rounded-full",
  iconSize = 18, bgClassName = "bg-[#1a0f2e]",
  textClassName = "text-fuchsia-300 font-serif",
  showInitial = true, loading = "lazy", onClick,
}) {
  const initialSrc = useMemo(() => resolveImageSrc(src) || resolveImageSrc(user), [src, user]);
  const displayName = name || user?.name || user?.fullName || user?.username || "";
  const initial = displayName?.trim()?.charAt(0)?.toUpperCase();
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showFallback = !initialSrc || errored;

  return (
    <div onClick={onClick}
      className={`relative overflow-hidden ${rounded} ${className} ${bgClassName} flex items-center justify-center ${onClick ? "cursor-pointer" : ""}`}>
      {!showFallback && (
        <img src={initialSrc} alt={alt || displayName || "avatar"}
          loading={loading} decoding="async" referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)} onError={() => setErrored(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} />
      )}
      {(showFallback || !loaded) && (
        <span className={`relative ${textClassName} flex items-center justify-center w-full h-full select-none`}>
          {showInitial && initial ? (
            <span style={{ fontSize: `calc(${typeof iconSize === "number" ? iconSize + 6 : 22}px)` }}>{initial}</span>
          ) : (
            <User size={iconSize} className="text-fuchsia-300/70" />
          )}
        </span>
      )}
    </div>
  );
});

export default SafeImage;