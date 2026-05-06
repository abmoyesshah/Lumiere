"use client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { motion } from "framer-motion";
import { User, MessageCircle, Video, LogOut, LogIn, UserPlus, Heart } from "lucide-react";

const Navbar = memo(function Navbar({ user, onLogout, transparent = false, variant = "default", onOpenAuth }) {
  const router = useRouter();
  const btn = "group flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium tracking-wide transition-all rounded-full";
  const ghost = "text-white/70 hover:text-white hover:bg-white/5 border border-white/[0.08] hover:border-white/20";
  const danger = "text-white/45 hover:text-fuchsia-300 border border-transparent hover:border-white/10";

  return (
    <nav className={`w-full ${transparent ? "absolute top-0 left-0 right-0 z-50" : "sticky top-0 z-50 border-b border-white/[0.06]"}`}
      style={transparent ? undefined : { background: "linear-gradient(180deg, #0a0612, #120820)" }}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-20">
          <motion.button whileHover={{ opacity: 0.85 }} onClick={() => router.push("/")} className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <span className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
              <Heart size={12} className="sm:w-4 sm:h-4 text-white fill-white" />
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">Lumière</span>
          </motion.button>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {!user ? (
              variant === "landing" && (
                <>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => onOpenAuth?.("login")} className={`${btn} ${ghost}`}>
                    <LogIn size={12} /><span className="hidden sm:inline">Sign In</span>
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => onOpenAuth?.("register")}
                    className={`${btn} text-white font-semibold`}
                    style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                    <UserPlus size={12} /><span className="hidden sm:inline">Join Free</span>
                  </motion.button>
                </>
              )
            ) : (
              <>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/profile")} className={`${btn} ${ghost}`}>
                  <User size={12} /><span className="hidden lg:inline">Profile</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/matches")} className={`${btn} ${ghost}`}>
                  <Heart size={12} /><span className="hidden lg:inline">Matches</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/chat")} className={`${btn} ${ghost}`}>
                  <MessageCircle size={12} /><span className="hidden lg:inline">Messages</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/video-call")} className={`${btn} ${ghost}`}>
                  <Video size={12} /><span className="hidden lg:inline">Call</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onLogout} className={`${btn} ${danger}`}>
                  <LogOut size={12} /><span className="hidden lg:inline">Exit</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;