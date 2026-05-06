"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Users, ArrowLeft, MessageCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import SafeImage from "@/components/SafeImage";

const TABS = [
  { id: "likes_you", label: "Likes You", icon: Heart, endpoint: "/api/likes/received" },
  { id: "you_liked", label: "You Liked", icon: Sparkles, endpoint: "/api/likes/sent" },
  { id: "mutual", label: "Matches", icon: Users, endpoint: "/api/matches/mutual" },
];

const MatchCard = memo(function MatchCard({ profile, isMutual, onView, onMessage }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.06] cursor-pointer w-full"
      style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}
      onClick={onView}>
      <div className="relative aspect-[3/4]">
        <SafeImage user={profile} name={profile.name} rounded="rounded-none" className="w-full h-full"
          bgClassName="bg-violet-950/40" textClassName="text-[#d946ef] text-3xl sm:text-5xl" iconSize={28} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        {isMutual && (
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
            <Heart size={8} className="fill-black text-white" />
            <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] text-white font-medium">Match</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <p className="text-white text-sm sm:text-base font-semibold tracking-wide truncate">
            {profile.name}{profile.age && <span className="text-white/60 font-light ml-1 text-xs sm:text-sm">{profile.age}</span>}
          </p>
          {profile.location && (
            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#d946ef] font-light mt-0.5 truncate">{profile.location}</p>
          )}
        </div>
        {isMutual && (
          <button onClick={(e) => { e.stopPropagation(); onMessage(); }}
            className="absolute bottom-2 right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
            <MessageCircle size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
});

const EmptyState = memo(function EmptyState({ tab, onDiscover }) {
  const copy = {
    likes_you: { title: "No admirers yet", desc: "When someone likes your profile, they'll appear here.", icon: Heart },
    you_liked: { title: "Nothing yet", desc: "Profiles you connect with will show up here.", icon: Sparkles },
    mutual: { title: "No matches yet", desc: "When you and someone like each other, it's a match.", icon: Users },
  }[tab];
  const Icon = copy.icon;
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#d946ef]/30 flex items-center justify-center mb-4 sm:mb-6">
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-[#d946ef]/60" />
      </div>
      <h3 className="text-xl sm:text-2xl text-white tracking-wide mb-2">{copy.title}</h3>
      <p className="text-xs sm:text-sm text-white/50 font-light max-w-sm mb-6">{copy.desc}</p>
      <motion.button whileTap={{ scale: 0.97 }} onClick={onDiscover}
        className="text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium"
        style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
        Discover
      </motion.button>
    </div>
  );
});

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("likes_you");
  const [data, setData] = useState({ likes_you: [], you_liked: [], mutual: [] });
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const tab = TABS.find(t => t.id === activeTab);
    setLoadingTab(true);
    fetch(tab.endpoint)
      .then(r => r.ok ? r.json() : { profiles: [] })
      .then(d => setData(p => ({ ...p, [activeTab]: d.profiles || d.matches || [] })))
      .catch(() => {})
      .finally(() => setLoadingTab(false));
  }, [activeTab, user]);

  if (loading || !user) return <LoadingSpinner />;

  const profiles = data[activeTab] || [];

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10 w-full">
        <Navbar user={user} onLogout={() => router.push("/")} />
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10 pb-20">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/")}
            className="text-white/50 hover:text-[#d946ef] flex items-center gap-2 mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-light">
            <ArrowLeft size={13} /> Back
          </motion.button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white tracking-wide">
              Your <span className="italic text-[#d946ef]">circle</span>
            </h1>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex border border-white/[0.06] rounded-full p-1 gap-0.5 sm:gap-1 flex-wrap justify-center"
              style={{ background: "linear-gradient(180deg, #0f0820, #0a0612)" }}>
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const count = data[tab.id]?.length || 0;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[11px] uppercase tracking-[0.22em] font-light flex items-center gap-1.5 sm:gap-2 ${active ? "text-white" : "text-white/60 hover:text-white"}`}>
                    {active && (
                      <motion.span layoutId="matches-tab" className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      <Icon size={11} />{tab.label}
                      {count > 0 && (
                        <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full ${active ? "text-white" : "text-white/70"}`}
                          style={{ background: active ? "#0a0612" : "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>{count}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {loadingTab ? (
            <div className="py-16"><LoadingSpinner /></div>
          ) : profiles.length === 0 ? (
            <EmptyState tab={activeTab} onDiscover={() => router.push("/")} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {profiles.map((p, i) => (
                  <MatchCard key={p._id || p.id || i} profile={p} isMutual={activeTab === "mutual"}
                    onView={() => router.push(`/profile/${p._id || p.id}`)}
                    onMessage={() => router.push(`/chat?matchId=${p._id || p.id}`)} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}