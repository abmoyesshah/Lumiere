"use client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { motion } from "framer-motion";
import { User, MessageCircle, Video, LogOut, LogIn, UserPlus, Heart } from "lucide-react";

const Navbar = memo(function Navbar({ user, onLogout, transparent = false, variant = "default", onOpenAuth }) {
  const router = useRouter();

  const btn = "group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium tracking-wide transition-all";
  const ghost = "text-white/70 hover:text-white hover:bg-white/5 rounded-full border border-white/[0.08] hover:border-white/20";
  const primary = "text-white rounded-full font-semibold";
  const danger = "text-white/45 hover:text-fuchsia-300 rounded-full border border-transparent hover:border-white/10";
  const primaryStyle = {
    background: "linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #7c3aed 100%)",
    boxShadow: "0 10px 30px -8px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
  };

  return (
    <nav
      className={transparent ? "absolute top-0 left-0 right-0 z-50 bg-transparent" : "sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.06]"}
      style={transparent ? undefined : { background: "rgba(10,6,18,0.7)" }}
    >
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.button
            whileHover={{ opacity: 0.85 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
          >
            <span className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #d946ef, #7c3aed)",
                boxShadow: "0 8px 20px -4px rgba(168,85,247,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}>
              <Heart size={16} className="text-white fill-white" />
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">Lumière</span>
          </motion.button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!user ? (
              variant === "landing" && (
                <>
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenAuth?.("login")} className={`${btn} ${ghost}`}>
                    <LogIn size={13} /><span className="hidden xs:inline">Sign In</span>
                  </motion.button>
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenAuth?.("register")} className={`${btn} ${primary}`} style={primaryStyle}>
                    <UserPlus size={13} /><span className="hidden xs:inline">Join Free</span>
                  </motion.button>
                </>
              )
            ) : (
              <>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/profile")} className={`${btn} ${ghost}`}>
                  <User size={13} /><span className="hidden sm:inline">Profile</span>
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/matches")} className={`${btn} ${ghost}`}>
                  <Heart size={13} /><span className="hidden sm:inline">Matches</span>
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/chat")} className={`${btn} ${ghost}`}>
                  <MessageCircle size={13} /><span className="hidden sm:inline">Messages</span>
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/video-call")} className={`${btn} ${ghost}`}>
                  <Video size={13} /><span className="hidden sm:inline">Call</span>
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={onLogout} className={`${btn} ${danger}`}>
                  <LogOut size={13} /><span className="hidden sm:inline">Exit</span>
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