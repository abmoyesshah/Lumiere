"use client";
import { memo } from "react";
import { User, Heart, Briefcase, GraduationCap, Ruler, Moon, Cigarette, Wine, Dumbbell, Utensils, PawPrint, Baby, Globe } from "lucide-react";

const InfoField = memo(function InfoField({ label, value, icon }) {
  return (
    <div className="border border-white/[0.06] hover:border-[#d946ef]/30 rounded-lg p-3 sm:p-4 transition" style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/40 font-light flex items-center gap-1.5 mb-1.5">
        <span className="text-[#d946ef]/70 flex-shrink-0">{icon}</span>{label}
      </p>
      <p className="font-serif text-sm sm:text-base text-white capitalize truncate">{value}</p>
    </div>
  );
});

const AboutTab = memo(function AboutTab({ profileData }) {
  const { gender, relationshipGoal, occupation, education, interests, height, zodiacSign, smoking, drinking, workout, diet, pets, kids, languages } = profileData;

  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-6 border border-white/[0.06] w-full" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
      <div>
        <h3 className="font-serif text-lg sm:text-xl text-white mb-3 sm:mb-4">Basics</h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          {gender && <InfoField label="Gender" value={gender} icon={<User size={10} />} />}
          {relationshipGoal && <InfoField label="Looking for" value={relationshipGoal} icon={<Heart size={10} />} />}
          {occupation && <InfoField label="Work" value={occupation} icon={<Briefcase size={10} />} />}
          {education && <InfoField label="Education" value={education} icon={<GraduationCap size={10} />} />}
        </div>
      </div>
      {interests?.length > 0 && (
        <div>
          <h3 className="font-serif text-lg sm:text-xl text-white mb-3 sm:mb-4">Interests</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {interests.map((interest, idx) => (
              <span key={idx} className="border border-white/10 hover:border-[#d946ef]/40 text-white/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-light">{interest}</span>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="font-serif text-lg sm:text-xl text-white mb-3 sm:mb-4">Lifestyle</h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          {height && <InfoField label="Height" value={height} icon={<Ruler size={10} />} />}
          {zodiacSign && <InfoField label="Zodiac" value={zodiacSign} icon={<Moon size={10} />} />}
          {smoking && smoking !== "prefer not to say" && <InfoField label="Smoking" value={smoking} icon={<Cigarette size={10} />} />}
          {drinking && drinking !== "prefer not to say" && <InfoField label="Drinking" value={drinking} icon={<Wine size={10} />} />}
          {workout && <InfoField label="Workout" value={workout} icon={<Dumbbell size={10} />} />}
          {diet && <InfoField label="Diet" value={diet} icon={<Utensils size={10} />} />}
          {pets && <InfoField label="Pets" value={pets} icon={<PawPrint size={10} />} />}
          {kids && kids !== "prefer not to say" && <InfoField label="Kids" value={kids} icon={<Baby size={10} />} />}
          {languages?.length > 0 && <InfoField label="Languages" value={languages.join(", ")} icon={<Globe size={10} />} />}
        </div>
      </div>
    </div>
  );
});

export default AboutTab;