import React from "react";

const options = [
  {
    title: "Self-Reflection",
    description: "Answer a few prompts to explore your thoughts and feelings.",
    route: "/selfReflection",
  },
  {
    title: "Chat Analysis",
    description: "Have a conversation and get insights from our AI.",
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4">
        <button
          onClick={() => onNavigate("welcome")}
          className="p-2 text-zinc-500 hover:text-white"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center px-4 pb-12 max-w-lg mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-2xl mb-3">How would you like to start?</h1>
          <p className="text-zinc-500">
            Choose an option that feels right for you.
          </p>
        </div>

        <div className="space-y-4">
          {options.map((opt, index) => (
            <button
              key={opt.title}
              onClick={() => {
                if (opt.route === "/chat") onNavigate("chat");
                else if (opt.route === "/selfReflection")
                  onNavigate("selfReflection");
              }}
              className="w-full text-left p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg text-white mb-1">{opt.title}</h2>
                  <p className="text-sm text-zinc-500">{opt.description}</p>
                </div>
                <div className="mt-1 text-zinc-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
              {index === 0 && (
                <span className="inline-block mt-3 text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
                  Recommended
                </span>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EngagementOptions;
