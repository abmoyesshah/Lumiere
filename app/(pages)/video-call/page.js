"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import CallSetupScreen from "@/components/CallSetupScreen";
import VideoCallControls from "@/components/VideoCallControls";

function VideoCallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { socket, isConnected } = useSocket();
  const [callActive, setCallActive] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const matchId = searchParams.get("matchId");

  const config = { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] };

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading, router]);

  useEffect(() => {
    if (socket && matchId) {
      socket.emit("initiate_call", { from: user?.id, to: matchId });
      socket.on("call_answered", (data) => handleRemoteAnswer(data.answer));
      socket.on("ice_candidate", (data) => addIceCandidate(data.candidate));
      return () => { socket.off("call_answered"); socket.off("ice_candidate"); };
    }
  }, [socket, matchId]);

  useEffect(() => {
    if (callActive) { durationIntervalRef.current = setInterval(() => setCallDuration(p => p + 1), 1000); }
    else { clearInterval(durationIntervalRef.current); setCallDuration(0); }
    return () => clearInterval(durationIntervalRef.current);
  }, [callActive]);

  const formatDuration = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const pc = new RTCPeerConnection(config);
      peerConnectionRef.current = pc;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      pc.ontrack = (event) => { setRemoteStream(event.streams[0]); if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0]; };
      pc.onicecandidate = (event) => { if (event.candidate && socket) socket.emit("ice_candidate", { to: matchId, candidate: event.candidate }); };
      const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
      socket?.emit("call_offer", { to: matchId, offer });
      setCallActive(true);
    } catch { alert("Failed to access camera or microphone"); }
  };

  const handleRemoteAnswer = async (answer) => { if (peerConnectionRef.current) await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer)); };
  const addIceCandidate = async (candidate) => { try { if (peerConnectionRef.current && candidate) await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)); } catch {} };
  const toggleMute = () => { if (localStream) { const t = localStream.getAudioTracks()[0]; if (t) { t.enabled = !t.enabled; setIsMuted(!t.enabled); } } };
  const toggleVideo = () => { if (localStream) { const t = localStream.getVideoTracks()[0]; if (t) { t.enabled = !t.enabled; setIsVideoOff(!t.enabled); } } };
  const toggleFullScreen = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullScreen(true); } else { document.exitFullscreen(); setIsFullScreen(false); } };
  const endCall = () => { if (peerConnectionRef.current) peerConnectionRef.current.close(); if (localStream) localStream.getTracks().forEach(t => t.stop()); if (remoteStream) remoteStream.getTracks().forEach(t => t.stop()); setCallActive(false); setLocalStream(null); setRemoteStream(null); router.push("/chat"); };

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-4 py-4">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/chat")}
          className="text-white/50 hover:text-[#d946ef] flex items-center gap-2 mb-4 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-light">
          <ArrowLeft size={13} /> Back to Messages
        </motion.button>

        {!callActive ? (
          <CallSetupScreen onStartCall={startCall} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08]" style={{ background: "#000" }}>
            <div className="relative aspect-video w-full" style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {!remoteStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-5">
                    <span className="absolute inset-0 rounded-full border border-[#d946ef]/30 animate-ping" />
                    <div className="relative w-full h-full rounded-full border border-[#d946ef]/50 flex items-center justify-center">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#d946ef]" />
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-light">Connecting</p>
                </div>
              )}
              <div className="absolute bottom-3 right-3 w-20 sm:w-36 aspect-video rounded-lg overflow-hidden border border-white/15">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {isVideoOff && <div className="absolute inset-0 flex items-center justify-center text-white/40 text-[8px] sm:text-[10px] uppercase" style={{ background: "#0a0612" }}>Off</div>}
              </div>
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 text-white text-[10px] sm:text-xs font-mono" style={{ background: "linear-gradient(135deg, #0a0612, #1a0f2e)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />{formatDuration(callDuration)}
              </div>
            </div>
            <VideoCallControls isMuted={isMuted} toggleMute={toggleMute} isVideoOff={isVideoOff} toggleVideo={toggleVideo} endCall={endCall} toggleFullScreen={toggleFullScreen} isFullScreen={isFullScreen} showSettings={showSettings} setShowSettings={setShowSettings} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function VideoCallPage() {
  return <Suspense fallback={<LoadingSpinner />}><VideoCallContent /></Suspense>;
}