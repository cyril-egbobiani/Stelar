import React from "react";

import type { Message } from "../../types";

interface ChatHeaderProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  conversationData: Message[];
  userName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNavigate,
  conversationData,
  userName,
}) => (
  <div className="w-full flex justify-between items-center px-4 py-4 h-fit">
   
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
   
    {conversationData.length > 0 && (
      <div className="mx-6 flex justify-center ">
        <div className="flex items-center gap-2 text-sm text-[#737373]">
          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full gentle-pulse" />
          <span className=" transition-all duration-300 hover:text-rose-300">
            {conversationData.length < 3
              ? `listening to ${userName}`
              : conversationData.length < 6
              ? `analyzing ${userName}'s patterns`
              : conversationData.length < 8
              ? `forming insights about ${userName}`
              : `${userName}'s report ready`}
          </span>
        </div>
      </div>
    )}
  </div>
);

export default ChatHeader;
