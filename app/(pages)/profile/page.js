"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, X, Camera, Image as ImageIcon, Save, Pencil } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import SafeImage from "@/components/SafeImage";
import { compressImage } from "@/utils/compressImage";

const ProfileInfoBar = lazy(() => import("@/components/ProfileInfoBar"));
const AboutTab = lazy(() => import("@/components/AboutTab"));
const TimelineTab = lazy(() => import("@/components/TimelineTab"));
const PhotosTab = lazy(() => import("@/components/PhotosTab"));
const PhotoLightbox = lazy(() => import("@/components/PhotoLightbox"));

function Label({ children }) {
  return <label className="block text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 sm:mb-3 font-light">{children}</label>;
}

function Banner({ children, color = "red" }) {
  const map = { red: "border-red-500/30 text-red-300", violet: "border-fuchsia-400/30 text-fuchsia-200", amber: "border-amber-500/30 text-amber-300" };
  const bg = color === "red" ? "linear-gradient(135deg, #7f1d1d, #991b1b)" : color === "violet" ? "linear-gradient(135deg, #4a1d6b, #5b21b6)" : "linear-gradient(135deg, #78350f, #92400e)";
  return <div className={`text-xs px-3 sm:px-4 py-2.5 sm:py-3 rounded border ${map[color]} font-light`} style={{ background: bg }}>{children}</div>;
}

function Grid({ children }) { return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">{children}</div>; }

function Field({ label, type = "text", ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} {...props}
        className="w-full border border-white/[0.08] focus:border-[#d946ef]/40 rounded-lg sm:rounded px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-white/30 outline-none font-light"
        style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }} />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <select {...props}
        className="w-full border border-white/[0.08] focus:border-[#d946ef]/40 rounded-lg sm:rounded px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white outline-none capitalize font-light"
        style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
        {options.map(opt => <option key={opt} value={opt} style={{ background: "#1a0f2e" }}>{opt === "" ? "Select" : opt}</option>)}
      </select>
    </div>
  );
}

function TextareaField({ label, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea rows={3} {...props}
        className="w-full border border-white/[0.08] focus:border-[#d946ef]/40 rounded-lg sm:rounded px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-white/30 outline-none resize-none font-light"
        style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <h3 className="font-serif text-lg sm:text-xl text-white">{title}</h3>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      {children}
    </div>
  );
}

