"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

const AuthModal = lazy(() => import("@/components/AuthModal"));
const ProfileCard = lazy(() => import("@/components/ProfileCard"));

const sampleProfiles = [
  { id: 1, name: "Sarah", age: 28, location: "New York", profilePicture: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop", bio: "Coffee addict, yoga lover, and sunset chaser.", interests: ["Travel", "Photography", "Cooking", "Yoga"], matchScore: 95 },
  { id: 2, name: "Michael", age: 32, location: "Los Angeles", profilePicture: "/profile-4.jpg", bio: "Musician and producer.", interests: ["Music", "Surfing", "Art", "Concerts"], matchScore: 88 },
  { id: 3, name: "Emma", age: 26, location: "Chicago", profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop", bio: "Architecture student by day, painter by night.", interests: ["Architecture", "Painting", "Hiking", "Museums"], matchScore: 92 },
];

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [fetchingMatches, setFetchingMatches] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authBusy, setAuthBusy] = useState(false);
  const [authBusyLabel, setAuthBusyLabel] = useState("");
  const [showSampleCards, setShowSampleCards] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);

  useEffect(() => { setLocalUser(user); }, [user]);

  useEffect(() => {
    if (!localUser) { setMatches([]); return; }
    let c = false;
    setFetchingMatches(true);
    fetch("/api/matches").then(r => r.ok ? r.json() : {}).then(d => { if (!c && d.matches) { setMatches(d.matches); setCurrentMatchIndex(0); } }).catch(() => {}).finally(() => { if (!c) setFetchingMatches(false); });
    return () => { c = true; };
  }, [localUser]);

  const handleLogout = useCallback(async () => {
    setAuthBusyLabel("Signing out"); setAuthBusy(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    setLocalUser(null); setMatches([]); setCurrentMatchIndex(0); setShowSampleCards(false); setSampleIndex(0);
    router.push("/"); setTimeout(() => setAuthBusy(false), 400);
  }, [router]);

  const handleAuthSuccess = useCallback((u) => {
    setAuthBusyLabel("Welcome"); setAuthBusy(true); setLocalUser(u); setShowSampleCards(false);
    setTimeout(() => { setAuthBusy(false); router.push("/"); }, 600);
  }, [router]);

  const handleSampleView = useCallback(() => { if (!localUser) { setAuthMode("login"); setShowAuthModal(true); } }, [localUser]);
  const handleSampleLike = useCallback(() => { if (!localUser) { setAuthMode("register"); setShowAuthModal(true); return; } setSampleIndex(p => p + 1 < sampleProfiles.length ? p + 1 : 0); }, [localUser]);
  const handleSamplePass = useCallback(() => { setSampleIndex(p => p + 1 < sampleProfiles.length ? p + 1 : 0); }, []);
  const handleViewProfile = useCallback((p) => { setAuthBusyLabel("Loading"); setAuthBusy(true); router.push(`/profile/${p._id ?? p.id}`); setTimeout(() => setAuthBusy(false), 400); }, [router]);
  const handlePass = useCallback(() => { if (currentMatchIndex + 1 < matches.length) setCurrentMatchIndex(p => p + 1); else setMatches([]); }, [matches.length, currentMatchIndex]);
  const handleLike = useCallback(async () => {
    const cur = matches[currentMatchIndex]; if (!cur) return;
    try { await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ likedUserId: cur._id }) }); }
    catch {}
    if (currentMatchIndex + 1 < matches.length) setCurrentMatchIndex(p => p + 1); else setMatches([]);
  }, [matches, currentMatchIndex]);
  const openAuth = useCallback((m = "register") => { setAuthMode(m); setShowAuthModal(true); }, []);

  if (loading) return <LoadingSpinner />;
  const showRealMatches = localUser && matches.length > 0 && !showSampleCards;

  return (
    <div className="min-h-screen relative overflow-x-hidden text-white" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar user={localUser} onLogout={handleLogout} transparent variant="landing" onOpenAuth={openAuth} />
        <Suspense fallback={null}>{showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} initialStateIsLogin={authMode === "login"} />}</Suspense>
        <AnimatePresence>{authBusy && <LoadingSpinner variant="overlay" label={authBusyLabel} />}</AnimatePresence>

        {!showSampleCards && !showRealMatches && (
          <section className="relative min-h-screen flex items-center overflow-hidden px-4">
            <div className="container mx-auto px-4 pt-20 pb-16 w-full">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6 text-white">
                    Find your <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">person</span>
                  </h1>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">Meaningful connections start here.</p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSampleCards(true)}
                    className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide"
                    style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                    Get Started <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
                <div className="hidden lg:flex justify-center items-center" style={{ height: "clamp(350px, 55vh, 500px)" }}>
                  <div className="relative z-20" style={{ width: "clamp(220px, 35vw, 280px)", height: "clamp(330px, 50vw, 420px)" }}>
                    <div className="relative w-full h-full rounded-2xl sm:rounded-[28px] overflow-hidden border border-white/10"
                      style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                      <img src={sampleProfiles[0].profilePicture} alt="" className="w-full h-full object-cover" loading="eager" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white font-bold text-lg">{sampleProfiles[0].name}</p>
                        <p className="text-fuchsia-300 text-xs uppercase tracking-widest">{sampleProfiles[0].location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute z-10 hidden sm:block" style={{ right: "0px", top: "20px", width: "160px", height: "260px", borderRadius: "24px", overflow: "hidden", border: "1px solid white/10" }}>
                    <img src={sampleProfiles[1].profilePicture} alt="" className="w-full h-full object-cover" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-bold">{sampleProfiles[1].name}</p>
                      <p className="text-fuchsia-300 text-[9px] uppercase">{sampleProfiles[1].location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {showSampleCards && !localUser && (
          <div className="container mx-auto px-4 pt-6 pb-20 flex flex-col items-center min-h-screen">
            <p className="text-white/50 text-xs sm:text-sm mb-6 text-center">Browse profiles — sign up to connect</p>
            <AnimatePresence mode="wait">
              <motion.div key={sampleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="w-full flex justify-center">
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileCard variant="full" profile={sampleProfiles[sampleIndex]} onClick={handleSampleView} showPassLike onPass={handleSamplePass} onLike={handleSampleLike} />
                </Suspense>
              </motion.div>
            </AnimatePresence>
            <div className="text-white/30 text-xs mt-6 flex items-center gap-2">
              <span>{sampleIndex + 1} of {sampleProfiles.length}</span>
              <span className="text-white/10">•</span>
              <button onClick={() => setShowSampleCards(false)} className="text-fuchsia-400/60 hover:text-fuchsia-400 text-xs underline">Back to home</button>
            </div>
          </div>
        )}

        {showRealMatches && (
          <div className="container mx-auto px-4 pt-12 pb-24 flex justify-center min-h-screen">
            {fetchingMatches ? <LoadingSpinner /> : matches.length > 0 && currentMatchIndex < matches.length ? (
              <Suspense fallback={<LoadingSpinner />}>
                <ProfileCard variant="full" profile={matches[currentMatchIndex]} onClick={() => handleViewProfile(matches[currentMatchIndex])} showPassLike onPass={handlePass} onLike={handleLike} />
              </Suspense>
            ) : (
              <div className="text-center border border-white/10 rounded-3xl p-8 sm:p-12 max-w-md mx-4" style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                <p className="text-xl sm:text-2xl font-bold mb-3">All caught up</p>
                <p className="text-sm text-white/60 font-light">Check back tomorrow.</p>
              </div>
            )}
          </div>
        )}

        {!showSampleCards && !showRealMatches && (
          <footer className="py-6 border-t border-white/[0.06]">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Heart size={14} className="text-fuchsia-400 fill-fuchsia-400/40" />
                <span className="font-serif italic text-fuchsia-200 font-bold text-sm">Lumière</span>
              </div>
              <p className="text-white/25 text-[10px] mt-2">© {new Date().getFullYear()} — Made with love</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}