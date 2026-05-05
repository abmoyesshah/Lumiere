"use client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { motion } from "framer-motion";
import { User, MessageCircle, Video, LogOut, LogIn, UserPlus, Heart } from "lucide-react";

const Navbar = memo(function Navbar({ user, onLogout, transparent = false, variant = "default", onOpenAuth }) {
  const router = useRouter();
  const btn = "group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium tracking-wide transition-all";
  const ghost = "text-white/70 hover:text-white hover:bg-white/5 rounded-full border border-white/[0.08] hover:border-white/20";
  const danger = "text-white/45 hover:text-fuchsia-300 rounded-full border border-transparent hover:border-white/10";

  return (
    <nav className={transparent ? "absolute top-0 left-0 right-0 z-50" : "sticky top-0 z-50 border-b border-white/[0.06]"}
      style={transparent ? undefined : { background: "linear-gradient(180deg, #0a0612, #120820)" }}>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.button whileHover={{ opacity: 0.85 }} onClick={() => router.push("/")} className="flex items-center gap-2.5">
            <span className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
              <Heart size={16} className="text-white fill-white" />
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">Lumière</span>
          </motion.button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!user ? (
              variant === "landing" && (
                <>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => onOpenAuth?.("login")} className={`${btn} ${ghost}`}>
                    <LogIn size={13} /><span className="hidden xs:inline">Sign In</span>
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => onOpenAuth?.("register")}
                    className={`${btn} text-white rounded-full font-semibold`}
                    style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                    <UserPlus size={13} /><span className="hidden xs:inline">Join Free</span>
                  </motion.button>
                </>
              )
            ) : (
              <>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/profile")} className={`${btn} ${ghost}`}>
                  <User size={13} /><span className="hidden sm:inline">Profile</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/matches")} className={`${btn} ${ghost}`}>
                  <Heart size={13} /><span className="hidden sm:inline">Matches</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/chat")} className={`${btn} ${ghost}`}>
                  <MessageCircle size={13} /><span className="hidden sm:inline">Messages</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/video-call")} className={`${btn} ${ghost}`}>
                  <Video size={13} /><span className="hidden sm:inline">Call</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onLogout} className={`${btn} ${danger}`}>
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