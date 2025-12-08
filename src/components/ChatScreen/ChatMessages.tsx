import React from "react";
import type { Message } from "../../types";
import TypewriterText from "../TypewriterText";
import { Loader } from "../ui/loader";

interface ChatMessagesProps {
  messages: Message[];
  typingMessageIds: Set<string>;
  completedMessageIds: Set<string>;
  setCompletedMessageIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setTypingMessageIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isTyping?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  typingMessageIds,
  completedMessageIds,
  setCompletedMessageIds,
  setTypingMessageIds,
  messagesEndRef,
  isTyping = false,
}) => (
  <div
    className="no-scrollbar overflow-y-auto px-2 py-8 space-y-6 messages-scroll"
    id="messages-container"
    style={{ height: "calc(100vh - 200px)", maxHeight: "calc(100vh - 200px)" }}
  >
    {messages.map((msg, idx) => {
      const isLatestMessage = idx === messages.length - 1;
      const isUser = msg.sender === "user";
      const isTypingThis = typingMessageIds.has(msg.id);
      const isCompleted = completedMessageIds.has(msg.id);

      return (
        <div
          key={msg.id}
          className={`flex ${
            isUser ? "justify-end" : "justify-start"
          } message-enter`}
        >
          <div
            className={`flex items-start max-w-[85%] group  ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar with micro-interactions */}
            {!isUser && (
              <div className="flex-shrink-0 w-9 h-9  mt-1">
                <div className="relative">
                  <img
                    src="/StelarLogo.svg"
                    alt="Stelar"
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                  />
                  {/* Typing indicator */}
                  {isTypingThis && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-rose-400 rounded-full"></div>
                  )}
                  {/* Completion glow */}
                  {isCompleted && isLatestMessage && (
                    <div className="absolute inset-0"></div>
                  )}
                </div>
              </div>
            )}
            {/* Message Bubble with enhanced design */}
            <div
              className={`relative group/bubble ${
                isUser
                  ? "px-4 py-3 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                  : "rounded-3xl  shadow-lg hover:shadow-xl transition-all duration-300"
              } ${
                isUser ? " bg-rose-600 text-white" : "  text-white"
              }   transform-gpu transition-all duration-300 ease-out`}
            >
              {/* Message content with typewriter for AI */}
              <div className="leading-relaxed">
                {!isUser && isLatestMessage && !isCompleted ? (
                  <TypewriterText
                    text={msg.text}
                    delay={25}
                    onComplete={() => {
                      setCompletedMessageIds(
                        (prev) => new Set([...prev, msg.id])
                      );
                      setTypingMessageIds((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(msg.id);
                        return newSet;
                      });
                    }}
                  />
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
              {/* Timestamp with better positioning */}
              <div
                className={`text-xs mt-2 opacity-60 transition-opacity group-hover/bubble:opacity-80 ${
                  isUser ? "text-right" : "text-left"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {/* Subtle gradient overlay on hover */}
              <div
                className={`absolute inset-0 rounded-3xl ${
                  isUser ? "rounded-br-lg" : "rounded-bl-lg"
                } opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  isUser
                    ? "bg-gradient-to-t from-white/10 to-transparent"
                    : "bg-gradient-to-t from-rose-400/5 to-transparent"
                }`}
              ></div>
            </div>
          </div>
        </div>
      );
    })}

    {/* AI Typing Loader */}
    {isTyping && (
      <div className="flex justify-start message-enter">
        <div className="flex items-start max-w-[85%] group">
          {/* Avatar */}
          <div className="flex-shrink-0 w-9 h-9 mt-1">
            <div className="relative">
              <img
                src="/StelarLogo.svg"
                alt="Stelar"
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          </div>
          {/* Loader in message bubble */}
             <div className="">
               <Loader variant="loading-dots" text="Thinking" />
            </div>
          
        </div>
      </div>
    )}

    {/* Scroll anchor */}
    <div ref={messagesEndRef} />
  </div>
);

export default ChatMessages;
