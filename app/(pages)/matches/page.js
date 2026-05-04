"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Users, ArrowLeft, MessageCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import SafeImage from "@/components/SafeImage";

const TABS = [
  { id: "likes_you", label: "Likes You",  icon: Heart,    endpoint: "/api/likes/received" },
  { id: "you_liked", label: "You Liked",  icon: Sparkles, endpoint: "/api/likes/sent" },
  { id: "mutual",    label: "Matches",    icon: Users,    endpoint: "/api/matches/mutual" },
];

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("likes_you");
  const [data, setData] = useState({ likes_you: [], you_liked: [], mutual: [] });
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    const tab = TABS.find((t) => t.id === activeTab);
    setLoadingTab(true);
    fetch(tab.endpoint)
      .then((r) => r.ok ? r.json() : { profiles: [] })
      .then((d) => setData((prev) => ({ ...prev, [activeTab]: d.profiles || d.matches || [] })))
      .catch(console.error)
      .finally(() => setLoadingTab(false));
  }, [activeTab, user]);

  if (loading || !user) return <LoadingSpinner />;

  const profiles = data[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#0a0612] relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar user={user} onLogout={() => router.push("/")} />

        <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-24 max-w-6xl">
          <motion.button
            whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="text-white/50 hover:text-[#d946ef] flex items-center gap-2 mb-6 text-[11px] uppercase tracking-[0.25em] font-light transition"
          >
            <ArrowLeft size={14} /> Back
          </motion.button>

          {/* header */}
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#d946ef] font-light mb-4 inline-flex items-center gap-2">
              <span className="w-6 h-px bg-[#d946ef]/40" />
              Connections
              <span className="w-6 h-px bg-[#d946ef]/40" />
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white tracking-wide">
              Your <span className="italic text-[#d946ef]">circle</span>
            </h1>
          </div>

          {/* tabs */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex bg-[#0f0820] border border-white/[0.06] rounded-full p-1.5 gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const count = data[tab.id]?.length || 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-light transition flex items-center gap-2 ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="matches-tab-pill"
                        className="absolute inset-0 bg-[#d946ef] rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={12} />
                      <span>{tab.label}</span>
                      {count > 0 && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active ? "bg-black/20 text-white" : "bg-white/10 text-white/70"}`}>
                          {count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* grid */}
          {loadingTab ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : profiles.length === 0 ? (
            <EmptyState tab={activeTab} onDiscover={() => router.push("/")} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
              >
                {profiles.map((p, i) => (
                  <MatchCard
                    key={p._id || p.id || i}
                    profile={p}
                    isMutual={activeTab === "mutual"}
                    onView={() => router.push(`/profile/${p._id || p.id}`)}
                    onMessage={() => router.push(`/chat?matchId=${p._id || p.id}`)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ profile, isMutual, onView, onMessage }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative rounded-2xl overflow-hidden bg-[#0f0820] border border-white/[0.06] cursor-pointer"
      style={{ boxShadow: "0 20px 40px -20px rgba(0,0,0,0.7)" }}
      onClick={onView}
    >
      <div className="relative aspect-[3/4]">
        <SafeImage
          user={profile} name={profile.name}
          rounded="rounded-none"
          className="w-full h-full"
          bgClassName="bg-violet-950/40"
          textClassName="text-[#d946ef] text-5xl"
          iconSize={36}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {isMutual && (
          <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#d946ef] rounded-full">
            <Heart size={9} className="fill-black text-white" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white font-medium">Match</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <p className="text-white text-base sm:text-lg tracking-wide leading-tight truncate">
            {profile.name}
            {profile.age && <span className="text-white/60 font-light ml-1">{profile.age}</span>}
          </p>
          {profile.location && (
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#d946ef] font-light mt-0.5 truncate">
              {profile.location}
            </p>
          )}
        </div>

        {isMutual && (
          <button
            onClick={(e) => { e.stopPropagation(); onMessage(); }}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
            aria-label="Message"
          >
            <MessageCircle size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ tab, onDiscover }) {
  const copy = {
    likes_you: { title: "No admirers yet", desc: "When someone likes your profile, they'll appear here.", icon: Heart },
    you_liked: { title: "Nothing yet",     desc: "Profiles you connect with will show up here.",         icon: Sparkles },
    mutual:    { title: "No matches yet",  desc: "When you and someone like each other, it's a match.",  icon: Users },
  }[tab];
  const Icon = copy.icon;
  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="w-16 h-16 rounded-full border border-[#d946ef]/30 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-[#d946ef]/60" />
      </div>
      <h3 className="text-2xl text-white tracking-wide mb-3">{copy.title}</h3>
      <p className="text-sm text-white/50 font-light max-w-sm mb-8">{copy.desc}</p>
      <motion.button
        whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
        onClick={onDiscover}
        className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium transition"
      >
        Discover
      </motion.button>
    </div>
  );
}
