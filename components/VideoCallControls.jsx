"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";

const VideoCallControls = memo(function VideoCallControls({ isMuted, toggleMute, isVideoOff, toggleVideo, endCall }) {
  const baseBtn = "p-2.5 sm:p-3 rounded-full border transition-all";
  const idle = "text-white border-white/10";

  return (
    <div className="px-3 pb-4 pt-3 w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mx-auto flex w-fit items-center justify-center gap-2 sm:gap-3 rounded-full border border-white/[0.08] px-3 sm:px-4 py-2"
        style={{ background: "linear-gradient(180deg, #0a0612, #1a0f2e)" }}>
        <motion.button whileTap={{ scale: 0.94 }} onClick={toggleMute}
          className={`${baseBtn} ${isMuted ? "text-[#d946ef] border-[#d946ef]/40" : idle}`}
          style={{ background: isMuted ? "linear-gradient(135deg, #d946ef, #7c3aed)" : "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
          {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={toggleVideo}
          className={`${baseBtn} ${isVideoOff ? "text-[#d946ef] border-[#d946ef]/40" : idle}`}
          style={{ background: isVideoOff ? "linear-gradient(135deg, #d946ef, #7c3aed)" : "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
          {isVideoOff ? <CameraOff size={15} /> : <Camera size={15} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.92 }} onClick={endCall}
          className="p-3 sm:p-3.5 rounded-full text-white" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
          <PhoneOff size={16} />
        </motion.button>
      </motion.div>
    </div>
  );
});

export default VideoCallControls;