export default function OwnProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [compressError, setCompressError] = useState("");
  const [formData, setFormData] = useState({ name: "", age: "", location: "", bio: "", interests: "", occupation: "", education: "", height: "", religion: "prefer not to say", smoking: "prefer not to say", drinking: "prefer not to say", kids: "prefer not to say", relationshipGoal: "not sure yet", gender: "", lookingFor: "", languages: "", zodiacSign: "", workout: "", diet: "", pets: "" });
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [timelinePhotos, setTimelinePhotos] = useState([]);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/profile/${user.id}`).then(r => r.ok ? r.json() : null).then(data => {
      if (!data?.user) return;
      setProfileData(data.user);
      setProfilePicture(data.user.profilePicture || "");
      setCoverPhoto(data.user.coverPhoto || "");
      setTimelinePhotos(data.user.timelinePhotos || []);
      setFormData({
        name: data.user.name || "", age: data.user.age || "", location: data.user.location || "", bio: data.user.bio || "", interests: data.user.interests?.join(", ") || "",
        occupation: data.user.occupation || "", education: data.user.education || "", height: data.user.height || "", religion: data.user.religion || "prefer not to say",
        smoking: data.user.smoking || "prefer not to say", drinking: data.user.drinking || "prefer not to say", kids: data.user.kids || "prefer not to say",
        relationshipGoal: data.user.relationshipGoal || "not sure yet", gender: data.user.gender || "", lookingFor: data.user.lookingFor || "",
        languages: data.user.languages?.join(", ") || "", zodiacSign: data.user.zodiacSign || "", workout: data.user.workout || "", diet: data.user.diet || "", pets: data.user.pets || "",
      });
    }).catch(() => {});
  }, [user]);

  const handleProfilePicUpload = useCallback(async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setCompressError("");
    if (file.size > 10 * 1024 * 1024) return setCompressError("File too large (max 10MB)");
    try { setProfilePicture(await compressImage(file, 512, 512, 0.7)); } catch { setCompressError("Failed to process image"); }
  }, []);

  const handleCoverPhotoUpload = useCallback(async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setCompressError("");
    if (file.size > 10 * 1024 * 1024) return setCompressError("File too large (max 10MB)");
    try { setCoverPhoto(await compressImage(file, 1200, 400, 0.7)); } catch { setCompressError("Failed to process image"); }
  }, []);

  const handleTimelinePhotosUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files); if (files.length === 0) return;
    if (files.reduce((a, f) => a + f.size, 0) > 20 * 1024 * 1024) { setCompressError("Total size too large (max 20MB)"); return; }
    for (const file of files) {
      try { const c = await compressImage(file, 800, 800, 0.7); setTimelinePhotos(p => [...p, c]); } catch { setCompressError("Failed to process some images"); }
    }
  }, []);

  const handleRemoveTimelinePhoto = useCallback((i) => setTimelinePhotos(p => p.filter((_, idx) => idx !== i)), []);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess(""); setCompressError("");
    try {
      const payload = { ...formData, age: parseInt(formData.age), interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean), languages: formData.languages.split(",").map(i => i.trim()).filter(Boolean), profilePicture, coverPhoto, timelinePhotos };
      if (new Blob([JSON.stringify(payload)]).size > 5 * 1024 * 1024) { setCompressError("Profile data too large."); setSaving(false); return; }
      const r = await fetch("/api/profile/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (r.ok) { setSuccess("Profile updated."); setProfileData(p => ({ ...p, ...payload })); setIsEditing(false); setTimeout(() => setSuccess(""), 3000); }
      else { const d = await r.json(); setError(d.error || "Failed"); }
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }, [formData, profilePicture, coverPhoto, timelinePhotos]);

  if (loading || !user || !profileData) return <LoadingSpinner />;

  const tabs = [{ key: "timeline", label: "Timeline" }, { key: "about", label: "About" }, { key: "photos", label: "Photos" }];

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button onClick={() => router.push("/")} className="text-white/50 hover:text-[#d946ef] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-light flex items-center gap-1">
            <ChevronLeft size={13} /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d946ef]" />
            <span className="font-serif text-sm sm:text-base text-white">Lumière</span>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setIsEditing(!isEditing)}
            className="text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-medium flex items-center gap-1"
            style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
            <Pencil size={10} /> {isEditing ? "Cancel" : "Edit"}
          </motion.button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="rounded-2xl p-4 sm:p-6 space-y-6 border border-white/[0.06]" style={{ background: "linear-gradient(180deg, #1a0f2e, #0f081c)" }}>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Edit Profile</h2>
            {error && <Banner color="red">{error}</Banner>}
            {success && <Banner color="violet">{success}</Banner>}
            {compressError && <Banner color="amber">{compressError}</Banner>}

            <div>
              <Label>Cover Photo</Label>
              <div className="relative h-28 sm:h-40 rounded-lg overflow-hidden border border-white/[0.08]" style={{ background: "linear-gradient(180deg, #0f081c, #1a0f2e)" }}>
                {coverPhoto ? (
                  <>
                    <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setCoverPhoto("")} className="absolute top-2 right-2 w-6 h-6 rounded-full border border-white/15 text-white flex items-center justify-center" style={{ background: "#0a0612" }}><X size={11} /></button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-white/40 hover:text-[#d946ef]">
                    <Camera className="w-5 h-5 sm:w-7 sm:h-7 mb-1" />
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-light">Add Cover</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            <div>
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-br from-[#d946ef] to-[#7c3aed] flex-shrink-0">
                  <SafeImage src={profilePicture} name={formData.name} className="w-full h-full" bgClassName="bg-[#1a0f2e]" textClassName="text-[#d946ef] font-serif text-xl sm:text-2xl" />
                </div>
                <label className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-medium cursor-pointer" style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                  <Camera size={11} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                </label>
              </div>
            </div>

            <div>
              <Label>Gallery</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timelinePhotos.map((photo, index) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-white/[0.08]">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveTimelinePhoto(index)} className="absolute top-1 right-1 w-5 h-5 rounded-full border border-white/15 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ background: "#0a0612" }}><X size={10} /></button>
                  </div>
                ))}
                {timelinePhotos.length < 9 && (
                  <label className="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer text-white/40 hover:text-[#d946ef] border border-white/[0.08] hover:border-[#d946ef]/40" style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
                    <ImageIcon className="w-4 h-4 mb-1" />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-light">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleTimelinePhotosUpload} />
                  </label>
                )}
              </div>
            </div>

            <Section title="Basics">
              <Grid>
                <Field label="Name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                <Field label="Age" type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} />
                <Field label="Location" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} />
                <SelectField label="Gender" value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))} options={["", "male", "female", "non-binary"]} />
              </Grid>
            </Section>

            <Section title="About You">
              <TextareaField label="Bio" value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} />
              <Field label="Interests" value={formData.interests} onChange={e => setFormData(p => ({ ...p, interests: e.target.value }))} placeholder="Travel, Music, Sports" />
            </Section>

            <Section title="Background">
              <Grid>
                <Field label="Occupation" value={formData.occupation} onChange={e => setFormData(p => ({ ...p, occupation: e.target.value }))} />
                <Field label="Education" value={formData.education} onChange={e => setFormData(p => ({ ...p, education: e.target.value }))} />
                <Field label="Height" value={formData.height} onChange={e => setFormData(p => ({ ...p, height: e.target.value }))} />
                <Field label="Zodiac" value={formData.zodiacSign} onChange={e => setFormData(p => ({ ...p, zodiacSign: e.target.value }))} />
              </Grid>
            </Section>

            <Section title="Lifestyle">
              <Grid>
                <SelectField label="Smoking" value={formData.smoking} onChange={e => setFormData(p => ({ ...p, smoking: e.target.value }))} options={["non-smoker", "occasional", "regular", "prefer not to say"]} />
                <SelectField label="Drinking" value={formData.drinking} onChange={e => setFormData(p => ({ ...p, drinking: e.target.value }))} options={["non-drinker", "occasional", "regular", "prefer not to say"]} />
                <SelectField label="Workout" value={formData.workout} onChange={e => setFormData(p => ({ ...p, workout: e.target.value }))} options={["daily", "often", "sometimes", "never"]} />
                <SelectField label="Diet" value={formData.diet} onChange={e => setFormData(p => ({ ...p, diet: e.target.value }))} options={["", "vegetarian", "vegan", "pescatarian", "omnivore", "keto", "other"]} />
              </Grid>
            </Section>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 text-white py-3 sm:py-4 rounded-full text-xs uppercase tracking-[0.3em] font-medium disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
              {saving ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving</> : <><Save size={12} /> Save Changes</>}
            </motion.button>
          </form>
        ) : (
          <>
            <Suspense fallback={<LoadingSpinner />}>
              <ProfileInfoBar profileData={profileData} isOwnProfile onEditClick={() => setIsEditing(true)} />
            </Suspense>
            <div className="mt-5 sm:mt-7 border-b border-white/[0.06] flex">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 sm:flex-none sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-light ${activeTab === tab.key ? "text-[#d946ef]" : "text-white/40 hover:text-white/70"}`}>
                  {tab.label}
                  {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-px bg-[#d946ef]" />}
                </button>
              ))}
            </div>
            <div className="mt-5 sm:mt-7">
              <Suspense fallback={<LoadingSpinner />}>
                {activeTab === "timeline" && <TimelineTab profileData={profileData} onPhotoClick={setSelectedPhoto} />}
                {activeTab === "about" && <AboutTab profileData={profileData} />}
                {activeTab === "photos" && <PhotosTab photos={timelinePhotos} onPhotoClick={setSelectedPhoto} />}
              </Suspense>
            </div>
          </>
        )}
      </div>
      <Suspense fallback={null}>
        <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      </Suspense>
    </div>
  );
}