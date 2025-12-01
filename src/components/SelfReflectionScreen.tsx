import React, { useState, useEffect, useRef } from "react";
import TypewriterText from "./TypewriterText";

// Category colors - simple, functional
const categoryColors: Record<
  string,
  { bg: string; border: string; text: string; solid: string }
> = {
  Joy: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    solid: "bg-amber-400",
  },
  Pride: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    solid: "bg-purple-400",
  },
  Release: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-400",
    solid: "bg-teal-400",
  },
  Gratitude: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    solid: "bg-rose-400",
  },
};

const prompts = [
  { text: "What made you smile today?", category: "Joy" },
  { text: "Describe a moment you felt proud recently.", category: "Pride" },
  {
    text: "Is there something on your mind you'd like to let go of?",
    category: "Release",
  },
  {
    text: "What is one thing you are grateful for right now?",
    category: "Gratitude",
  },
];

const SelfReflectionScreen: React.FC<{
  onNavigate: (screen: string) => void;
}> = ({ onNavigate }) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [userName, setUserName] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentCategory = prompts[currentPrompt].category;
  const colors = categoryColors[currentCategory];

  useEffect(() => {
    const name = localStorage.getItem("stelarUserName") || "";
    setUserName(name);
  }, []);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleTypewriterComplete = () => {
    setShowInput(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResponses([...responses, input]);
    setInput("");
    setShowInput(false);

    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    } else {
      setShowSummary(true);
    }
  };

  const progress = ((currentPrompt + 1) / prompts.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
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

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-sm">
            {currentPrompt + 1}/{prompts.length}
          </span>
          <span className={`text-sm ${colors.text}`}>{currentCategory}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4">
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.solid} transition-[width] duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-lg mx-auto w-full">
        {/* Question */}
        <div className="mb-8">
          <p className="text-2xl leading-relaxed text-white">
            <TypewriterText
              text={prompts[currentPrompt].text}
              delay={25}
              onComplete={handleTypewriterComplete}
            />
          </p>
        </div>

        {/* Input */}
        {showInput && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              ref={inputRef}
              className="w-full h-36 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 resize-none"
              placeholder="Write your thoughts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`w-full py-3 rounded-xl ${colors.solid} text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentPrompt < prompts.length - 1 ? "Continue" : "Finish"}
            </button>
          </form>
        )}
      </main>

      {/* Skip */}
      <footer className="p-4 text-center">
        <button
          onClick={() => onNavigate("welcome")}
          className="text-zinc-600 text-sm hover:text-zinc-400"
        >
          Skip for now
        </button>
      </footer>

      {/* Summary */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white mb-2">
                {userName ? `Well done, ${userName}` : "Well done"}
              </h2>
              <p className="text-zinc-500">
                You answered {prompts.length} questions
              </p>
            </div>

            <div className="space-y-3 mb-8 max-h-64 overflow-y-auto">
              {responses.map((resp, idx) => {
                const respColors = categoryColors[prompts[idx].category];
                return (
                  <div
                    key={idx}
                    className="p-4 bg-zinc-900 rounded-xl border border-zinc-800"
                  >
                    <span
                      className={`text-xs ${respColors.text} uppercase tracking-wide`}
                    >
                      {prompts[idx].category}
                    </span>
                    <p className="text-sm text-zinc-300 mt-1 line-clamp-2">
                      {resp}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowSummary(false);
                onNavigate("welcome");
              }}
              className="w-full py-3 rounded-xl bg-rose-500 text-white font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfReflectionScreen;
