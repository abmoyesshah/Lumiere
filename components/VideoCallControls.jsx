"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Camera, CameraOff, PhoneOff, Maximize2, Minimize2, Settings } from "lucide-react";

const VideoCallControls = memo(function VideoCallControls({
  isMuted, toggleMute, isVideoOff, toggleVideo,
  endCall, toggleFullScreen, isFullScreen,
  showSettings, setShowSettings,
}) {
  const baseBtn = "p-3 sm:p-3.5 rounded-full border transition-all";
  const idle = "text-white border-white/10 hover:border-[#d946ef]/40 hover:text-[#d946ef]";
  const active = "text-[#d946ef] border-[#d946ef]/40";

  return (
    <div className="px-4 pb-5 pt-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex w-fit items-center justify-center gap-2.5 rounded-full border border-white/[0.08] px-4 py-2.5"
        style={{ background: "linear-gradient(180deg, #0a0612, #1a0f2e)" }}>
        <motion.button whileTap={{ scale: 0.94 }} onClick={toggleMute}
          className={`${baseBtn} ${isMuted ? active : idle}`}
          style={{ background: isMuted ? "linear-gradient(135deg, #d946ef, #7c3aed)" : "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
          {isMuted ? <MicOff size={17} /> : <Mic size={17} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={toggleVideo}
          className={`${baseBtn} ${isVideoOff ? active : idle}`}
          style={{ background: isVideoOff ? "linear-gradient(135deg, #d946ef, #7c3aed)" : "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
          {isVideoOff ? <CameraOff size={17} /> : <Camera size={17} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.92 }} onClick={endCall}
          className="p-4 rounded-full text-white"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
          <PhoneOff size={18} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={toggleFullScreen}
          className={`hidden sm:block ${baseBtn} ${idle}`}
          style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
          {isFullScreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowSettings(!showSettings)}
          className={`hidden sm:block ${baseBtn} ${idle}`}
          style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
          <Settings size={17} />
        </motion.button>
      </motion.div>
    </div>
  );
});

export default VideoCallControls;