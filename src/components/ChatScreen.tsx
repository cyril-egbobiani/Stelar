import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import type { Message, WellbeingReport } from "../types";

interface ChatScreenProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  conversationData: Message[];
  setConversationData: React.Dispatch<React.SetStateAction<Message[]>>;
  conversationId: string | null;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  setReport: (report: WellbeingReport) => void;
}

function ChatScreen({
  onNavigate,
  conversationData,
  setConversationData,
  conversationId,
  setConversationId,
  setReport,
}: ChatScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(true);
  const iconRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const [iconState, setIconState] = useState(darkMode ? "sun" : "moon");

  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [userId] = useState<string>(() => {
    // Generate or retrieve user ID from localStorage
    let storedUserId = localStorage.getItem("stelar_user_id");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("stelar_user_id", storedUserId);
    }
    return storedUserId;
  });

  // Unique ID generator to prevent duplicate keys
  let idCounter = 0;
  const generateUniqueId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    idCounter += 1;
    return `${timestamp}_${random}_${idCounter}`;
  };

  const greetings = [
    "Hey there! What's on your mind today?",
    "Hi! How's your day going so far?",
    "Hello! I'm here if you want to talk about anything.",
    "Hey! Is there something you'd like to share?",
    "Hi! How are you feeling right now?",
    "Hey friend! Need to chat or just hang out?",
    "Hi! I'm all ears, what's up?",
  ];

  // If conversationData is empty, show a greeting and start conversation
  useEffect(() => {
    if (conversationData.length === 0 && !conversationId) {
      startNewConversation();
    }
    // eslint-disable-next-line
  }, [conversationData]);

  const startNewConversation = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversations/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversation.id);

        // Add initial greeting
        setConversationData([
          {
            id: generateUniqueId(),
            text: greetings[Math.floor(Math.random() * greetings.length)],
            sender: "stelar",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // Fallback to local greeting
      setConversationData([
        {
          id: generateUniqueId(),
          text: greetings[Math.floor(Math.random() * greetings.length)],
          sender: "stelar",
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationData]);

  useEffect(() => {
    setMessageCount(conversationData.length);
  }, [conversationData]);

  useEffect(() => {
    if (
      messageCount >= 10 ||
      conversationData.some(
        (msg) => msg.text.includes("done") || msg.text.includes("finished")
      )
    ) {
      setIsSessionComplete(true);
    }
  }, [conversationData, messageCount]);

  const completeConversation = async () => {
    if (conversationId) {
      try {
        await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/conversations/${conversationId}/complete`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Failed to complete conversation:", error);
      }
    }
  };

  const handleNavigateToReport = async () => {
    console.log("🎯 Generate Report button clicked!");
    console.log("💬 ConversationId:", conversationId);
    console.log("📊 Message count:", conversationData.length);

    setIsGeneratingReport(true);

    // Complete conversation on backend
    await completeConversation();

    // Try to generate analysis on the backend before navigating so report is ready
    if (conversationId) {
      try {
        console.log("🚀 Calling backend analysis endpoint...");
        const analysisResp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/analysis/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId }),
          }
        );

        console.log("📡 Backend response status:", analysisResp.status);

        if (analysisResp.ok) {
          const analysisData = await analysisResp.json();
          console.log("✅ Backend analysis data:", analysisData);

          if (analysisData.success && analysisData.analysis) {
            // Use the backend WellbeingReport directly
            const report: WellbeingReport = analysisData.analysis;
            console.log("📋 Generated report:", report);
            // set report in app state
            setReport(report);
          }
        } else {
          console.error(
            "❌ Backend analysis failed with status:",
            analysisResp.status
          );
          const errorText = await analysisResp.text();
          console.error("❌ Error response:", errorText);
        }
      } catch (err) {
        console.error("💥 Failed to generate backend report:", err);
      }
    } else {
      console.warn("⚠️ No conversationId available for analysis");
    }

    setIsGeneratingReport(false);
    console.log("🔄 Navigating to report screen...");

    // Navigate to report screen (report will be available from app state or ReportScreen will generate)
    onNavigate("report");
  };

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: generateUniqueId(),
        text: input,
        sender: "user",
        timestamp: Date.now(),
      };
      const updatedMessages = [...conversationData, newMessage];
      setConversationData(updatedMessages);
      setInput("");
      setIsTyping(true);

      try {
        let response;

        if (conversationId) {
          // Use new conversation endpoint
          response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/conversations/message`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                conversationId,
                message: input,
              }),
            }
          );
        } else {
          // Fallback to legacy chat endpoint
          response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
          });
        }

        const data = await response.json();

        if (data.success && data.assistantMessage) {
          // New format from conversation endpoint
          const replyMessage: Message = {
            id: data.assistantMessage.id,
            timestamp: data.assistantMessage.timestamp,
            text: data.assistantMessage.content,
            sender: "stelar",
          };
          setConversationData((msgs) => [...msgs, replyMessage]);

          if (data.nextQuestion) {
            const questionMessage: Message = {
              id: generateUniqueId(),
              timestamp: Date.now(),
              text: data.nextQuestion,
              sender: "stelar",
            };
            setConversationData((msgs) => [...msgs, questionMessage]);
          }
        } else if (data.reply) {
          // Legacy format from chat endpoint
          const replyMessage: Message = {
            id: generateUniqueId(),
            timestamp: Date.now(),
            text: data.reply,
            sender: "stelar",
          };
          setConversationData((msgs) => [...msgs, replyMessage]);

          if (data.nextQuestion) {
            const questionMessage: Message = {
              id: generateUniqueId(),
              timestamp: Date.now(),
              text: data.nextQuestion,
              sender: "stelar",
            };
            setConversationData((msgs) => [...msgs, questionMessage]);
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: Message = {
          id: generateUniqueId(),
          timestamp: Date.now(),
          text: "Sorry, something went wrong.",
          sender: "stelar",
        };
        setConversationData((msgs) => [...msgs, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleToggleDarkMode = () => {
    if (animating) return;
    setAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimating(false);
      },
    });

    // Scale down and blur out
    tl.to(iconRef.current, {
      scale: 0.7,
      filter: "blur(8px)",
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setDarkMode((prev) => !prev);
        setIconState((prev) => (prev === "sun" ? "moon" : "sun"));
      },
    });

    // Scale up and blur in
    tl.to(iconRef.current, {
      scale: 1,
      filter: "blur(0px)",
      duration: 0.18,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col items-center ${
        darkMode ? "bg-black" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center p-2 h-fit">
        <button
          className={` px-4 py-2 rounded-full transition duration-180 ease-in ${
            darkMode
              ? "text-white hover:bg-gray-800"
              : "text-black hover hover:bg-gray-200"
          }`}
          onClick={() => onNavigate("welcome")}
        >
          Back
        </button>
        <button
          className={`p-2 rounded-full font-semibold ${
            darkMode
              ? "text-white hover:bg-gray-800 transition duration-180 ease-in"
              : "text-black hover:bg-gray-200 transition duration-180 ease-in"
          } transition`}
          onClick={handleToggleDarkMode}
          disabled={animating}
        >
          <div ref={iconRef}>
            {iconState === "sun" ? (
              <img width={24} src="/Sun.svg" alt="Light mode" />
            ) : (
              <img width={24} src="/Solar.svg" alt="Dark mode" />
            )}
          </div>
        </button>
      </div>
      <div
        className={`chat-area flex flex-col rounded-3xl rounded-b-none border-gray-200 border-1 w-full md:max-w-3xl shadow-sm overflow-hidden relative ${
          darkMode ? "bg-black border-gray-900" : "bg-white border-gray-100"
        }`}
        style={{
          backgroundImage: `url('')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay for opacity control */}
        <div
          className={`absolute inset-0 ${
            darkMode ? "bg-black/80" : "bg-white/85"
          }`}
        />
        {/* Content wrapper to ensure content appears above background */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Messages: only this div scrolls */}
          <div
            className="no-scrollbar flex-1 overflow-y-auto px-4 py-6 space-y-8 pb-24 messages-scroll"
            id="messages-container"
          >
            {conversationData.map((msg, idx) => {
              const isLatestMessage = idx === conversationData.length - 1;
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  } ${
                    isLatestMessage
                      ? isUser
                        ? "user-fade-in"
                        : "ai-fade-in"
                      : "message-fade-in"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    {!isUser && (
                      <div className="flex-shrink-0 w-8 h-8 mr-3 mt-1">
                        <div className="w-8 h-8 bg-indigo-400  rounded-full flex items-center justify-center">
                          <img
                            src="/StelarLogo.svg"
                            alt="Stelar"
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl relative group ${
                        isUser
                          ? darkMode
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-500 text-white"
                          : darkMode
                          ? "bg-white/5 text-white border border-white/5"
                          : "bg-gray-100 text-black border border-gray-200"
                      } hover:shadow-lg transition-all duration-200`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>

                      {/* Timestamp */}
                      <div
                        className={`text-xs mt-2 opacity-70 ${
                          isUser ? "text-right" : "text-right"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start ai-fade-in">
                <div className="flex items-start max-w-[80%]">
                  {/* AI Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 mr-3 mt-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <img
                        src="/StelarLogo.svg"
                        alt="Stelar"
                        className="w-5 h-5"
                      />
                    </div>
                  </div>

                  {/* Typing Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl relative ${
                      darkMode
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-gray-100 text-black border border-gray-200"
                    } hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-sm opacity-70">
                        Stelar is thinking
                      </span>
                      <div className="typing-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>

                    {/* Message tail */}
                    {/* <div
                    className={`absolute top-4 w-3 h-3 transform rotate-45 -left-1 ${
                      darkMode
                        ? "bg-gray-800 border-l border-t border-gray-700"
                        : "bg-gray-100 border-l border-t border-gray-200"
                    }`}
                  ></div> */}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Bar: always at bottom of chat area */}
          <div
            className={`px-4 py-4 flex items-center gap-3 w-full backdrop-blur-md  ${
              darkMode ? "bg-black/80  " : "bg-white/90  "
            }`}
          >
            <div className="flex-1 relative">
              <input
                className={`w-full px-4 py-3 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 ${
                  darkMode
                    ? "bg-black text-white border border-gray-600 placeholder-gray-400"
                    : "bg-white text-black border border-gray-300 placeholder-gray-500"
                }`}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
              />
            </div>

            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center min-w-[70px] ${
                input.trim() && !isTyping
                  ? "bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? (
                <div className="typing-dots scale-75">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="size-6"
                >
                  <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"></path>
                </svg>
              )}
            </button>
          </div>
          {/* Report Generation Button */}
          {isSessionComplete && (
            <div className="px-4 pb-4 user-fade-in">
              <button
                onClick={handleNavigateToReport}
                disabled={isGeneratingReport}
                className={`w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isGeneratingReport
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                {isGeneratingReport ? (
                  <>
                    <div className="typing-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span>Generating Your Wellbeing Report...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Generate Wellbeing Report</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>{" "}
        {/* Close content wrapper */}
      </div>
    </div>
  );
}

export default ChatScreen;
