"use client";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Video, ArrowLeft, Send, Circle, Search, Phone, MoreHorizontal, Smile, Image as ImageIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import MatchListItem from "@/components/MatchListItem";
import MessageBubble from "@/components/MessageBubble";
import SafeImage from "@/components/SafeImage";

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { socket, isConnected } = useSocket();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showMatchesList, setShowMatchesList] = useState(true);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => { if (!loading && !user) router.push("/"); }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/profile/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data.matches || []))
      .catch(console.error);
  }, [user]);

  const fetchMessages = async (matchId) => {
    try {
      const res = await fetch(`/api/messages?matchId=${matchId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    fetchMessages(match._id);
    if (window.innerWidth < 768) setShowMatchesList(false);
    if (socket) socket.emit("join_chat", { userId: user.id, matchId: match._id });
  };

  const handleViewProfile = (profile) => {
    if (profile?._id) router.push(`/profile/${profile._id}`);
  };

  useEffect(() => {
    if (socket && selectedMatch) {
      const handler = (data) => setMessages((prev) => [...prev, data]);
      socket.on("receive_message", handler);
      return () => socket.off("receive_message", handler);
    }
  }, [socket, selectedMatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedMatch._id, text: newMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        if (socket) {
          socket.emit("send_message", {
            senderId: user.id, receiverId: selectedMatch._id, text: newMessage,
          });
        }
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const filteredMatches = useMemo(() => {
    if (!search.trim()) return matches;
    return matches.filter((m) => m.name?.toLowerCase().includes(search.toLowerCase()));
  }, [matches, search]);

  // top "online" rail — first 12 matches simulated as online
  const onlineMatches = matches.slice(0, 12);

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#0a0612] relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6">
        <motion.button
          whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/")}
          className="text-white/50 hover:text-[#d946ef] flex items-center gap-2 mb-4 sm:mb-5 text-[11px] uppercase tracking-[0.25em] font-light transition"
        >
          <ArrowLeft size={14} /> Back
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-3 sm:gap-4 h-[calc(100vh-6rem)]">
          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className={`${showMatchesList ? "flex" : "hidden"} md:flex bg-[#0f0820] border border-white/[0.06] rounded-2xl overflow-hidden flex-col`}
          >
            {/* header */}
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-white tracking-wide">Messages</h2>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">
                  {matches.length}
                </span>
              </div>

              {/* search */}
              <div className="relative">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d946ef]/30 transition font-light"
                />
              </div>
            </div>

            {/* ONLINE PILL ROW (Instagram-style) */}
            {onlineMatches.length > 0 && (
              <div className="px-3 py-4 border-b border-white/[0.06]">
                <p className="px-2 text-[9px] uppercase tracking-[0.3em] text-white/40 font-light mb-3">Active now</p>
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 -mx-1 px-1">
                  {onlineMatches.map((m) => (
                    <button
                      key={m._id}
                      onClick={() => handleSelectMatch(m)}
                      className="flex-shrink-0 group flex items-center gap-2 pl-1 pr-3 py-1 bg-white/[0.03] hover:bg-[#d946ef]/[0.08] border border-white/[0.06] hover:border-[#d946ef]/30 rounded-full transition"
                    >
                      <div className="relative">
                        <SafeImage
                          user={m} name={m.name}
                          className="w-9 h-9 ring-2 ring-[#d946ef]/60"
                          textClassName="text-[#d946ef] text-sm"
                          iconSize={14}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#d946ef] ring-2 ring-[#0f0f0f]" />
                      </div>
                      <span className="text-white text-sm tracking-wide pr-1 max-w-[80px] truncate">
                        {m.name?.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* match list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center px-6 py-16">
                  <div className="w-12 h-12 rounded-full border border-[#d946ef]/30 flex items-center justify-center mb-5">
                    <MessageCircle className="w-5 h-5 text-[#d946ef]/60" />
                  </div>
                  <p className="text-lg text-white tracking-wide">
                    {search ? "No results" : "No connections yet"}
                  </p>
                  {!search && (
                    <motion.button
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                      onClick={() => router.push("/")}
                      className="mt-6 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium transition"
                    >
                      Discover
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  {filteredMatches.map((match) => (
                    <MatchListItem
                      key={match._id} match={match}
                      selected={selectedMatch?._id === match._id}
                      onSelect={handleSelectMatch}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.aside>

          {/* CHAT */}
          <motion.section
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`${!showMatchesList ? "flex" : "hidden"} md:flex bg-[#0f0820] border border-white/[0.06] rounded-2xl overflow-hidden flex-col`}
          >
            {selectedMatch ? (
              <>
                {/* header */}
                <div className="px-4 sm:px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setShowMatchesList(true)}
                      className="md:hidden text-white/50 hover:text-[#d946ef] p-1">
                      <ArrowLeft size={18} />
                    </button>
                    <button onClick={() => handleViewProfile(selectedMatch)} className="flex-shrink-0 relative">
                      <SafeImage user={selectedMatch} name={selectedMatch.name}
                        className="w-11 h-11 border border-white/10 hover:border-[#d946ef]/40 transition"
                        textClassName="text-[#d946ef] font-serif" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d946ef] ring-2 ring-[#0f0f0f]" />
                    </button>
                    <div className="min-w-0">
                      <h3 className="text-white text-lg tracking-wide truncate">{selectedMatch.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 flex items-center gap-1.5 font-light">
                        <Circle className={`w-1.5 h-1.5 ${isConnected ? "fill-[#d946ef] text-[#d946ef]" : "fill-white/20 text-white/20"}`} />
                        {isConnected ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }}
                      onClick={() => router.push(`/video-call?matchId=${selectedMatch._id}`)}
                      className="w-9 h-9 rounded-full hover:bg-white/[0.05] text-white/60 hover:text-[#d946ef] flex items-center justify-center transition"
                      aria-label="Call"
                    >
                      <Phone size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }}
                      onClick={() => router.push(`/video-call?matchId=${selectedMatch._id}`)}
                      className="w-9 h-9 rounded-full hover:bg-white/[0.05] text-white/60 hover:text-[#d946ef] flex items-center justify-center transition"
                      aria-label="Video"
                    >
                      <Video size={16} />
                    </motion.button>
                    <button className="w-9 h-9 rounded-full hover:bg-white/[0.05] text-white/60 hover:text-[#d946ef] flex items-center justify-center transition" aria-label="More">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                {/* messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center text-center pt-10 pb-6">
                      <SafeImage user={selectedMatch} name={selectedMatch.name}
                        className="w-20 h-20 mb-4 border border-[#d946ef]/30"
                        textClassName="text-[#d946ef] text-3xl" iconSize={28} />
                      <h4 className="text-white text-xl tracking-wide">{selectedMatch.name}</h4>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#d946ef] font-light mt-2">
                        New connection · Say hello
                      </p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg._id || idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      >
                        <MessageBubble
                          message={msg} isOwn={msg.senderId === user.id}
                          userProfilePicture={user.profilePicture}
                          matchProfilePicture={selectedMatch.profilePicture}
                          userName={user.name} matchName={selectedMatch.name}
                          onAvatarClick={() => handleViewProfile(
                            msg.senderId === user.id ? { _id: user.id } : selectedMatch
                          )}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* composer */}
                <form onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-white/[0.06] bg-black/20"
                >
                  <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] focus-within:border-[#d946ef]/40 rounded-full pl-2 pr-1.5 py-1.5 transition">
                    <button type="button" className="w-8 h-8 rounded-full hover:bg-white/[0.06] text-white/50 hover:text-[#d946ef] flex items-center justify-center transition" aria-label="Emoji">
                      <Smile size={17} />
                    </button>
                    <input
                      type="text" value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Message..."
                      className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm font-light py-1"
                    />
                    <button type="button" className="w-8 h-8 rounded-full hover:bg-white/[0.06] text-white/50 hover:text-[#d946ef] flex items-center justify-center transition" aria-label="Photo">
                      <ImageIcon size={16} />
                    </button>
                    <motion.button
                      type="submit" whileTap={{ scale: 0.92 }}
                      disabled={sending || !newMessage.trim()}
                      className="w-9 h-9 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)] text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                      aria-label="Send"
                    >
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
                <h3 className="text-2xl sm:text-3xl text-white tracking-wide">Your messages</h3>
                <p className="text-white/40 text-sm mt-3 max-w-sm font-light leading-relaxed">
                  Select someone from your connections to start a thoughtful exchange.
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
