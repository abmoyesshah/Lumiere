"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Shield, Users, Star } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

const AuthModal = lazy(() => import("@/components/AuthModal"));
const ProfileCard = lazy(() => import("@/components/ProfileCard"));

const sampleProfiles = [
  { id: 1, name: "Sarah", age: 28, location: "New York", profilePicture: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop", bio: "Coffee addict, yoga lover, and sunset chaser.", interests: ["Travel", "Photography", "Cooking", "Yoga", "Hiking"], matchScore: 95 },
  { id: 2, name: "Michael", age: 32, location: "Los Angeles", profilePicture: "/profile-4.jpg", bio: "Musician and producer.", interests: ["Music", "Surfing", "Art", "Concerts", "Travel"], matchScore: 88 },
  { id: 3, name: "Emma", age: 26, location: "Chicago", profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop", bio: "Architecture student by day, painter by night.", interests: ["Architecture", "Painting", "Hiking", "Museums", "Coffee"], matchScore: 92 },
  { id: 4, name: "James", age: 30, location: "Miami", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop", bio: "Chef and food explorer.", interests: ["Cooking", "Fitness", "Travel", "Wine", "Beach"], matchScore: 87 },
  { id: 5, name: "Olivia", age: 27, location: "Seattle", profilePicture: "/profile-9.png", bio: "Tech entrepreneur who loves rainy days and good books.", interests: ["Reading", "Technology", "Coffee", "Hiking", "Startups"], matchScore: 91 },
  { id: 6, name: "Daniel", age: 31, location: "Austin", profilePicture: "/profile-7.jpg", bio: "Adventure seeker and dog dad.", interests: ["Adventure", "Dogs", "Music", "Camping", "Festivals"], matchScore: 89 },
];

const features = [
  { icon: Sparkles, title: "Smart Matching", desc: "AI finds people who truly get you." },
  { icon: Shield, title: "Verified Profiles", desc: "No bots, just real people." },
  { icon: Users, title: "Quality Community", desc: "People looking for something real." },
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
    try { await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ likedUserId: cur._id }) }); } catch {}
    if (currentMatchIndex + 1 < matches.length) setCurrentMatchIndex(p => p + 1); else setMatches([]);
  }, [matches, currentMatchIndex]);
  const openAuth = useCallback((m = "register") => { setAuthMode(m); setShowAuthModal(true); }, []);

  if (loading) return <LoadingSpinner />;
  const showRealMatches = localUser && matches.length > 0 && !showSampleCards;

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-[100vw] overflow-x-hidden">
        <Navbar user={localUser} onLogout={handleLogout} transparent variant="landing" onOpenAuth={openAuth} />
        <Suspense fallback={null}>{showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} initialStateIsLogin={authMode === "login"} />}</Suspense>
        <AnimatePresence>{authBusy && <LoadingSpinner variant="overlay" label={authBusyLabel} />}</AnimatePresence>

        {!showSampleCards && !showRealMatches && (
          <>
            {/* HERO */}
            <section className="relative min-h-[85vh] flex items-center w-full px-4">
              <div className="w-full max-w-7xl mx-auto pt-14 sm:pt-16 pb-10">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                  
                  {/* TEXT SIDE */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center lg:text-left w-full">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-fuchsia-400/25 mb-3 sm:mb-4" style={{ background: "linear-gradient(135deg, #1e0f32, #0f081c)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse flex-shrink-0" />
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-fuchsia-200 font-medium">Download the App</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-3 sm:mb-4">
                      Find your{" "}
                      <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">person</span>
                    </h1>
                    <p className="text-white/50 text-sm sm:text-base leading-relaxed font-light mb-5 sm:mb-6 max-w-md mx-auto lg:mx-0">
                      Meaningful connections start here. No games, just real people.
                    </p>
                    
                    {/* BUTTONS - not full width, auto width */}
                    <div className="flex flex-row gap-2.5 justify-center lg:justify-start">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSampleCards(true)}
                        className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold tracking-wide w-auto"
                        style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                        Get Started <ArrowRight size={14} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => openAuth("login")}
                        className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold tracking-wide w-auto border border-white/20 text-white/80">
                        Sign In
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-4 mt-5 text-white/40 text-[10px] sm:text-xs">
                      <span className="flex items-center gap-1"><Star size={11} className="text-fuchsia-400 flex-shrink-0" /> 4.9 Rating</span>
                      <span className="flex items-center gap-1"><Users size={11} className="text-fuchsia-400 flex-shrink-0" /> 50k+ Members</span>
                      <span className="flex items-center gap-1"><Shield size={11} className="text-fuchsia-400 flex-shrink-0" /> Verified</span>
                    </div>
                  </motion.div>

                  {/* IMAGE SIDE - visible on ALL screens */}
                  <div className="flex justify-center items-center w-full mt-4 lg:mt-0">
                    <div className="relative w-full max-w-[300px] sm:max-w-[350px] mx-auto" style={{ aspectRatio: "3/4" }}>
                      {/* Main card - centered */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 z-20"
                        style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                        <img src={sampleProfiles[0].profilePicture} alt="" className="w-full h-full object-cover" loading="eager" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <p className="text-white font-bold text-sm sm:text-base">{sampleProfiles[0].name}, {sampleProfiles[0].age}</p>
                          <p className="text-fuchsia-300 text-[9px] sm:text-[10px] uppercase tracking-widest">{sampleProfiles[0].location}</p>
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[8px] font-semibold text-white" style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                          {sampleProfiles[0].matchScore}% Match
                        </div>
                      </div>
                      
                      {/* Secondary card - top right, only on sm+ */}
                      <div className="absolute -right-2 sm:-right-4 top-[3%] w-[42%] h-[50%] rounded-xl overflow-hidden border border-white/10 z-10 hidden sm:block"
                        style={{ background: "#1a0f2e" }}>
                        <img src={sampleProfiles[1].profilePicture} alt="" className="w-full h-full object-cover" loading="eager" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <p className="text-white text-[10px] font-bold leading-tight">{sampleProfiles[1].name}</p>
                        </div>
                      </div>

                      {/* Match badge */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-fuchsia-400/30" style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                        <Heart size={11} className="text-white fill-white" />
                        <span className="text-white text-[10px] font-bold whitespace-nowrap">New Match!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section className="py-10 sm:py-16 w-full px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 sm:mb-10">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-fuchsia-400 font-medium mb-2">Why Lumière</p>
                  <h2 className="text-2xl sm:text-3xl font-bold">Dating <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">reimagined</span></h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {features.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-5 text-center border border-white/[0.06]" style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                        <f.icon size={18} className="text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{f.title}</h3>
                      <p className="text-xs text-white/50 font-light">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-10 sm:py-16 w-full px-4">
              <div className="max-w-xl mx-auto text-center">
                <div className="rounded-3xl p-6 sm:p-8 border border-white/[0.06]" style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                    <Heart size={20} className="text-white fill-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Your person is <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">out there</span></h2>
                  <p className="text-white/50 text-sm font-light mb-5">Join Lumière today and start making real connections.</p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSampleCards(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold w-auto"
                    style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                    Browse Profiles <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-6 border-t border-white/[0.06] w-full">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart size={13} className="text-fuchsia-400 fill-fuchsia-400/40" />
                  <span className="font-serif italic text-fuchsia-200 font-bold text-sm">Lumière</span>
                </div>
                <p className="text-white/25 text-[10px]">© {new Date().getFullYear()} — Made with love</p>
              </div>
            </footer>
          </>
        )}

        {/* SAMPLE CARDS */}
        {showSampleCards && !localUser && (
          <div className="w-full max-w-[100vw] overflow-x-hidden px-4 pt-4 pb-20 flex flex-col items-center min-h-screen">
            <motion.p initial={{ opacity: 0 }} className="text-white/50 text-xs sm:text-sm mb-3 text-center">Browse profiles — sign up to connect</motion.p>
            <motion.p initial={{ opacity: 0 }} className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-5 text-center">Tap ❤️ to sign up · Swipe ✕ to see more</motion.p>
            <AnimatePresence mode="wait">
              <motion.div key={sampleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="w-full flex justify-center max-w-[440px]">
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileCard variant="full" profile={sampleProfiles[sampleIndex]} onClick={handleSampleView} showPassLike onPass={handleSamplePass} onLike={handleSampleLike} />
                </Suspense>
              </motion.div>
            </AnimatePresence>
            <div className="text-white/30 text-xs mt-6 flex items-center gap-2 flex-wrap justify-center">
              <span>{sampleIndex + 1} of {sampleProfiles.length}</span>
              <span className="text-white/10 hidden xs:inline">•</span>
              <button onClick={() => setShowSampleCards(false)} className="text-fuchsia-400/60 hover:text-fuchsia-400 text-xs underline">Back to home</button>
            </div>
          </div>
        )}

        {/* REAL MATCHES */}
        {showRealMatches && (
          <div className="w-full max-w-[100vw] overflow-x-hidden px-4 pt-24 pb-20 flex justify-center min-h-screen">
            {fetchingMatches ? <LoadingSpinner /> : matches.length > 0 && currentMatchIndex < matches.length ? (
              <div className="w-full max-w-[440px]">
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileCard variant="full" profile={matches[currentMatchIndex]} onClick={() => handleViewProfile(matches[currentMatchIndex])} showPassLike onPass={handlePass} onLike={handleLike} />
                </Suspense>
              </div>
            ) : (
              <div className="text-center border border-white/10 rounded-3xl p-6 sm:p-10 w-full max-w-md" style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                <p className="text-lg sm:text-xl font-bold mb-2">All caught up</p>
                <p className="text-sm text-white/60 font-light">Check back tomorrow.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}