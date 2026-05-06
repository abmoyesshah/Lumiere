"use client";
import { memo } from "react";
import ProfileCard from "./ProfileCard";

const CardStack = memo(function CardStack({ profiles, onCardClick }) {
  const positions = [
    { left: "calc(50% - 280px)", rotate: "-6deg", zIndex: 5 },
    { left: "calc(50% - 180px)", rotate: "-3deg", zIndex: 4 },
    { left: "calc(50% - 80px)",  rotate: "0deg",  zIndex: 3 },
    { left: "calc(50% + 20px)",  rotate: "3deg",  zIndex: 2 },
    { left: "calc(50% + 120px)", rotate: "6deg",  zIndex: 1 },
  ];

  return (
    <div className="relative h-[350px] sm:h-[450px] md:h-[550px] w-full max-w-5xl mx-auto mt-8 sm:mt-12 mb-12 overflow-x-hidden">
      <div className="relative flex justify-center scale-[0.6] xs:scale-75 sm:scale-90 md:scale-100 origin-center">
        {profiles.slice(0, 5).map((profile, idx) => (
          <ProfileCard key={profile.id || idx} profile={profile} onClick={() => onCardClick(profile)}
            style={{ left: positions[idx].left, zIndex: positions[idx].zIndex, transform: `rotate(${positions[idx].rotate})` }}
            whileHover={{ y: -30, scale: 1.05, zIndex: 50 }} />
        ))}
      </div>
    </div>
  );
});

export default CardStack;