import { memo } from "react";
import { MapPin } from "lucide-react";
import SafeImage from "./SafeImage";

const MatchListItem = memo(function MatchListItem({ match, selected, onSelect, onViewProfile }) {
  return (
    <div
      className={`group relative w-full px-4 sm:px-5 py-3.5 cursor-pointer transition-all border-l-2 ${
        selected ? "bg-fuchsia-500/[0.06] border-fuchsia-400" : "border-transparent hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative flex-shrink-0" onClick={(e) => { e.stopPropagation(); onViewProfile(match); }}>
          <SafeImage
            user={match} name={match.name}
            className="w-12 h-12 sm:w-14 sm:h-14 border border-white/10 hover:border-fuchsia-400/40 transition"
            textClassName="text-fuchsia-300 font-semibold text-xl"
          />
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f0820]" />
        </div>
        <div className="flex-1 min-w-0" onClick={() => onSelect(match)}>
          <h3 className="text-white text-base sm:text-lg font-semibold truncate tracking-tight">
            {match.name}
            <span className="text-white/50 font-light ml-1.5">{match.age}</span>
          </h3>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 truncate flex items-center gap-1 mt-1 font-medium">
            <MapPin size={10} className="text-fuchsia-300/80" /> {match.location}
          </p>
        </div>
      </div>
    </div>
  );
});

export default MatchListItem;