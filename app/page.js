"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import ProfileCard from "@/components/ProfileCard";

const sampleProfiles = [
  {
    id: 1,
    name: "Sarah",
    age: 28,
    location: "New York",
    profilePicture:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
    bio: "Coffee addict, yoga lover, and sunset chaser. Looking for genuine connections.",
    interests: ["Travel", "Photography", "Cooking", "Yoga"],
    matchScore: 95,
  },
  {
    id: 2,
    name: "Michael",
    age: 32,
    location: "Los Angeles",
    profilePicture: "/profile-4.jpg",
    bio: "Musician and producer. Let's make some magic together.",
    interests: ["Music", "Surfing", "Art", "Concerts"],
    matchScore: 88,
  },
  {
    id: 3,
    name: "Emma",
    age: 26,
    location: "Chicago",
    profilePicture:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
    bio: "Architecture student by day, painter by night. Love deep conversations.",
    interests: ["Architecture", "Painting", "Hiking", "Museums"],
    matchScore: 92,
  },
  {
    id: 4,
    name: "James",
    age: 30,
    location: "Miami",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    bio: "Chef and food explorer. Can I cook for you?",
    interests: ["Cooking", "Fitness", "Travel", "Wine"],
    matchScore: 87,
  },
  {
    id: 5,
    name: "Olivia",
    age: 27,
    location: "Seattle",
    profilePicture: "/profile-9.png",
    bio: "Tech entrepreneur who loves rainy days and good books.",
    interests: ["Reading", "Technology", "Coffee", "Hiking"],
    matchScore: 91,
  },
  {
    id: 6,
    name: "Daniel",
    age: 31,
    location: "Austin",
    profilePicture: "/profile-7.jpg",
    bio: "Adventure seeker and dog dad. Always planning the next trip.",
    interests: ["Adventure", "Dogs", "Music", "Camping"],
    matchScore: 89,
  },
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

  // ── Minimal flow states ──
  const [showSampleCards, setShowSampleCards] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  // ── Fetch real matches only when logged in ──
  useEffect(() => {
    if (!localUser) {
      setMatches([]);
      return;
    }
    const fetchMatches = async () => {
      setFetchingMatches(true);
      try {
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches);
          setCurrentMatchIndex(0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingMatches(false);
      }
    };
    fetchMatches();
  }, [localUser]);

  const handleLogout = async () => {
    setAuthBusyLabel("Signing out");
    setAuthBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setLocalUser(null);
    setMatches([]);
    setCurrentMatchIndex(0);
    setShowSampleCards(false);
    setSampleIndex(0);
    router.push("/");
    setTimeout(() => setAuthBusy(false), 600);
  };

  const handleAuthSuccess = (u) => {
    setAuthBusyLabel("Welcome");
    setAuthBusy(true);
    setLocalUser(u);
    setShowSampleCards(false);
    setTimeout(() => {
      setAuthBusy(false);
      router.push("/");
    }, 900);
  };

  // ── Sample card actions ──
  const handleSampleView = () => {
    // Clicking the card → trigger auth
    if (!localUser) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
  };

  const handleSampleLike = () => {
    // Like button → trigger auth
    if (!localUser) {
      setAuthMode("register");
      setShowAuthModal(true);
      return;
    }
    goToNextSample();
  };

  const handleSamplePass = () => {
    // Pass button → JUST MOVE TO NEXT CARD, NO AUTH
    goToNextSample();
  };

  const goToNextSample = () => {
    if (sampleIndex + 1 < sampleProfiles.length) {
      setSampleIndex((p) => p + 1);
    } else {
      setSampleIndex(0);
    }
  };

  // ── Real match actions ──
  const handleViewProfile = (p) => {
    setAuthBusyLabel("Loading");
    setAuthBusy(true);
    router.push(`/profile/${p._id ?? p.id}`);
    setTimeout(() => setAuthBusy(false), 700);
  };

  const handlePass = () => {
    if (currentMatchIndex + 1 < matches.length)
      setCurrentMatchIndex((p) => p + 1);
    else setMatches([]);
  };

  const handleLike = async () => {
    const current = matches[currentMatchIndex];
    if (!current) return;
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likedUserId: current._id }),
      });
      const data = await res.json();
      if (data.matched) alert("It's a match.");
      if (currentMatchIndex + 1 < matches.length)
        setCurrentMatchIndex((p) => p + 1);
      else setMatches([]);
    } catch (e) {
      console.error(e);
    }
  };

  const openAuth = (mode = "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) return <LoadingSpinner />;

  const showRealMatches = localUser && matches.length > 0 && !showSampleCards;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden text-white"
      style={{ backgroundColor: "#0a0612" }}
    >
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar
          user={localUser}
          onLogout={handleLogout}
          transparent
          variant="landing"
          onOpenAuth={openAuth}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          initialStateIsLogin={authMode === "login"}
        />
        <AnimatePresence>
          {authBusy && (
            <LoadingSpinner variant="overlay" label={authBusyLabel} />
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════
            MINIMAL HERO
        ══════════════════════════════════════════ */}
        {!showSampleCards && !showRealMatches && (
          <section className="relative min-h-screen flex items-center overflow-hidden px-4">
            <div
              className="absolute top-0 right-0 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] opacity-20 blur-[140px] pointer-events-none rounded-full"
              style={{
                background:
                  "radial-gradient(circle,#d946ef,#7c3aed,transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] opacity-10 blur-[100px] pointer-events-none rounded-full"
              style={{
                background: "radial-gradient(circle,#a855f7,transparent 70%)",
              }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 md:py-24 w-full">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center lg:text-left"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6 text-white">
                    Find your{" "}
                    <span className="font-serif italic bg-gradient-to-r from-fuchsia-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                      person
                    </span>
                  </h1>

                  <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
                    Meaningful connections start here. No games, just real
                    people.
                  </p>

                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSampleCards(true)}
                    className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide"
                    style={{
                      background:
                        "linear-gradient(135deg,#d946ef 0%,#a855f7 50%,#7c3aed 100%)",
                      boxShadow:
                        "0 20px 50px -10px rgba(168,85,247,0.6),inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    Get Started
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition"
                    />
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative flex justify-center items-center mt-8 lg:mt-0"
                  style={{ height: "clamp(300px, 50vh, 500px)" }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-20"
                    style={{
                      width: "clamp(200px, 40vw, 280px)",
                      height: "clamp(300px, 55vw, 420px)",
                    }}
                  >
                    <div
                      className="relative w-full h-full rounded-2xl sm:rounded-[28px] overflow-hidden"
                      style={{
                        boxShadow:
                          "0 30px 80px -10px rgba(168,85,247,0.4), 0 0 0 2px rgba(255,255,255,0.12)",
                      }}
                    >
                      <img
                        src={sampleProfiles[0].profilePicture}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 50%)",
                        }}
                      />
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                        <p className="text-white font-bold text-base sm:text-lg">
                          {sampleProfiles[0].name}
                        </p>
                        <p className="text-fuchsia-300 text-[10px] sm:text-xs uppercase tracking-widest">
                          {sampleProfiles[0].location}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -6, 0], rotate: [-4, -2, -4] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                    className="absolute z-10 hidden sm:block"
                    style={{
                      right: "clamp(5px, 5vw, 20px)",
                      top: "clamp(20px, 8vw, 30px)",
                      width: "clamp(120px, 25vw, 170px)",
                      height: "clamp(200px, 40vw, 280px)",
                      borderRadius: "24px",
                      overflow: "hidden",
                      boxShadow:
                        "0 20px 50px -10px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.1)",
                    }}
                  >
                    <img
                      src={sampleProfiles[1].profilePicture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 50%)",
                      }}
                    />
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                      <p className="text-white text-xs sm:text-sm font-bold">
                        {sampleProfiles[1].name}
                      </p>
                      <p className="text-fuchsia-300 text-[8px] sm:text-[9px] uppercase">
                        {sampleProfiles[1].location}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            SAMPLE CARDS
        ══════════════════════════════════════════ */}
        {showSampleCards && !localUser && (
          <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-24 flex flex-col items-center min-h-screen">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/50 text-xs sm:text-sm mb-6 sm:mb-8 text-center px-4"
            >
              Browse profiles — sign up to connect
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div
                key={sampleIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <ProfileCard
                  variant="full"
                  profile={sampleProfiles[sampleIndex]}
                  onClick={handleSampleView}
                  showPassLike
                  onPass={handleSamplePass}
                  onLike={handleSampleLike}
                />
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/30 text-xs mt-6 sm:mt-8 text-center flex items-center gap-2"
            >
              <span>
                {sampleIndex + 1} of {sampleProfiles.length}
              </span>
              <span className="text-white/10">•</span>
              <button
                onClick={() => setShowSampleCards(false)}
                className="text-fuchsia-400/60 hover:text-fuchsia-400 transition text-xs underline underline-offset-2"
              >
                Back to home
              </button>
            </motion.div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            REAL MATCHES
        ══════════════════════════════════════════ */}
        {showRealMatches && (
          <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 flex justify-center min-h-screen">
            {fetchingMatches ? (
              <LoadingSpinner />
            ) : matches.length > 0 && currentMatchIndex < matches.length ? (
              <ProfileCard
                variant="full"
                profile={matches[currentMatchIndex]}
                onClick={() => handleViewProfile(matches[currentMatchIndex])}
                showPassLike
                onPass={handlePass}
                onLike={handleLike}
              />
            ) : (
              <div className="text-center bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 max-w-md mx-4">
                <p className="text-xl sm:text-2xl font-bold tracking-tight mb-3">
                  All caught up
                </p>
                <p className="text-sm text-white/60 font-light">
                  We're curating new connections. Check back tomorrow.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        {!showSampleCards && !showRealMatches && (
          <footer
            className="py-6 sm:py-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Heart
                  size={14}
                  className="text-fuchsia-400 fill-fuchsia-400/40"
                />
                <span className="font-serif italic text-fuchsia-200 font-bold text-sm sm:text-base">
                  Lumière
                </span>
              </div>
              <p className="text-white/25 text-[10px] sm:text-[11px] mt-2">
                © {new Date().getFullYear()} — Made with love
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}