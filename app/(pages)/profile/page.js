"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, X, Camera, Image as ImageIcon, Save, Pencil } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import ProfileInfoBar from "@/components/ProfileInfoBar";
import AboutTab from "@/components/AboutTab";
import TimelineTab from "@/components/TimelineTab";
import PhotosTab from "@/components/PhotosTab";
import PhotoLightbox from "@/components/PhotoLightbox";
import SafeImage from "@/components/SafeImage";
import { compressImage } from "@/utils/compressImage";

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

  const [formData, setFormData] = useState({
    name: "", age: "", location: "", bio: "", interests: "",
    occupation: "", education: "", height: "", religion: "prefer not to say",
    smoking: "prefer not to say", drinking: "prefer not to say",
    kids: "prefer not to say", relationshipGoal: "not sure yet",
    gender: "", lookingFor: "", languages: "", zodiacSign: "",
    workout: "", diet: "", pets: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [timelinePhotos, setTimelinePhotos] = useState([]);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/profile/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData(data.user);
          setProfilePicture(data.user.profilePicture || "");
          setCoverPhoto(data.user.coverPhoto || "");
          setTimelinePhotos(data.user.timelinePhotos || []);
          setFormData({
            name: data.user.name || "", age: data.user.age || "",
            location: data.user.location || "", bio: data.user.bio || "",
            interests: data.user.interests?.join(", ") || "",
            occupation: data.user.occupation || "", education: data.user.education || "",
            height: data.user.height || "",
            religion: data.user.religion || "prefer not to say",
            smoking: data.user.smoking || "prefer not to say",
            drinking: data.user.drinking || "prefer not to say",
            kids: data.user.kids || "prefer not to say",
            relationshipGoal: data.user.relationshipGoal || "not sure yet",
            gender: data.user.gender || "", lookingFor: data.user.lookingFor || "",
            languages: data.user.languages?.join(", ") || "",
            zodiacSign: data.user.zodiacSign || "",
            workout: data.user.workout || "", diet: data.user.diet || "",
            pets: data.user.pets || "",
          });
        }
      } catch (e) { console.error(e); }
    };
    fetchProfile();
  }, [user]);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      setCompressError("");
      if (file.size > 10 * 1024 * 1024) return setCompressError("File too large (max 10MB)");
      setProfilePicture(await compressImage(file, 512, 512, 0.7));
    } catch { setCompressError("Failed to process image"); }
  };

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      setCompressError("");
      if (file.size > 10 * 1024 * 1024) return setCompressError("File too large (max 10MB)");
      setCoverPhoto(await compressImage(file, 1200, 400, 0.7));
    } catch { setCompressError("Failed to process image"); }
  };

  const handleTimelinePhotosUpload = async (e) => {
    const files = Array.from(e.target.files); if (files.length === 0) return;
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 20 * 1024 * 1024) return setCompressError("Total file size too large (max 20MB)");
    for (const file of files) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        setTimelinePhotos((prev) => [...prev, compressed]);
      } catch { setCompressError("Failed to process some images"); }
    }
  };

  const handleRemoveTimelinePhoto = (index) => {
    setTimelinePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess(""); setCompressError("");
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age),
        interests: formData.interests.split(",").map((i) => i.trim()).filter(Boolean),
        languages: formData.languages.split(",").map((i) => i.trim()).filter(Boolean),
        profilePicture, coverPhoto, timelinePhotos,
      };
      const payloadSize = new Blob([JSON.stringify(payload)]).size;
      if (payloadSize > 5 * 1024 * 1024) {
        setCompressError("Profile data too large. Use smaller images.");
        setSaving(false); return;
      }
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess("Profile updated.");
        setProfileData({ ...profileData, ...payload });
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading || !user || !profileData) return <LoadingSpinner />;

  const tabs = [
    { key: "timeline", label: "Timeline" },
    { key: "about",    label: "About" },
    { key: "photos",   label: "Photos" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0612] relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/")}
            className="text-white/50 hover:text-[#d946ef] text-[11px] uppercase tracking-[0.25em] font-light flex items-center gap-1.5 transition">
            <ChevronLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d946ef]" />
            <span className="font-serif text-base text-white tracking-wide">Lumière</span>
          </div>
          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium transition flex items-center gap-1.5"
          >
            <Pencil size={11} /> {isEditing ? "Cancel" : "Edit"}
          </motion.button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave}
            className="bg-[#15082a]/60 border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent" />

            <div>
              <h2 className="font-serif text-3xl text-white tracking-wide">Edit Profile</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-2 font-light">
                Refine your story
              </p>
            </div>

            {error && <Banner color="red">{error}</Banner>}
            {success && <Banner color="violet">{success}</Banner>}
            {compressError && <Banner color="amber">{compressError}</Banner>}

            {/* Cover */}
            <div>
              <Label>Cover Photo · max 10MB</Label>
              <div className="relative h-36 sm:h-48 rounded-lg overflow-hidden border border-white/[0.08] bg-[#1a0f2e]">
                {coverPhoto ? (
                  <>
                    <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setCoverPhoto("")}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/15 text-white hover:text-[#d946ef] hover:border-[#d946ef]/40 transition flex items-center justify-center">
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-white/40 hover:text-[#d946ef] transition">
                    <Camera className="w-7 h-7 mb-2" />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-light">Add Cover</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Profile picture */}
            <div>
              <Label>Profile Picture · max 10MB</Label>
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2px] bg-gradient-to-br from-[#d946ef] to-[#7c3aed]">
                  <SafeImage
                    src={profilePicture} name={formData.name}
                    className="w-full h-full"
                    bgClassName="bg-[#1a0f2e]"
                    textClassName="text-[#d946ef] font-serif text-2xl"
                  />
                  {profilePicture && (
                    <button type="button" onClick={() => setProfilePicture("")}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black border border-white/20 text-white/70 hover:text-[#d946ef] transition flex items-center justify-center">
                      <X size={11} />
                    </button>
                  )}
                </div>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white text-[10px] uppercase tracking-[0.25em] font-medium cursor-pointer transition">
                  <Camera size={12} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                </label>
              </div>
            </div>

            {/* Timeline photos */}
            <div>
              <Label>Gallery · max 20MB total</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {timelinePhotos.map((photo, index) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-white/[0.08]">
                    <img src={photo} alt={`Timeline ${index}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveTimelinePhoto(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 border border-white/15 text-white hover:text-[#d946ef] opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {timelinePhotos.length < 9 && (
                  <label className="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer text-white/40 hover:text-[#d946ef] border border-white/[0.08] hover:border-[#d946ef]/40 bg-white/[0.02] transition">
                    <ImageIcon className="w-5 h-5 mb-1.5" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-light">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleTimelinePhotosUpload} />
                  </label>
                )}
              </div>
            </div>

            <Section title="Basics">
              <Grid>
                <Field label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Field label="Age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                <Field label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                <SelectField label="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} options={["", "male", "female", "non-binary", "prefer not to say"]} />
              </Grid>
            </Section>

            <Section title="About You">
              <TextareaField label="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." />
              <Field label="Interests · comma separated" value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} placeholder="Travel, Music, Sports" />
            </Section>

            <Section title="Background">
              <Grid>
                <Field label="Occupation" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                <Field label="Education" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                <Field label="Height" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} placeholder='e.g. 5&apos;10"' />
                <Field label="Zodiac" value={formData.zodiacSign} onChange={(e) => setFormData({ ...formData, zodiacSign: e.target.value })} placeholder="Leo, Virgo..." />
              </Grid>
            </Section>

            <Section title="Preferences">
              <Grid>
                <SelectField label="Religion" value={formData.religion} onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  options={["", "Christianity", "Islam", "Hinduism", "Buddhism", "Judaism", "Other", "prefer not to say"]} />
                <SelectField label="Looking For" value={formData.lookingFor} onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  options={["", "male", "female", "everyone"]} />
                <SelectField label="Relationship Goal" value={formData.relationshipGoal} onChange={(e) => setFormData({ ...formData, relationshipGoal: e.target.value })}
                  options={["marriage", "long term", "short term", "friendship", "not sure yet"]} />
                <Field label="Languages" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} placeholder="English, Spanish..." />
              </Grid>
            </Section>

            <Section title="Lifestyle">
              <Grid>
                <SelectField label="Smoking" value={formData.smoking} onChange={(e) => setFormData({ ...formData, smoking: e.target.value })} options={["non-smoker", "occasional", "regular", "prefer not to say"]} />
                <SelectField label="Drinking" value={formData.drinking} onChange={(e) => setFormData({ ...formData, drinking: e.target.value })} options={["non-drinker", "occasional", "regular", "prefer not to say"]} />
                <SelectField label="Workout" value={formData.workout} onChange={(e) => setFormData({ ...formData, workout: e.target.value })} options={["daily", "often", "sometimes", "never"]} />
                <SelectField label="Diet" value={formData.diet} onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                  options={["", "vegetarian", "vegan", "pescatarian", "omnivore", "keto", "other"]} />
                <SelectField label="Pets" value={formData.pets} onChange={(e) => setFormData({ ...formData, pets: e.target.value })}
                  options={["", "dog", "cat", "both", "none", "allergic"]} />
                <SelectField label="Kids" value={formData.kids} onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
                  options={["no kids", "have kids", "want kids", "don't want kids", "prefer not to say"]} />
              </Grid>
            </Section>

            <motion.button
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white py-4 rounded-full text-xs uppercase tracking-[0.3em] font-medium transition disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </form>
        ) : (
          <>
            <ProfileInfoBar profileData={profileData} isOwnProfile onEditClick={() => setIsEditing(true)} />

            <div className="mt-7 border-b border-white/[0.06] flex">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`relative flex-1 sm:flex-none sm:px-8 py-3 text-[11px] uppercase tracking-[0.3em] font-light transition ${
                      active ? "text-[#d946ef]" : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {tab.label}
                    {active && <span className="absolute bottom-0 left-0 right-0 h-px bg-[#d946ef]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-7">
              {activeTab === "timeline" && <TimelineTab profileData={profileData} onPhotoClick={setSelectedPhoto} />}
              {activeTab === "about" && <AboutTab profileData={profileData} />}
              {activeTab === "photos" && <PhotosTab photos={timelinePhotos} onPhotoClick={setSelectedPhoto} />}
            </div>
          </>
        )}
      </div>

      <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}

/* ---------- Helpers ---------- */
function Label({ children }) {
  return <label className="block text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/50 mb-3 font-light">{children}</label>;
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-serif text-xl text-white tracking-wide">{title}</h3>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      {children}
    </div>
  );
}

function Banner({ children, color = "red" }) {
  const map = {
    red:   "border-red-500/20 bg-red-500/5 text-red-300",
    violet: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-300",
  };
  return <div className={`text-xs px-4 py-3 rounded border ${map[color]} font-light`}>{children}</div>;
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, type = "text", ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} {...props}
        className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#d946ef]/40 rounded px-4 py-3 text-sm text-white placeholder-white/30 transition outline-none font-light" />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <select {...props}
        className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#d946ef]/40 rounded px-4 py-3 text-sm text-white transition outline-none capitalize font-light">
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#15082a]/60 text-white">{opt === "" ? "Select" : opt}</option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({ label, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea rows={4} {...props}
        className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#d946ef]/40 rounded px-4 py-3 text-sm text-white placeholder-white/30 transition outline-none resize-none font-light" />
    </div>
  );
}
