"use client";
import { memo } from "react";
import { MapPin } from "lucide-react";
import SafeImage from "./SafeImage";

const MatchListItem = memo(function MatchListItem({ match, selected, onSelect, onViewProfile }) {
  return (
    <div className={`w-full px-3 sm:px-5 py-3 cursor-pointer transition-all border-l-2 ${
      selected ? "border-fuchsia-400" : "border-transparent hover:bg-white/[0.03]"
    }`} style={selected ? { background: "linear-gradient(90deg, #1e0f32, #0f081c)" } : undefined}>
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0" onClick={(e) => { e.stopPropagation(); onViewProfile(match); }}>
          <SafeImage user={match} name={match.name}
            className="w-10 h-10 sm:w-12 sm:h-12 border border-white/10 hover:border-fuchsia-400/40 transition"
            textClassName="text-fuchsia-300 font-semibold text-base sm:text-xl" />
          <span className="absolute bottom-0.5 right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f0820]" />
        </div>
        <div className="flex-1 min-w-0" onClick={() => onSelect(match)}>
          <h3 className="text-white text-sm sm:text-base font-semibold truncate">
            {match.name}<span className="text-white/50 font-light ml-1">{match.age}</span>
          </h3>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/45 truncate flex items-center gap-1 mt-0.5 font-medium">
            <MapPin size={9} className="text-fuchsia-300/80 flex-shrink-0" /> {match.location}
          </p>
        </div>
      </div>
    </div>
  );
});

export default MatchListItem;