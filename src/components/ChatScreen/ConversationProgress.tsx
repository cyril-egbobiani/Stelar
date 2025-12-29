import React from "react";
import {
  type ConversationPhase,
  phases,
  getPhaseIndex,
} from "./conversationPhases";

interface ConversationProgressProps {
  currentPhase: ConversationPhase;
  messageCount: number;
}

const ConversationProgress: React.FC<ConversationProgressProps> = ({
  currentPhase,
}) => {
  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="w-full px-4 py-3">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <React.Fragment key={phase.id}>
              {/* Phase dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-rose-500"
                      : isCurrent
                      ? "bg-rose-400 ring-4 ring-rose-400/20"
                      : "bg-zinc-700"
                  }`}
                />
              </div>

              {/* Connector line (except after last) */}
              {index < phases.length - 1 && (
                <div
                  className={`flex-1 h-0.5 transition-all duration-500 ${
                    isCompleted
                      ? "bg-rose-500"
                      : isUpcoming
                      ? "bg-zinc-800"
                      : "bg-gradient-to-r from-rose-500 to-zinc-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current phase label */}
      <div className="mt-2 flex justify-center">
        <span className="text-xs text-zinc-500">
          {phases[currentIndex]?.label}
        </span>
      </div>
    </div>
  );
};

export default ConversationProgress;
