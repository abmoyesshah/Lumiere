"use client";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Send, Circle, Search, Phone, Video } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import SafeImage from "@/components/SafeImage";

const MatchListItem = lazy(() => import("@/components/MatchListItem"));
const MessageBubble = lazy(() => import("@/components/MessageBubble"));

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { socket, isConnected } = useSocket();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showMatchesList, setShowMatchesList] = useState(true);
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/profile/matches").then(r => r.json()).then(d => setMatches(d.matches || [])).catch(() => {});
  }, [user]);

  const fetchMessages = useCallback(async (matchId) => {
    try { const r = await fetch(`/api/messages?matchId=${matchId}`); if (r.ok) { const d = await r.json(); setMessages(d.messages || []); } } catch {}
  }, []);

  const handleSelectMatch = useCallback((match) => {
    setSelectedMatch(match);
    fetchMessages(match._id);
    if (window.innerWidth < 768) setShowMatchesList(false);
    if (socket) socket.emit("join_chat", { userId: user.id, matchId: match._id });
  }, [fetchMessages, socket, user?.id]);

  const handleViewProfile = useCallback((p) => { if (p?._id) router.push(`/profile/${p._id}`); }, [router]);

  useEffect(() => {
    if (!socket || !selectedMatch) return;
    const h = (data) => { setMessages(p => [...p, data]); };
    socket.on("receive_message", h);
    return () => { socket.off("receive_message", h); };
  }, [socket, selectedMatch]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;
    setSending(true);
    try {
      const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ receiverId: selectedMatch._id, text: newMessage }) });
      if (r.ok) { const d = await r.json(); setMessages(p => [...p, d.message]); setNewMessage(""); if (socket) socket.emit("send_message", { senderId: user.id, receiverId: selectedMatch._id, text: newMessage }); }
    } catch {}
    finally { setSending(false); }
  }, [newMessage, selectedMatch, socket, user?.id]);

  const filteredMatches = useMemo(() => {
    if (!search.trim()) return matches;
    const q = search.toLowerCase();
    return matches.filter(m => m.name?.toLowerCase().includes(q));
  }, [matches, search]);

  const onlineMatches = matches.slice(0, 12);

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0a0612" }}>
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6">
        <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/")}
          className="text-white/50 hover:text-[#d946ef] flex items-center gap-2 mb-4 text-[11px] uppercase tracking-[0.25em] font-light">
          <ArrowLeft size={14} /> Back
        </motion.button>
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-3 h-[calc(100vh-6rem)]">
          <aside className={`${showMatchesList ? "flex" : "hidden"} md:flex border border-white/[0.06] rounded-2xl overflow-hidden flex-col`}
            style={{ background: "linear-gradient(180deg, #0f0820, #0a0612)" }}>
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-white tracking-wide">Messages</h2>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">{matches.length}</span>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
                  className="w-full pl-9 pr-3 py-2.5 border border-white/[0.06] rounded-full text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d946ef]/30 font-light"
                  style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }} />
              </div>
            </div>
            {onlineMatches.length > 0 && (
              <div className="px-3 py-4 border-b border-white/[0.06]">
                <p className="px-2 text-[9px] uppercase tracking-[0.3em] text-white/40 font-light mb-3">Active now</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {onlineMatches.map(m => (
                    <button key={m._id} onClick={() => handleSelectMatch(m)}
                      className="flex-shrink-0 flex items-center gap-2 pl-1 pr-3 py-1 border border-white/[0.06] hover:border-[#d946ef]/30 rounded-full"
                      style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
                      <div className="relative">
                        <SafeImage user={m} name={m.name} className="w-9 h-9 ring-2 ring-[#d946ef]/60" textClassName="text-[#d946ef] text-sm" iconSize={14} />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#d946ef] ring-2 ring-[#0f0820]" />
                      </div>
                      <span className="text-white text-sm max-w-[80px] truncate">{m.name?.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {filteredMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center px-6 py-16">
                  <div className="w-12 h-12 rounded-full border border-[#d946ef]/30 flex items-center justify-center mb-5">
                    <MessageCircle className="w-5 h-5 text-[#d946ef]/60" />
                  </div>
                  <p className="text-lg text-white">{search ? "No results" : "No connections yet"}</p>
                  {!search && (
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push("/")}
                      className="mt-6 text-white px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium"
                      style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>Discover</motion.button>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  {filteredMatches.map(m => (
                    <Suspense key={m._id} fallback={null}>
                      <MatchListItem match={m} selected={selectedMatch?._id === m._id} onSelect={handleSelectMatch} onViewProfile={handleViewProfile} />
                    </Suspense>
                  ))}
                </div>
              )}
            </div>
          </aside>
          <section className={`${!showMatchesList ? "flex" : "hidden"} md:flex border border-white/[0.06] rounded-2xl overflow-hidden flex-col`}
            style={{ background: "linear-gradient(180deg, #0f0820, #0a0612)" }}>
            {selectedMatch ? (
              <>
                <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setShowMatchesList(true)} className="md:hidden text-white/50 hover:text-[#d946ef]"><ArrowLeft size={18} /></button>
                    <button onClick={() => handleViewProfile(selectedMatch)} className="flex-shrink-0 relative">
                      <SafeImage user={selectedMatch} name={selectedMatch.name} className="w-11 h-11 border border-white/10" textClassName="text-[#d946ef] font-serif" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d946ef] ring-2 ring-[#0f0820]" />
                    </button>
                    <div className="min-w-0">
                      <h3 className="text-white text-lg truncate">{selectedMatch.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 flex items-center gap-1.5 font-light">
                        <Circle className={`w-1.5 h-1.5 ${isConnected ? "fill-[#d946ef] text-[#d946ef]" : "fill-white/20 text-white/20"}`} />
                        {isConnected ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button whileTap={{ scale: 0.94 }} onClick={() => router.push(`/video-call?matchId=${selectedMatch._id}`)}
                      className="w-9 h-9 rounded-full text-white/60 hover:text-[#d946ef] flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}><Phone size={16} /></motion.button>
                    <motion.button whileTap={{ scale: 0.94 }} onClick={() => router.push(`/video-call?matchId=${selectedMatch._id}`)}
                      className="w-9 h-9 rounded-full text-white/60 hover:text-[#d946ef] flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}><Video size={16} /></motion.button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center text-center pt-10 pb-6">
                      <SafeImage user={selectedMatch} name={selectedMatch.name} className="w-20 h-20 mb-4 border border-[#d946ef]/30" textClassName="text-[#d946ef] text-3xl" iconSize={28} />
                      <h4 className="text-white text-xl">{selectedMatch.name}</h4>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#d946ef] font-light mt-2">New connection · Say hello</p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div key={msg._id || idx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
                        <Suspense fallback={null}>
                          <MessageBubble message={msg} isOwn={msg.senderId === user.id} userProfilePicture={user.profilePicture} matchProfilePicture={selectedMatch.profilePicture}
                            userName={user.name} matchName={selectedMatch.name}
                            onAvatarClick={() => handleViewProfile(msg.senderId === user.id ? { _id: user.id } : selectedMatch)} />
                        </Suspense>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.06]"
                  style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}>
                  <div className="flex items-center gap-2 border border-white/[0.08] focus-within:border-[#d946ef]/40 rounded-full pl-2 pr-1.5 py-1.5"
                    style={{ background: "linear-gradient(135deg, #1a0f2e, #0f081c)" }}>
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Message..."
                      className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm font-light py-1 px-2" />
                    <motion.button type="submit" whileTap={{ scale: 0.92 }} disabled={sending || !newMessage.trim()}
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
                <div className="w-16 h-16 rounded-full border border-[#d946ef]/30 flex items-center justify-center mb-6">
                  <MessageCircle className="w-7 h-7 text-[#d946ef]/60" />
                </div>
                <h3 className="text-2xl text-white">Your messages</h3>
                <p className="text-white/40 text-sm mt-3 max-w-sm font-light">Select someone from your connections.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}