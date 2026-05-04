import {
  User, Heart, Briefcase, GraduationCap, Ruler, Moon,
  Cigarette, Wine, Dumbbell, Utensils, PawPrint, Baby, Globe,
} from "lucide-react";

function InfoField({ label, value, icon }) {
  return (
    <div className="border border-white/[0.06] hover:border-[#d946ef]/30 rounded-lg p-4 transition group">
      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light flex items-center gap-1.5 mb-2">
        <span className="text-[#d946ef]/70">{icon}</span>
        {label}
      </p>
      <p className="font-serif text-base text-white capitalize">{value}</p>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="font-serif text-xl text-white tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

export default function AboutTab({ profileData }) {
  const {
    gender, relationshipGoal, occupation, education, interests,
    height, zodiacSign, smoking, drinking, workout, diet, pets, kids, languages,
  } = profileData;

  return (
    <div className="bg-[#15082a]/60 border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-8">
      <div>
        <SectionHeader title="Basics" />
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          {gender && <InfoField label="Gender" value={gender} icon={<User size={11} />} />}
          {relationshipGoal && <InfoField label="Looking for" value={relationshipGoal} icon={<Heart size={11} />} />}
          {occupation && <InfoField label="Work" value={occupation} icon={<Briefcase size={11} />} />}
          {education && <InfoField label="Education" value={education} icon={<GraduationCap size={11} />} />}
        </div>
      </div>

      {interests?.length > 0 && (
        <div>
          <SectionHeader title="Interests" />
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, idx) => (
              <span key={idx}
                className="border border-white/10 hover:border-[#d946ef]/40 text-white/80 px-4 py-1.5 rounded-full text-xs font-light transition cursor-default">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionHeader title="Lifestyle" />
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          {height && <InfoField label="Height" value={height} icon={<Ruler size={11} />} />}
          {zodiacSign && <InfoField label="Zodiac" value={zodiacSign} icon={<Moon size={11} />} />}
          {smoking && smoking !== "prefer not to say" && <InfoField label="Smoking" value={smoking} icon={<Cigarette size={11} />} />}
          {drinking && drinking !== "prefer not to say" && <InfoField label="Drinking" value={drinking} icon={<Wine size={11} />} />}
          {workout && <InfoField label="Workout" value={workout} icon={<Dumbbell size={11} />} />}
          {diet && <InfoField label="Diet" value={diet} icon={<Utensils size={11} />} />}
          {pets && <InfoField label="Pets" value={pets} icon={<PawPrint size={11} />} />}
          {kids && kids !== "prefer not to say" && <InfoField label="Kids" value={kids} icon={<Baby size={11} />} />}
          {languages?.length > 0 && <InfoField label="Languages" value={languages.join(", ")} icon={<Globe size={11} />} />}
        </div>
      </div>
    </div>
  );
}
