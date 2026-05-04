export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep purple gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0612] via-[#15082a] to-[#0a0612]" />

      {/* Glowing violet orbs */}
      <div className="absolute -top-1/3 -left-1/4 w-[55rem] h-[55rem] rounded-full opacity-[0.35] blur-[160px]"
        style={{ background: "radial-gradient(circle, #a855f7 0%, #6d28d9 40%, transparent 70%)" }} />
      <div className="absolute -bottom-1/3 -right-1/4 w-[50rem] h-[50rem] rounded-full opacity-[0.30] blur-[160px]"
        style={{ background: "radial-gradient(circle, #ec4899 0%, #a21caf 40%, transparent 70%)" }} />
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full opacity-[0.18] blur-[140px]"
        style={{ background: "radial-gradient(circle, #f0abfc 0%, transparent 70%)" }} />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
      }} />
    </div>
  );
}
