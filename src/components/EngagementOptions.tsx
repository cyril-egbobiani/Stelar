import React from "react";

// Example illustrations (replace with your own SVGs or images)
// SVGs are now referenced from public folder, no import needed

const options = [
  {
    title: "Self-Reflection Prompt",
    description: "Answer guided prompts to reflect on your wellbeing.",
    image: "/Solar.svg",
    route: "/selfReflection",
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
      | "selfReflection"
  ) => void;
};

const EngagementOptions: React.FC<EngagementOptionsProps> = ({
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181B] to-[#121212] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl text-center mb-2 tracking-tight">
          Before we start help us to
          <br />
          understand you better
        </h1>
        <div className="w-20 h-1 bg-white/10 rounded-full mb-8" />
        <p className="text-base text-white/60 mb-10 text-center max-w-lg">
          Select an option below to begin your personalized wellbeing journey.
        </p>
        <div className="w-full flex flex-col gap-6">
          {options.map((opt) => (
            <div
              key={opt.title}
              className="group relative rounded-xl px-6 py-7 flex flex-col items-start justify-center bg-zinc-900 border border-[#232326] medium-lg transition-all duration-300 hover:scale-[1.02] hover:medium-rose-400/20 cursor-pointer"
              onClick={() => {
                // Map route to screen name
                switch (opt.route) {
                  case "/chat":
                    onNavigate("chat");
                    break;
                  case "/selfReflection":
                    onNavigate("selfReflection");
                    break;
                  default:
                    onNavigate("welcome");
                }
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center medium-rose-400/30 medium-md">
                  <img
                    src={opt.image}
                    alt={opt.title}
                    className="w-7 h-7 drop-medium-xl opacity-90"
                  />
                </div>
                <h2 className="text-lg font-medium text-white tracking-tight">
                  {opt.title}
                </h2>
              </div>
              <p className="text-sm text-white/70 mb-2">{opt.description}</p>
              <button
                className="mt-4 w-full py-3 rounded-lg bg-white text-black font-medium text-base medium transition-all duration-200 hover:bg-rose-500 hover:text-white"
                style={{ letterSpacing: "0.01em" }}
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementOptions;
