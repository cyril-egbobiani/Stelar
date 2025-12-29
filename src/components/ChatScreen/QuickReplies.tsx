import React from "react";
import type { ConversationPhase } from "./conversationPhases";
import type { IntentSelection } from "./MoodCheckIn";

interface QuickRepliesProps {
  phase: ConversationPhase;
  intent: IntentSelection | null;
  onSelect: (reply: string) => void;
  disabled?: boolean;
  lastAiMessage?: string;
}

interface QuickReply {
  text: string;
  sentiment?: "positive" | "negative" | "neutral";
}

// Phase-based reply suggestions
const phaseReplies: Record<ConversationPhase, QuickReply[]> = {
  opening: [
    { text: "I'm not sure where to start", sentiment: "neutral" },
    { text: "It's been a tough day", sentiment: "negative" },
    { text: "Something's been on my mind", sentiment: "neutral" },
    { text: "I just need someone to listen", sentiment: "neutral" },
  ],
  explore: [
    { text: "Tell me more", sentiment: "neutral" },
    { text: "That's exactly it", sentiment: "positive" },
    { text: "It's hard to explain", sentiment: "neutral" },
    { text: "There's more to it", sentiment: "neutral" },
  ],
  deepen: [
    { text: "I never thought of it that way", sentiment: "positive" },
    { text: "That resonates with me", sentiment: "positive" },
    { text: "I'm not sure I agree", sentiment: "negative" },
    { text: "Can you help me understand?", sentiment: "neutral" },
  ],
  reflect: [
    { text: "I'm starting to see it now", sentiment: "positive" },
    { text: "This is helpful", sentiment: "positive" },
    { text: "I need to think about this", sentiment: "neutral" },
    { text: "What should I do next?", sentiment: "neutral" },
  ],
  closure: [
    { text: "Thank you, this helped", sentiment: "positive" },
    { text: "I feel a bit better", sentiment: "positive" },
    { text: "I have more to share", sentiment: "neutral" },
    { text: "Show me my insights", sentiment: "positive" },
  ],
};

// Intent-specific additions
const intentReplies: Record<string, QuickReply[]> = {
  vent: [
    { text: "I just need to get this out", sentiment: "neutral" },
    { text: "It's frustrating", sentiment: "negative" },
  ],
  anxious: [
    { text: "I can't stop worrying", sentiment: "negative" },
    { text: "What if it goes wrong?", sentiment: "negative" },
  ],
  reflect: [
    { text: "Help me think through this", sentiment: "neutral" },
    { text: "I want to understand myself better", sentiment: "positive" },
  ],
  talk: [
    { text: "Nothing specific, just chatting", sentiment: "neutral" },
    { text: "How about you ask me something?", sentiment: "neutral" },
  ],
};

// Feeling responses (for "how are you feeling?" type questions)
const feelingReplies: QuickReply[] = [
  { text: "Anxious", sentiment: "negative" },
  { text: "Overwhelmed", sentiment: "negative" },
  { text: "Confused", sentiment: "neutral" },
  { text: "Hopeful", sentiment: "positive" },
  { text: "Tired", sentiment: "negative" },
  { text: "Okay", sentiment: "neutral" },
];

const QuickReplies: React.FC<QuickRepliesProps> = ({
  phase,
  intent,
  onSelect,
  disabled = false,
  lastAiMessage = "",
}) => {
  // Determine which replies to show based on context
  const getContextualReplies = (): QuickReply[] => {
    const lowerMessage = lastAiMessage.toLowerCase();

    // Check if AI is asking about feelings
    if (
      lowerMessage.includes("how are you") ||
      lowerMessage.includes("how do you feel") ||
      lowerMessage.includes("feeling right now")
    ) {
      return feelingReplies.slice(0, 4);
    }

    // Get phase-based replies
    let replies = [...phaseReplies[phase]];

    // Add intent-specific replies if in early phases
    if (intent && (phase === "opening" || phase === "explore")) {
      const intentSpecific = intentReplies[intent.id] || [];
      replies = [...intentSpecific.slice(0, 2), ...replies.slice(0, 2)];
    }

    // Limit to 4 replies
    return replies.slice(0, 4);
  };

  const replies = getContextualReplies();

  if (disabled || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {replies.map((reply, index) => (
        <button
          key={`${reply.text}-${index}`}
          onClick={() => onSelect(reply.text)}
          disabled={disabled}
          className={`px-4 py-2 rounded-full text-sm transition-all duration-200 
            ${
              disabled
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-95"
            }
            ${
              reply.sentiment === "positive"
                ? "hover:border-emerald-500/30 hover:text-emerald-300"
                : reply.sentiment === "negative"
                ? "hover:border-rose-500/30 hover:text-rose-300"
                : "hover:border-zinc-600"
            }
            border border-zinc-800
          `}
        >
          {reply.text}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
