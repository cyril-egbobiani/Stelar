import { useRef,  } from "react";
 
interface AboutScreenProps {
  onNavigate: (screen: "welcome" | "about" | "chat") => void;
}

function AboutScreen({ onNavigate }: AboutScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);


  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-bl from-blue-200 via-blue-600 to-blue-500"
    >
      <h1 className="text-4xl font-md text-white mb-4">About Stelar</h1>
      <p className="text-lg text-white/90 max-w-xl text-center mb-8">
        Stelar is your personal mental health and wellness companion. Our
        mission is to provide a calming, professional, and supportive experience
        for your wellbeing journey.
      </p>
      <button
            className="px-8 py-4 bg-white/10 text-white rounded-full text-lg font-semibold border-2 border-white/30 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 min-w-44 font-sans transition-colors duration-180"
        onClick={() => onNavigate("welcome")}
      >
        Back to Welcome
      </button>
    </div>
  );
}

export default AboutScreen;
