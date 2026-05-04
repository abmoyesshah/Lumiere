"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import ProfileInfoBar from "@/components/ProfileInfoBar";
import AboutTab from "@/components/AboutTab";
import TimelineTab from "@/components/TimelineTab";
import PhotosTab from "@/components/PhotosTab";
import PhotoLightbox from "@/components/PhotoLightbox";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [timelinePhotos, setTimelinePhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData(data.user);
          setTimelinePhotos(data.user.timelinePhotos || []);
        }
      } catch (e) { console.error(e); }
      finally { setFetching(false); }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading || fetching || !profileData) return <LoadingSpinner />;

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
          <button onClick={() => router.back()}
            className="text-white/50 hover:text-[#d946ef] text-[11px] uppercase tracking-[0.25em] font-light flex items-center gap-1.5 transition">
            <ChevronLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d946ef]" />
            <span className="font-serif text-base text-white tracking-wide">Lumière</span>
          </div>
          <div className="w-12" />
        </div>

        <ProfileInfoBar profileData={profileData} />

        {/* Tabs */}
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
      </div>

      <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
