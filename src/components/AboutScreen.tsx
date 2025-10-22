import { useRef } from "react";

 

function AboutScreen() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar min-h-screen flex flex-col items-center justify-center p-8 bg-black"
    >
      <h1 className="text-4xl kavoon font-md text-white mb-4">About Stelar</h1>
      <p className="text-lg text-white/90 max-w-xl text-center mb-8">
        Stelar is your personal mental health and wellness companion. Our
        mission is to provide a calming, professional, and supportive experience
        for your wellbeing journey.
      </p>
     
    </div>
  );
}

export default AboutScreen;
