export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0612] via-[#120820] to-[#0a0612]" />
      <div className="absolute -top-1/3 -left-1/4 w-[40rem] h-[40rem] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #a855f7, #6d28d9, transparent 70%)" }} />
      <div className="absolute -bottom-1/3 -right-1/4 w-[35rem] h-[35rem] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #ec4899, #a21caf, transparent 70%)" }} />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, #0a0612 100%)" }} />
    </div>
  );
}