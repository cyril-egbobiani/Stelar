import React from "react";

interface ChatSuggestionsProps {
  suggestions: string[];
  setInput: (val: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  suggestions,
  setInput,
}) => (
  <div className="mt-2">
    <div className="w-full flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          className="flex-shrink-0 px-4 py-2 bg-[#171717] border border-[#282828] text-[#737373] text-sm rounded-full hover:bg-[#1F1F1F] hover:border-rose-500/30 hover:text-rose-400 transition-all duration-300 ease-out"
          onClick={() => setInput(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);
export default ChatSuggestions;
