"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {User,MessageCircle,Video,Heart,X,MapPin,Sparkles,LogIn,UserPlus,Camera,Award,Shield,Target,LogOut,} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [fetchingMatches, setFetchingMatches] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showLanding, setShowLanding] = useState(false);

  // Show landing page when user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowLanding(true);
    } else {
      setShowLanding(false);
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      setFetchingMatches(true);
      try {
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches);
          // Show landing if no matches found
          if (data.matches.length === 0) {
            setShowLanding(true);
          } else {
            setShowLanding(false);
          }
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setFetchingMatches(false);
      }
    };

    fetchMatches();
  }, [user]);

  const handleLike = async () => {
    const currentMatch = matches[currentMatchIndex];
    if (!currentMatch) return;

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likedUserId: currentMatch._id }),
      });

      const data = await res.json();

      if (data.matched) {
        alert("It's a match! 🎉");
      }

      // Check if this was the last profile
      if (currentMatchIndex + 1 >= matches.length) {
        setShowLanding(true);
      } else {
        setCurrentMatchIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error liking user:", error);
    }
  };

  const handlePass = () => {
    // Check if this was the last profile
    if (currentMatchIndex + 1 >= matches.length) {
      setShowLanding(true);
    } else {
      setCurrentMatchIndex((prev) => prev + 1);
    }
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Beautiful Landing Page with Card Deck
  if (showLanding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Navigation Bar for Landing Page */}
        <nav className="bg-transparent absolute top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-pink-300" />
                <span className="ml-2 text-xl font-bold text-white">
                  SoulMatch
                </span>
              </div>

              {/* Conditional Navigation */}
              <div className="flex items-center space-x-4">
                {!user ? (
                  // Show for non-logged in users
                  <>
                    <button
                      onClick={() => router.push("/")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
                    >
                      <LogIn size={20} />
                      <span className="hidden sm:inline">Sign In</span>
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg transition"
                    >
                      <UserPlus size={20} />
                      <span className="hidden sm:inline">Sign Up</span>
                    </button>
                  </>
                ) : (
                  // Show for logged in users with no matches
                  <>
                    <button
                      onClick={() => router.push("/profile")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
                    >
                      <User size={20} />
                      <span className="hidden sm:inline">Profile</span>
                    </button>
                    <button
                      onClick={() => router.push("/chat")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
                    >
                      <MessageCircle size={20} />
                      <span className="hidden sm:inline">Chat</span>
                    </button>
                    <button
                      onClick={() => router.push("/video-call")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
                    >
                      <Video size={20} />
                      <span className="hidden sm:inline">Video Call</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 transition"
                    >
                      <LogOut size={20} />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              Find Your
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 text-transparent bg-clip-text">
                {" "}
                Match
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {!user
                ? "Join thousands of happy couples who found love on our platform"
                : "No more profiles! Check back later or update your profile for better matches"}
            </p>
          </motion.div>

          {/* Card Deck - Stacked Cards */}
          {/* Card Deck - Overlapping like playing cards in hand */}
          <div className="relative h-[600px] max-w-7xl mx-auto mt-16 mb-32">
            <div className="relative flex justify-center">
              {/* Card 1 (Left) */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: -8 }}
                transition={{ duration: 0.5, delay: 0 }}
                whileHover={{
                  y: -40,
                  rotate: -10,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                }}
                className="absolute w-80 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform-gpu"
                style={{
                  left: "calc(50% - 480px)",
                  zIndex: 5,
                  transform: "rotate(-8deg)",
                  boxShadow: "0 30px 50px rgba(0,0,0,0.4)",
                }}
                onClick={() => !user && router.push("/")}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop"
                    alt="Sarah"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold">Sarah, 28</h2>
                    <p className="text-base opacity-90 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      New York
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-base font-semibold">
                    95% Match
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Travel
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Coffee
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Hiking
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotate: -4 }}
                animate={{ opacity: 1, x: 0, rotate: -4 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{
                  y: -40,
                  rotate: -6,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                }}
                className="absolute w-80 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform-gpu"
                style={{
                  left: "calc(50% - 320px)",
                  zIndex: 4,
                  transform: "rotate(-4deg)",
                  boxShadow: "0 30px 50px rgba(0,0,0,0.4)",
                }}
                onClick={() => !user && router.push("/")}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop"
                    alt="Michael"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold">Michael, 32</h2>
                    <p className="text-base opacity-90 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Los Angeles
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-base font-semibold">
                    88% Match
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Fitness
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Tech
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Foodie
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 (Center) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  y: -40,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                }}
                className="absolute w-80 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform-gpu"
                style={{
                  left: "calc(50% - 160px)",
                  zIndex: 3,
                  boxShadow: "0 30px 50px rgba(0,0,0,0.4)",
                }}
                onClick={() => !user && router.push("/")}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop"
                    alt="Emma"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold">Emma, 26</h2>
                    <p className="text-base opacity-90 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Chicago
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-base font-semibold">
                    92% Match
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Art
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Music
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Movies
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 4 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{
                  y: -40,
                  rotate: 6,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                }}
                className="absolute w-80 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform-gpu"
                style={{
                  left: "calc(50% + 0px)",
                  zIndex: 2,
                  transform: "rotate(4deg)",
                  boxShadow: "0 30px 50px rgba(0,0,0,0.4)",
                }}
                onClick={() => !user && router.push("/")}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop"
                    alt="James"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold">James, 30</h2>
                    <p className="text-base opacity-90 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Miami
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-base font-semibold">
                    87% Match
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Beach
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Fitness
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Health
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Card 5 (Right) */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 8 }}
                animate={{ opacity: 1, x: 0, rotate: 8 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{
                  y: -40,
                  rotate: 10,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                }}
                className="absolute w-80 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform-gpu"
                style={{
                  left: "calc(50% + 160px)",
                  zIndex: 1,
                  transform: "rotate(8deg)",
                  boxShadow: "0 30px 50px rgba(0,0,0,0.4)",
                }}
                onClick={() => !user && router.push("/")}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop"
                    alt="Olivia"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold">Olivia, 27</h2>
                    <p className="text-base opacity-90 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Seattle
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-base font-semibold">
                    91% Match
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Reading
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Coffee
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Nature
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-32"
          >
            {[
              {
                icon: Sparkles,
                title: "Smart Matching",
                desc: "AI-powered compatibility scores",
              },
              {
                icon: Target,
                title: "Perfect Matches",
                desc: "Find people who share your interests",
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                desc: "Your privacy is our priority",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
                >
                  <Icon className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              );
            })}
          </motion.div>

          {/* For logged-in users with no profiles */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-16"
            >
              <button
                onClick={() => router.push("/profile")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl px-12 py-4 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center gap-2 mx-auto"
              >
                <Camera size={24} />
                Update Your Profile
              </button>
              <p className="text-gray-300 mt-4">
                Better profile = Better matches!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (fetchingMatches) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-2xl text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          </motion.div>
          Finding your perfect match...
        </motion.div>
      </div>
    );
  }

  // This should never happen because showLanding will be true if no matches
  if (matches.length === 0 || currentMatchIndex >= matches.length) {
    return null;
  }

  const currentMatch = matches[currentMatchIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600">
      {/* Navigation Bar for Logged-in Users with Matches */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-pink-300" />
              <span className="ml-2 text-xl font-bold text-white">
                SoulMatch
              </span>
            </div>

            {/* Navigation Links - Only show for logged in users */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
              >
                <User size={20} />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <button
                onClick={() => router.push("/chat")}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
              >
                <MessageCircle size={20} />
                <span className="hidden sm:inline">Chat</span>
              </button>

              <button
                onClick={() => router.push("/video-call")}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
              >
                <Video size={20} />
                <span className="hidden sm:inline">Video Call</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 transition"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMatch._id}
              initial={{ opacity: 0, scale: 0.8, x: 300 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
              onClick={() => handleViewProfile(currentMatch)}
            >
              <div className="relative aspect-[4/5]">
                {currentMatch.profilePhoto ? (
                  <img
                    src={currentMatch.profilePhoto}
                    alt={currentMatch.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-4xl font-bold">
                    {currentMatch.name}, {currentMatch.age}
                  </h2>
                  <p className="text-lg opacity-90 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {currentMatch.location}
                  </p>
                </div>

                {/* Match Score Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                  <Award size={16} />
                  {currentMatch.matchScore}% Match
                </div>
              </div>

              <div className="p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <User className="w-5 h-5 mr-2 text-pink-500" />
                    About
                  </h3>
                  <p className="text-gray-600">
                    {currentMatch.bio || "No bio yet"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.interests?.map((interest, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePass();
                    }}
                    className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-200 transition transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <X size={24} />
                    Pass
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Heart size={24} />
                    Like
                  </button>
                </motion.div>

                <p className="text-center text-gray-400 text-sm mt-4">
                  {matches.length - currentMatchIndex - 1} profiles left
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Profile View Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={handleCloseProfile}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-500 to-purple-600">
                {selectedProfile.profilePhoto ? (
                  <img
                    src={selectedProfile.profilePhoto}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-24 h-24 text-white" />
                  </div>
                )}
                <button
                  onClick={handleCloseProfile}
                  className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedProfile.name}, {selectedProfile.age}
                </h2>
                <p className="text-gray-600 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {selectedProfile.location}
                </p>

                {selectedProfile.bio && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <User className="w-5 h-5 mr-2 text-pink-500" />
                      About
                    </h3>
                    <p className="text-gray-600">{selectedProfile.bio}</p>
                  </div>
                )}

                {selectedProfile.interests?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCloseProfile}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleCloseProfile();
                      router.push(`/chat?userId=${selectedProfile._id}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .perspective {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
