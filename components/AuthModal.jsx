"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Heart, MapPin, Calendar } from "lucide-react";

const Field = memo(function Field({ icon, children }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] focus-within:border-fuchsia-400/40 transition">
      <span className="text-fuchsia-300/70 flex-shrink-0">{icon}</span>
      {children}
    </div>
  );
});

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialStateIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(initialStateIsLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", location: "" });

  useEffect(() => { setIsLogin(initialStateIsLogin); }, [initialStateIsLogin, isOpen]);
  useEffect(() => { if (isOpen) setError(""); }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const update = useCallback((k) => (e) => setForm(p => ({ ...p, [k]: e.target.value })), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { 
            name: form.name, 
            email: form.email, 
            password: form.password,
            age: parseInt(form.age) || 25,
            location: form.location || "Unknown",
            bio: "",
            interests: []
          };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Something went wrong.");
      else { onAuthSuccess?.(data.user || data); onClose?.(); }
    } catch { setError("Network error"); }
    finally { setSubmitting(false); }
  }, [isLogin, form, onAuthSuccess, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "linear-gradient(180deg, #0a0612, #120820)" }}
          onClick={onClose}>
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-3xl overflow-hidden border border-white/10"
              style={{ background: "linear-gradient(160deg, #1e0f32, #0f081c)" }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #d946ef, #a855f7, transparent)" }} />
              <div className="relative px-8 pt-10 pb-6 text-center">
                <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10">
                  <X size={16} />
                </button>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }}>
                  <Heart size={22} className="text-white fill-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? "Welcome back" : "Join Lumière"}</h2>
                <p className="text-[11px] uppercase tracking-[0.3em] text-fuchsia-300/80 font-medium">
                  {isLogin ? "Sign in to continue" : "Free, forever"}
                </p>
              </div>
              <div className="px-8">
                <div className="flex p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                  {[true, false].map((v) => {
                    const active = isLogin === v;
                    return (
                      <button key={String(v)} type="button" onClick={() => setIsLogin(v)}
                        className={`relative flex-1 py-2.5 text-xs font-semibold tracking-wide rounded-full z-10 ${active ? "text-white" : "text-white/50 hover:text-white/80"}`}>
                        {active && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-full -z-10"
                          style={{ background: "linear-gradient(135deg, #d946ef, #7c3aed)" }} transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
                        {v ? "Sign In" : "Sign Up"}
                      </button>
                    );
                  })}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="px-8 pt-7 pb-9 space-y-4">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div key="signup-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-4">
                      <Field icon={<UserIcon size={14} />}>
                        <input required type="text" placeholder="Your name" value={form.name} onChange={update("name")}
                          className="w-full bg-transparent text-white placeholder-white/35 outline-none text-sm" />
                      </Field>
                      <Field icon={<Calendar size={14} />}>
                        <input required type="number" placeholder="Your age" value={form.age} onChange={update("age")} min="18" max="120"
                          className="w-full bg-transparent text-white placeholder-white/35 outline-none text-sm" />
                      </Field>
                      <Field icon={<MapPin size={14} />}>
                        <input required type="text" placeholder="Your location" value={form.location} onChange={update("location")}
                          className="w-full bg-transparent text-white placeholder-white/35 outline-none text-sm" />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Field icon={<Mail size={14} />}>
                  <input required type="email" placeholder="Email address" value={form.email} onChange={update("email")}
                    className="w-full bg-transparent text-white placeholder-white/35 outline-none text-sm" />
                </Field>
                <Field icon={<Lock size={14} />}>
                  <input required type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={update("password")} minLength={6}
                    className="w-full bg-transparent text-white placeholder-white/35 outline-none text-sm" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="text-white/40 hover:text-fuchsia-300" tabIndex={-1}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </Field>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-xs text-red-300 border border-red-500/30 px-3 py-2.5 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #7f1d1d, #991b1b)" }}>{error}</motion.div>
                )}
                <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                  className="group w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-full text-sm font-semibold tracking-wide disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #d946ef, #a855f7, #7c3aed)" }}>
                  {submitting ? (
                    <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />{isLogin ? "Signing in" : "Creating account"}</>
                  ) : (
                    <>{isLogin ? "Sign In" : "Create Account"}<ArrowRight size={15} /></>
                  )}
                </motion.button>
                <p className="text-center text-xs text-white/45 font-light pt-1">
                  {isLogin ? "New to Lumière?" : "Already a member?"}{" "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-fuchsia-300 hover:text-fuchsia-200 font-semibold">
                    {isLogin ? "Create account" : "Sign in"}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}