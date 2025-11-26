import React from "react";

interface ChatHeaderProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  conversationData: any[];
  userName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNavigate,
  conversationData,
  userName,
}) => (
  <div className="w-full flex justify-between items-center px-2 py-4 h-fit">
    <button
      className="pr-6 pl-5 py-3 geist-mono bg-[#171717] border border-[#282828] rounded-xl text-[#E6E6E6] hover:bg-[#1F1F1F] hover:border-rose-500/30 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-rose-500/10 hover:scale-105 active:scale-95"
      onClick={() => onNavigate("welcome")}
    >
      ← Back
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
