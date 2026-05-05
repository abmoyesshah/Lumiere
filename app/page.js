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
  {
    id: 1, name: "Sarah", age: 28, location: "New York",
    profilePicture: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    bio: "Coffee addict, yoga lover, and sunset chaser. Looking for genuine connections with someone who loves deep conversations.",
    interests: ["Travel", "Photography", "Cooking", "Yoga", "Hiking"],
    matchScore: 95,
  },
  {
    id: 2, name: "Michael", age: 32, location: "Los Angeles",
    profilePicture: "/profile-4.jpg",
    bio: "Musician and producer. Let's make some magic together. I love concerts and late-night studio sessions.",
    interests: ["Music", "Surfing", "Art", "Concerts", "Travel"],
    matchScore: 88,
  },
  {
    id: 3, name: "Emma", age: 26, location: "Chicago",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    bio: "Architecture student by day, painter by night. Love deep conversations about art, design, and the meaning of life.",
    interests: ["Architecture", "Painting", "Hiking", "Museums", "Coffee"],
    matchScore: 92,
  },
  {
    id: 4, name: "James", age: 30, location: "Miami",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    bio: "Chef and food explorer. Can I cook for you? Looking for someone who appreciates good food and adventure.",
    interests: ["Cooking", "Fitness", "Travel", "Wine", "Beach"],
    matchScore: 87,
  },
  {
    id: 5, name: "Olivia", age: 27, location: "Seattle",
    profilePicture: "/profile-9.png",
    bio: "Tech entrepreneur who loves rainy days and good books. Looking for someone who can keep up with my coffee addiction.",
    interests: ["Reading", "Technology", "Coffee", "Hiking", "Startups"],
    matchScore: 91,
  },
  {
    id: 6, name: "Daniel", age: 31, location: "Austin",
    profilePicture: "/profile-7.jpg",
    bio: "Adventure seeker and dog dad. Always planning the next trip. Love live music and outdoor festivals.",
    interests: ["Adventure", "Dogs", "Music", "Camping", "Festivals"],
    matchScore: 89,
  },
];

