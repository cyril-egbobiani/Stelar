import React from "react";

// Example illustrations (replace with your own SVGs or images)
// SVGs are now referenced from public folder, no import needed

const options = [
  {
    title: "Self-Reflection Prompt",
    description: "Answer guided prompts to reflect on your wellbeing.",
    image: "/Solar.svg",
    route: "/self-reflection",
  },
  {
    title: "Mood Journal",
    description: "Log your thoughts and emotions in a private journal.",
    image: "/Solar.svg",
    route: "/journal",
  },
  {
    title: "Wellbeing Quiz",
    description: "Take a quick quiz to assess your mental health.",
    image: "/Solar.svg",
    route: "/quiz",
  },
  {
    title: "Chat with AI",
    description: "Have a conversation with our AI for instant insights.",
    image: "/Solar.svg",
    route: "/chat",
  },
];

type EngagementOptionsProps = {
  onNavigate: (
    screen:
      | "welcome"
      | "about"
      | "userDetails"
      | "chat"
      | "report"
      | "receipt"
      | "conclusion"
      | "engage"
  ) => void;
};

const EngagementOptions: React.FC<EngagementOptionsProps> = ({
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181B] to-[#121212] text-white flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight">
        Choose How You Want to Engage
      </h1>
      <p className="text-lg text-white/70 mb-10 text-center max-w-xl mx-auto">
        Select an option below to begin your personalized wellbeing journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {options.map((opt) => (
          <div
            key={opt.title}
            className="group relative rounded-2xl p-8 flex flex-col items-center justify-between min-h-[320px] backdrop-blur-lg bg-black border border-[#232326] transition-all duration-300 hover:scale-[1.03] hover:shadow-rose-400/30 cursor-pointer"
            style={{
              background: "rgba(24, 24, 27, 0.85)",
            }}
            onClick={() => {
              // Map route to screen name
              switch (opt.route) {
                case "/chat":
                  onNavigate("chat");
                  break;
                case "/self-reflection":
                  onNavigate("about");
                  break;
                case "/journal":
                  onNavigate("userDetails");
                  break;
                case "/quiz":
                  onNavigate("report");
                  break;
                default:
                  onNavigate("welcome");
              }
            }}
          >
            {/* Glowing Icon Circle */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center  group-hover:shadow-rose-500/60 transition-all duration-300">
                <img
                  src={opt.image}
                  alt={opt.title}
                  className="w-12 h-12 drop-shadow-xl opacity-90"
                />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white text-center tracking-tight">
              {opt.title}
            </h2>
            <p className="text-md text-white/70 text-center mb-6">
              {opt.description}
            </p>
            <span className="mt-auto text-sm font-medium text-white bg-rose-500/80 px-6 py-2 rounded-full shadow-md transition-all duration-300 group-hover:bg-rose-400/90 group-hover:scale-105">
              Explore
            </span>
            {/* Glassmorphism overlay for premium effect */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
             
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngagementOptions;
