import React from "react";

const options = [
  {
    title: "Breathing Exercise",
    description: "Quick guided breathing to calm your mind.",
    route: "breathing",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    title: "Chat with Stelar",
    description: "Have a conversation and get insights from our AI.",
    route: "chat",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
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
      | "breathing"
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

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.title}
              onClick={() => onNavigate(opt.route as "chat" | "breathing")}
              className="w-full text-left p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 text-rose-400">{opt.icon}</div>
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
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EngagementOptions;
