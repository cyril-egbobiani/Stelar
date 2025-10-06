import { useRef } from "react";

interface AboutScreenProps {
  onNavigate: (screen: "welcome" | "about" | "chat") => void;
}

function AboutScreen({ onNavigate }: AboutScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-cyan-800 from- via-emerald-900 via- to-slate-900 to-"
    >
      <h1 className="text-4xl font-md text-white mb-4">About Stelar</h1>
      <p className="text-lg text-white/90 max-w-xl text-center mb-8">
        Stelar is your personal mental health and wellness companion. Our
        mission is to provide a calming, professional, and supportive experience
        for your wellbeing journey.
      </p>
      <button
        className="relative h-12 px-6 rounded-full overflow-hidden border-2 border-white/30 bg-white/10 text-white text-lg font-normal backdrop-blur-sm transition-all duration-180 group hover:bg-white/20 hover:border-white/50 transform hover:scale-105"
        onClick={() => onNavigate("welcome")}
      >
        <span className="relative z-10 flex items-center justify-center h-full">
          Back to Welcome
        </span>
      </button>
    </div>
  );
}

export default AboutScreen;