const features = [
  { icon: Sparkles, title: "Smart Matching", desc: "Our AI learns what you love and finds people who truly get you." },
  { icon: Shield, title: "Verified Profiles", desc: "Every profile is checked. No bots, no fakes, just real people." },
  { icon: Users, title: "Quality Community", desc: "Join thousands of people looking for something real, not games." },
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
    <div className="min-h-screen relative overflow-x-hidden text-white" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar user={localUser} onLogout={handleLogout} transparent variant="landing" onOpenAuth={openAuth} />
        <Suspense fallback={null}>{showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} initialStateIsLogin={authMode === "login"} />}</Suspense>
        <AnimatePresence>{authBusy && <LoadingSpinner variant="overlay" label={authBusyLabel} />}</AnimatePresence>

        {/* ===== HERO SECTION ===== */}
        {!showSampleCards && !showRealMatches && (
          <>
            <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4">
              <div className="container mx-auto px-4 pt-20 pb-16 w-full">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  
                  {/* LEFT - Text */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-fuchsia-400/25 mb-6"
                      style={{ background: "linear-gradient(135deg, #1e0f32, #0f081c)" }}>
                      <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-fuchsia-200 font-medium">Download the App</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6 text-white">
                      Find your{" "}
                      <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">person</span>
                    </h1>
                    
                    <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                      Meaningful connections start here. No games, no endless swiping — just real people looking for something real.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSampleCards(true)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide"
                        style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                        Get Started <ArrowRight size={16} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => openAuth("login")}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border border-white/20 text-white/80 hover:border-white/40">
                        Sign In
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-white/40 text-xs">
                      <span className="flex items-center gap-1.5"><Star size={12} className="text-fuchsia-400" /> 4.9 Rating</span>
                      <span className="flex items-center gap-1.5"><Users size={12} className="text-fuchsia-400" /> 50k+ Members</span>
                      <span className="flex items-center gap-1.5"><Shield size={12} className="text-fuchsia-400" /> Verified</span>
                    </div>
                  </motion.div>

                  {/* RIGHT - Images */}
                  <div className="relative flex justify-center items-center" style={{ height: "clamp(400px, 60vh, 600px)" }}>
                    {/* Main card */}
                    <div className="relative z-30" style={{ width: "clamp(200px, 35vw, 280px)", height: "clamp(300px, 50vw, 420px)" }}>
                      <div className="relative w-full h-full rounded-2xl sm:rounded-[28px] overflow-hidden border border-white/10"
                        style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                        <img src={sampleProfiles[0].profilePicture} alt="" className="w-full h-full object-cover" loading="eager" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <p className="text-white font-bold text-lg">{sampleProfiles[0].name}, {sampleProfiles[0].age}</p>
                          <p className="text-fuchsia-300 text-xs uppercase tracking-widest">{sampleProfiles[0].location}</p>
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-semibold text-white"
                          style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                          {sampleProfiles[0].matchScore}% Match
                        </div>
                      </div>
                    </div>

                    {/* Secondary card 1 */}
                    <div className="absolute z-20 hidden sm:block"
                      style={{ right: "5%", top: "8%", width: "150px", height: "250px", borderRadius: "24px", overflow: "hidden", border: "1px solid white/10" }}>
                      <img src={sampleProfiles[1].profilePicture} alt="" className="w-full h-full object-cover" loading="eager" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <p className="text-white text-sm font-bold">{sampleProfiles[1].name}</p>
                        <p className="text-fuchsia-300 text-[9px] uppercase">{sampleProfiles[1].location}</p>
                      </div>
                    </div>

                    {/* Secondary card 2 */}
                    <div className="absolute z-10 hidden md:block"
                      style={{ left: "5%", bottom: "5%", width: "130px", height: "200px", borderRadius: "20px", overflow: "hidden", border: "1px solid white/10" }}>
                      <img src={sampleProfiles[2].profilePicture} alt="" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white text-xs font-bold">{sampleProfiles[2].name}</p>
                        <p className="text-fuchsia-300 text-[8px] uppercase">{sampleProfiles[2].location}</p>
                      </div>
                    </div>

                    {/* Match badge */}
                    <div className="absolute z-40 bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-400/30"
                      style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                      <Heart size={14} className="text-white fill-white" />
                      <span className="text-white text-xs font-bold">New Match!</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-16 sm:py-24 px-4">
              <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-12 sm:mb-16">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-fuchsia-400 font-medium mb-3">Why Lumière</p>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    Dating <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">reimagined</span>
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {features.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-6 sm:p-8 text-center border border-white/[0.06]"
                      style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                        <f.icon size={20} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                      <p className="text-sm text-white/50 font-light leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-16 sm:py-24 px-4">
              <div className="container mx-auto max-w-3xl text-center">
                <div className="rounded-3xl p-8 sm:p-12 border border-white/[0.06]"
                  style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                    <Heart size={24} className="text-white fill-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Your person is <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">out there</span>
                  </h2>
                  <p className="text-white/50 text-sm sm:text-base font-light mb-8 max-w-md mx-auto">
                    Join Lumière today and start making real connections with people who want the same things you do.
                  </p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSampleCards(true)}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide"
                    style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                    Browse Profiles <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="py-8 border-t border-white/[0.06]">
              <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Heart size={14} className="text-fuchsia-400 fill-fuchsia-400/40" />
                  <span className="font-serif italic text-fuchsia-200 font-bold text-sm">Lumière</span>
                </div>
                <p className="text-white/25 text-[10px]">© {new Date().getFullYear()} — Made with love</p>
              </div>
            </footer>
          </>
        )}

        {/* ===== SAMPLE CARDS ===== */}
        {showSampleCards && !localUser && (
          <div className="container mx-auto px-4 pt-8 pb-24 flex flex-col items-center min-h-screen">
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-white/50 text-xs sm:text-sm mb-4 text-center">
              Browse profiles — sign up to like or message
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-6 text-center">
              Tap ❤️ to sign up · Swipe ✕ to see more
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div key={sampleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="w-full flex justify-center">
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileCard
                    variant="full"
                    profile={sampleProfiles[sampleIndex]}
                    onClick={handleSampleView}
                    showPassLike
                    onPass={handleSamplePass}
                    onLike={handleSampleLike}
                  />
                </Suspense>
              </motion.div>
            </AnimatePresence>

            <div className="text-white/30 text-xs mt-8 flex items-center gap-3">
              <span>{sampleIndex + 1} of {sampleProfiles.length}</span>
              <span className="text-white/10">•</span>
              <button onClick={() => setShowSampleCards(false)} className="text-fuchsia-400/60 hover:text-fuchsia-400 text-xs underline underline-offset-2">
                Back to home
              </button>
            </div>
          </div>
        )}

        {/* ===== REAL MATCHES ===== */}
        {showRealMatches && (
          <div className="container mx-auto px-4 pt-12 pb-24 flex justify-center min-h-screen">
            {fetchingMatches ? <LoadingSpinner /> : matches.length > 0 && currentMatchIndex < matches.length ? (
              <Suspense fallback={<LoadingSpinner />}>
                <ProfileCard variant="full" profile={matches[currentMatchIndex]} onClick={() => handleViewProfile(matches[currentMatchIndex])} showPassLike onPass={handlePass} onLike={handleLike} />
              </Suspense>
            ) : (
              <div className="text-center border border-white/10 rounded-3xl p-8 sm:p-12 max-w-md mx-4" style={{ background: "linear-gradient(180deg, #1e0f32, #0f081c)" }}>
                <p className="text-xl sm:text-2xl font-bold mb-3">All caught up</p>
                <p className="text-sm text-white/60 font-light">Check back tomorrow for new matches.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}