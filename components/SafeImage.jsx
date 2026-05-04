import { useState } from "react";
import { User } from "lucide-react";

function ensureDataUrl(value) {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("data:image")) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) return trimmed;
  // If it looks like Base64 (no spaces, typical length)
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length > 50) {
    let mime = "image/jpeg";
    if (trimmed.startsWith("iVBORw0KGgo")) mime = "image/png";
    else if (trimmed.startsWith("R0lGODlh")) mime = "image/gif";
    const dataUrl = `data:${mime};base64,${trimmed}`;
    console.log("✅ Converted Base64 to data URL (length", trimmed.length, ")");
    return dataUrl;
  }
  console.warn("❌ ensureDataUrl: unknown format", trimmed.substring(0, 50));
  return trimmed;
}

export function resolveImageSrc(input) {
  if (!input) return "";
  if (typeof input === "string") return ensureDataUrl(input);

  // DIRECT CHECK for common fields (profilePhoto first)
  const directFields = [
    input.profilePhoto,
    input.profilePicture,
    input.picture,
    input.avatar,
    input.photo,
    input.image,
    input.coverPhoto,
  ];
  for (const field of directFields) {
    if (field && typeof field === "string" && field.trim()) {
      const result = ensureDataUrl(field);
      if (result) return result;
    }
  }

  // Then check arrays
  if (Array.isArray(input.photos) && input.photos[0]) return ensureDataUrl(input.photos[0]);
  if (Array.isArray(input.images) && input.images[0]) return ensureDataUrl(input.images[0]);

  console.warn("No image source found in profile:", Object.keys(input));
  return "";
}

export default function SafeImage({ src, user, name, alt, className = "", rounded = "rounded-full", iconSize = 18, iconClassName = "text-[#c9a961]/70", bgClassName = "bg-[#1a1a1a]", textClassName = "text-[#c9a961] font-serif", showInitial = true, loading = "lazy", onClick }) {
  const initialSrc = resolveImageSrc(src) || resolveImageSrc(user);
  const displayName = name || user?.name || user?.fullName || user?.username || "";
  const initial = displayName?.trim()?.charAt(0)?.toUpperCase();
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showFallback = !initialSrc || errored;

  return (
    <div onClick={onClick} className={`relative overflow-hidden ${rounded} ${className} ${bgClassName} flex items-center justify-center ${onClick ? "cursor-pointer" : ""}`}>
      {!showFallback && (
        <img
          src={initialSrc}
          alt={alt || displayName || "avatar"}
          loading={loading}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={(e) => { console.error("Image failed to load:", initialSrc); setErrored(true); }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {(showFallback || !loaded) && (
        <span className={`relative ${textClassName} flex items-center justify-center w-full h-full select-none`}>
          {showInitial && initial ? (
            <span style={{ fontSize: `calc(${typeof iconSize === "number" ? iconSize + 6 : 22}px)` }}>{initial}</span>
          ) : (
            <User size={iconSize} className={iconClassName} />
          )}
        </span>
      )}
    </div>
  );
}