import { motion } from "framer-motion";
import { Mic, MicOff, Camera, CameraOff, PhoneOff, Maximize2, Minimize2, Settings } from "lucide-react";

export default function VideoCallControls({
  isMuted, toggleMute, isVideoOff, toggleVideo,
  endCall, toggleFullScreen, isFullScreen,
  showSettings, setShowSettings,
}) {
  const baseBtn = "p-3 sm:p-3.5 rounded-full border transition-all";
  const idle = "bg-white/[0.04] text-white border-white/10 hover:border-[#d946ef]/40 hover:text-[#d946ef]";
  const active = "bg-[#d946ef]/10 text-[#d946ef] border-[#d946ef]/40";

  return (
    <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="mx-auto flex w-fit items-center justify-center gap-2.5 sm:gap-3 rounded-full bg-black/60 backdrop-blur-2xl border border-white/[0.08] px-4 py-2.5 sm:px-5 sm:py-3"
      >
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }}
          onClick={toggleMute} className={`${baseBtn} ${isMuted ? active : idle}`}>
          {isMuted ? <MicOff size={17} /> : <Mic size={17} />}
        </motion.button>

        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }}
          onClick={toggleVideo} className={`${baseBtn} ${isVideoOff ? active : idle}`}>
          {isVideoOff ? <CameraOff size={17} /> : <Camera size={17} />}
        </motion.button>

        <motion.button whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.92 }}
          onClick={endCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition border border-red-400/30"
        >
          <PhoneOff size={18} />
        </motion.button>

        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }}
          onClick={toggleFullScreen} className={`hidden sm:block ${baseBtn} ${idle}`}>
          {isFullScreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </motion.button>

        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }}
          onClick={() => setShowSettings(!showSettings)} className={`hidden sm:block ${baseBtn} ${idle}`}>
          <Settings size={17} />
        </motion.button>
      </motion.div>
    </div>
  );
}