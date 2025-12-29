import React, { useState, useEffect, useCallback } from "react";

type Technique = {
  id: string;
  name: string;
  description: string;
  pattern: { inhale: number; hold1: number; exhale: number; hold2: number };
};

const techniques: Technique[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal counts for calm focus",
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Deep relaxation technique",
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  },
  {
    id: "quick",
    name: "Quick Calm",
    description: "Fast relief in moments",
    pattern: { inhale: 3, hold1: 0, exhale: 6, hold2: 0 },
  },
];

const durations = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
];

type Phase = "inhale" | "hold1" | "exhale" | "hold2" | "idle";

type BreathingScreenProps = {
  onNavigate: (screen: "welcome" | "engage") => void;
};

const BreathingScreen: React.FC<BreathingScreenProps> = ({ onNavigate }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>(
    techniques[0]
  );
  const [selectedDuration, setSelectedDuration] = useState(durations[1]);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const getPhaseInstruction = (p: Phase): string => {
    switch (p) {
      case "inhale":
        return "Breathe in";
      case "hold1":
        return "Hold";
      case "exhale":
        return "Breathe out";
      case "hold2":
        return "Hold";
      default:
        return "";
    }
  };

  const runBreathingCycle = useCallback(() => {
    const { pattern } = selectedTechnique;
    const allPhases: { phase: Phase; duration: number }[] = [
      { phase: "inhale" as Phase, duration: pattern.inhale },
      { phase: "hold1" as Phase, duration: pattern.hold1 },
      { phase: "exhale" as Phase, duration: pattern.exhale },
      { phase: "hold2" as Phase, duration: pattern.hold2 },
    ];
    const phases = allPhases.filter((p) => p.duration > 0);

    let currentPhaseIndex = 0;
    let currentCount = phases[0].duration;

    setPhase(phases[0].phase);
    setCountdown(currentCount);

    const interval = setInterval(() => {
      currentCount--;

      if (currentCount <= 0) {
        currentPhaseIndex++;

        if (currentPhaseIndex >= phases.length) {
          // Cycle complete, start over
          currentPhaseIndex = 0;
          setCycleCount((prev) => prev + 1);
        }

        currentCount = phases[currentPhaseIndex].duration;
        setPhase(phases[currentPhaseIndex].phase);
      }

      setCountdown(currentCount);
    }, 1000);

    return interval;
  }, [selectedTechnique]);

  useEffect(() => {
    if (!isActive) return;

    setTotalTimeLeft(selectedDuration.seconds);
    setCycleCount(0);

    const breathingInterval = runBreathingCycle();

    const totalTimer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(breathingInterval);
          clearInterval(totalTimer);
          setIsActive(false);
          setIsComplete(true);
          setPhase("idle");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(breathingInterval);
      clearInterval(totalTimer);
    };
  }, [isActive, selectedDuration.seconds, runBreathingCycle]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startExercise = () => {
    setIsComplete(false);
    setIsActive(true);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase("idle");
  };

  const resetExercise = () => {
    setIsComplete(false);
    setIsActive(false);
    setPhase("idle");
    setCycleCount(0);
  };

  // Selection screen
  if (!isActive && !isComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <header className="p-4">
          <button
            onClick={() => onNavigate("engage")}
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
        <main className="flex-1 flex flex-col px-4 pb-8 max-w-lg mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl mb-2">Breathing Exercise</h1>
            <p className="text-zinc-500">Take a moment to center yourself.</p>
          </div>

          {/* Technique Selection */}
          <div className="mb-8">
            <h2 className="text-sm text-zinc-400 mb-3 uppercase tracking-wide">
              Technique
            </h2>
            <div className="space-y-2">
              {techniques.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechnique(tech)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedTechnique.id === tech.id
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-sm text-zinc-500">
                    {tech.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-10">
            <h2 className="text-sm text-zinc-400 mb-3 uppercase tracking-wide">
              Duration
            </h2>
            <div className="flex gap-2">
              {durations.map((dur) => (
                <button
                  key={dur.seconds}
                  onClick={() => setSelectedDuration(dur)}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${
                    selectedDuration.seconds === dur.seconds
                      ? "border-rose-500 bg-rose-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startExercise}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors"
          >
            Begin
          </button>
        </main>
      </div>
    );
  }

  // Active breathing screen
  if (isActive) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        {/* Time remaining */}
        <div className="absolute top-6 right-6 text-zinc-500 text-sm">
          {formatTime(totalTimeLeft)}
        </div>

        {/* Breathing circle */}
        <div className="relative flex items-center justify-center mb-12">
          {/* Outer ring */}
          <div
            className={`absolute rounded-full border-2 border-rose-500/30 transition-all duration-1000 ease-in-out ${
              phase === "inhale"
                ? "w-72 h-72 opacity-100"
                : phase === "exhale"
                ? "w-40 h-40 opacity-60"
                : "w-56 h-56 opacity-80"
            }`}
          />

          {/* Inner circle */}
          <div
            className={`breathing-circle rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center ${
              phase === "inhale"
                ? "breathing-inhale"
                : phase === "exhale"
                ? "breathing-exhale"
                : "breathing-hold"
            }`}
          >
            <span className="text-4xl font-light text-white/90">
              {countdown}
            </span>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mb-12">
          <p className="text-2xl font-light mb-2">
            {getPhaseInstruction(phase)}
          </p>
          <p className="text-zinc-500 text-sm">
            Cycle {cycleCount + 1} • {selectedTechnique.name}
          </p>
        </div>

        {/* Stop button */}
        <button
          onClick={stopExercise}
          className="px-8 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl transition-colors"
        >
          End session
        </button>
      </div>
    );
  }

  // Completion screen
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-rose-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-light mb-2">Nice work</h1>
      <p className="text-zinc-500 mb-2">
        You completed {cycleCount} breathing cycle{cycleCount !== 1 ? "s" : ""}
      </p>
      <p className="text-zinc-600 text-sm mb-10">
        {selectedDuration.label} • {selectedTechnique.name}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={resetExercise}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors"
        >
          Do another
        </button>
        <button
          onClick={() => onNavigate("engage")}
          className="w-full py-4 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default BreathingScreen;
