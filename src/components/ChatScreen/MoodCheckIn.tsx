import React, { useState } from "react";

interface MoodCheckInProps {
  onComplete: (mood: MoodSelection, intent: IntentSelection) => void;
  userName: string;
}

export interface MoodSelection {
  emoji: string;
  label: string;
  value: number; // 1-5 scale
}

export interface IntentSelection {
  id: string;
  label: string;
  description: string;
}

const moods: MoodSelection[] = [
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😐", label: "Meh", value: 2 },
  { emoji: "🙂", label: "Okay", value: 3 },
  { emoji: "😊", label: "Good", value: 4 },
  { emoji: "✨", label: "Great", value: 5 },
];

const intents: IntentSelection[] = [
  {
    id: "vent",
    label: "Need to vent",
    description: "Something's on my mind",
  },
  {
    id: "anxious",
    label: "Feeling anxious",
    description: "Worried or stressed",
  },
  {
    id: "reflect",
    label: "Want to reflect",
    description: "Think through something",
  },
  {
    id: "talk",
    label: "Just talk",
    description: "No agenda, just chat",
  },
];

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onComplete, userName }) => {
  const [step, setStep] = useState<"mood" | "intent">("mood");
  const [selectedMood, setSelectedMood] = useState<MoodSelection | null>(null);

  const handleMoodSelect = (mood: MoodSelection) => {
    setSelectedMood(mood);
    // Small delay for visual feedback
    setTimeout(() => setStep("intent"), 200);
  };

  const handleIntentSelect = (intent: IntentSelection) => {
    if (selectedMood) {
      onComplete(selectedMood, intent);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-12">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              step === "mood" ? "bg-rose-500" : "bg-zinc-700"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              step === "intent" ? "bg-rose-500" : "bg-zinc-700"
            }`}
          />
        </div>

        {step === "mood" ? (
          <div className="animate-in fade-in duration-300">
            {/* Greeting */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-light mb-3">
                Hey{userName ? `, ${userName}` : ""}
              </h1>
              <p className="text-zinc-400">How are you feeling right now?</p>
            </div>

            {/* Mood selector */}
            <div className="flex justify-center gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${
                    selectedMood?.value === mood.value
                      ? "bg-rose-500/20 scale-110"
                      : "bg-zinc-900 hover:bg-zinc-800 hover:scale-105"
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs text-zinc-400">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Selected mood display */}
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">{selectedMood?.emoji}</span>
              <p className="text-zinc-400">What brings you here today?</p>
            </div>

            {/* Intent selector */}
            <div className="space-y-3">
              {intents.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => handleIntentSelect(intent)}
                  className="w-full text-left p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-rose-500/50 hover:bg-zinc-800 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white group-hover:text-rose-300 transition-colors">
                        {intent.label}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {intent.description}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-zinc-600 group-hover:text-rose-400 transition-colors"
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
                </button>
              ))}
            </div>

            {/* Back button */}
            <button
              onClick={() => setStep("mood")}
              className="mt-6 text-zinc-500 hover:text-white text-sm flex items-center gap-1 mx-auto transition-colors"
            >
              <svg
                className="w-4 h-4"
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
              Change mood
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCheckIn;
