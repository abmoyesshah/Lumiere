"use client";
import { memo } from "react";
import ProfileCard from "./ProfileCard";

const CardStack = memo(function CardStack({ profiles, onCardClick }) {
  const positions = [
    { left: "calc(50% - 380px)", rotate: "-8deg", zIndex: 5 },
    { left: "calc(50% - 260px)", rotate: "-4deg", zIndex: 4 },
    { left: "calc(50% - 140px)", rotate: "0deg",  zIndex: 3 },
    { left: "calc(50% - 20px)",  rotate: "4deg",  zIndex: 2 },
    { left: "calc(50% + 100px)", rotate: "8deg",  zIndex: 1 },
  ];

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] max-w-7xl mx-auto mt-12 mb-16">
      <div className="relative flex justify-center scale-75 sm:scale-90 md:scale-100 origin-center">
        {profiles.slice(0, 5).map((profile, idx) => (
          <ProfileCard
            key={profile.id || idx} profile={profile}
            onClick={() => onCardClick(profile)}
            style={{ left: positions[idx].left, zIndex: positions[idx].zIndex, transform: `rotate(${positions[idx].rotate})` }}
            whileHover={{ y: -50, rotate: `${Number(positions[idx].rotate.replace("deg", "")) - 2}deg`, scale: 1.06, zIndex: 50 }}
          />
        ))}
      </div>
    </div>
  );
});

export default CardStack;