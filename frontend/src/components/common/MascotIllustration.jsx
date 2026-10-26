export default function MascotIllustration({ className = "w-72 h-72", showSparkles = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C8874A]/25 via-[#F4D7C4]/35 to-transparent blur-2xl transform scale-110 pointer-events-none"></div>

      {/* Official Mascot Badge */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src="/mascot.png"
          alt="Zhele Bakes n Bites Baker Mascot"
          className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 select-none"
        />
      </div>

      {/* Floating Sparkles & Emojis */}
      {showSparkles && (
        <>
          <div className="absolute -top-2 right-4 text-2xl animate-bounce delay-100 select-none pointer-events-none">✨</div>
          <div className="absolute bottom-6 -left-2 text-xl animate-pulse select-none pointer-events-none">🥐</div>
          <div className="absolute top-8 -left-2 text-lg animate-bounce delay-300 select-none pointer-events-none">🧁</div>
          <div className="absolute bottom-10 right-2 text-base animate-pulse delay-200 select-none pointer-events-none">🤎</div>
        </>
      )}
    </div>
  );
}
