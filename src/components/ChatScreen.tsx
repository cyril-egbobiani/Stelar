import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import type { Message, WellbeingReport } from "../types";
import {
  analyzeConversationReadiness,
  shouldAutoGenerateReport,
  shouldOfferReport,
} from "../utils/conversationReadiness";

// Typewriter effect component for AI messages
const TypewriterText = ({
  text,
  delay = 20,
  onComplete,
}: {
  text: string;
  delay?: number;
  onComplete?: () => void;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return <span>{displayText}</span>;
};

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

  // Enhanced interaction states
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportOffer, setShowReportOffer] = useState(false);
  const [hasOfferedReport, setHasOfferedReport] = useState(false);
  const [typingMessageIds, setTypingMessageIds] = useState<Set<string>>(
    new Set()
  );
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(
    new Set()
  );
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [isTypingAdvanced, setIsTypingAdvanced] = useState(false);
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

  // If conversationData is empty, start conversation
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

        // Only add backend greeting if provided
        if (data.greeting) {
          setConversationData([
            {
              id: generateUniqueId(),
              text: data.greeting,
              sender: "stelar",
              timestamp: Date.now(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // No fallback greeting - wait for user to initiate
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

  const completeConversation = useCallback(async () => {
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
  }, [conversationId]);

  const handleNavigateToReport = useCallback(async () => {
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
    }

    // Navigate to report
    setIsGeneratingReport(false);
    console.log("🔄 Navigating to report screen...");

    // Navigate to report screen (report will be available from app state or ReportScreen will generate)
    onNavigate("report");
  }, [
    conversationId,
    conversationData.length,
    setReport,
    onNavigate,
    completeConversation,
  ]);

  // Intelligent conversation readiness analysis
  useEffect(() => {
    if (conversationData.length < 4) return; // Need at least 2 exchanges

    const analysis = analyzeConversationReadiness(conversationData);
    console.log("🧠 Conversation readiness analysis:", analysis);

    // Auto-generate report if high confidence natural ending
    if (
      shouldAutoGenerateReport(conversationData) &&
      !isGeneratingReport &&
      !hasOfferedReport
    ) {
      console.log("🚀 Auto-generating report based on conversation signals...");
      setHasOfferedReport(true);
      handleNavigateToReport();
      return;
    }

    // Offer report if moderate confidence and sufficient depth
    if (
      shouldOfferReport(conversationData) &&
      !hasOfferedReport &&
      !showReportOffer
    ) {
      console.log("💭 Offering report based on conversation readiness...");
      setShowReportOffer(true);
      setHasOfferedReport(true);
    }
  }, [
    conversationData,
    isGeneratingReport,
    hasOfferedReport,
    showReportOffer,
    handleNavigateToReport,
  ]);

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

          // Mark as typing for typewriter effect
          setTypingMessageIds((prev) => new Set([...prev, replyMessage.id]));
          setConversationData((msgs) => [...msgs, replyMessage]);

          if (data.nextQuestion) {
            const questionMessage: Message = {
              id: generateUniqueId(),
              timestamp: Date.now(),
              text: data.nextQuestion,
              sender: "stelar",
            };
            // Delay the question message to appear after the reply completes
            setTimeout(() => {
              setTypingMessageIds(
                (prev) => new Set([...prev, questionMessage.id])
              );
              setConversationData((msgs) => [...msgs, questionMessage]);
            }, data.assistantMessage.content.length * 25 + 500); // Based on typewriter speed
          }
        } else if (data.reply) {
          // Legacy format from chat endpoint
          const replyMessage: Message = {
            id: generateUniqueId(),
            timestamp: Date.now(),
            text: data.reply,
            sender: "stelar",
          };

          // Mark as typing for typewriter effect
          setTypingMessageIds((prev) => new Set([...prev, replyMessage.id]));
          setConversationData((msgs) => [...msgs, replyMessage]);

          if (data.nextQuestion) {
            const questionMessage: Message = {
              id: generateUniqueId(),
              timestamp: Date.now(),
              text: data.nextQuestion,
              sender: "stelar",
            };
            // Delay the question message
            setTimeout(() => {
              setTypingMessageIds(
                (prev) => new Set([...prev, questionMessage.id])
              );
              setConversationData((msgs) => [...msgs, questionMessage]);
            }, data.reply.length * 25 + 500);
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

    // Apple-inspired sophisticated toggle animation
    const masterToggle = gsap.timeline({
      onComplete: () => setAnimating(false),
    });

    // Enhanced animation sequence with 3D transforms
    masterToggle
      .to(iconRef.current, {
        scale: 0.5,
        rotationY: 180,
        filter: "blur(8px) brightness(0.5)",
        duration: 0.25,
        ease: "power2.in",
      })
      .call(() => {
        setDarkMode((prev) => !prev);
        setIconState((prev) => (prev === "sun" ? "moon" : "sun"));
      })
      .to(iconRef.current, {
        scale: 1.1,
        rotationY: 360,
        filter: "blur(0px) brightness(1.2)",
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(iconRef.current, {
        scale: 1,
        filter: "brightness(1)",
        duration: 0.15,
        ease: "power2.out",
      });

    // Animate container background with smooth transition
    gsap.to(containerRef.current, {
      backgroundColor: darkMode ? "#f9fafb" : "#000000",
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#0E0E0E] to-[#121212] text-white overflow-hidden relative"
    >
      {/* Background texture and atmosphere - same as welcome screen */}
      <div className="absolute inset-0">
        {/* Ambient background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-400/3 to-transparent rounded-full blur-3xl" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="w-full flex justify-between items-center px-1 py-4 h-fit">
          <button
            className="px-6 py-3 geist-mono bg-[#171717] border border-[#282828] rounded-xl text-[#E6E6E6] hover:bg-[#1F1F1F] hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
            onClick={() => onNavigate("welcome")}
          >
            ← Back
          </button>
          <button
            className="p-3 bg-[#171717] border border-[#282828] rounded-xl text-[#E6E6E6] hover:bg-[#1F1F1F] hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
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

        {/* Minimal Progress Indicator */}
        {conversationData.length > 0 && (
          <div className="w-full flex justify-center mb-6">
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="geist-mono">
                {conversationData.length < 3
                  ? "listening"
                  : conversationData.length < 6
                  ? "analyzing patterns"
                  : conversationData.length < 8
                  ? "forming insights"
                  : "ready to generate report"}
              </span>
            </div>
          </div>
        )}

        {/* Chat Interface with welcome screen design */}
        <div className="flex flex-col items-center w-full px-1">
          <div className="bg-black border border-[#292929] rounded-2xl w-full md:max-w-3xl overflow-hidden">
            {/* Messages Area */}
            <div
              className="no-scrollbar flex-1 overflow-y-auto px-8 py-8 space-y-6 max-h-[500px] messages-scroll"
              id="messages-container"
            >
              {conversationData.map((msg, idx) => {
                const isLatestMessage = idx === conversationData.length - 1;
                const isUser = msg.sender === "user";
                const isTypingThis = typingMessageIds.has(msg.id);
                const isCompleted = completedMessageIds.has(msg.id);

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    } animate-in slide-in-from-bottom-4 duration-500 ease-out`}
                    style={{
                      animationDelay: `${idx * 100}ms`,
                    }}
                  >
                    <div
                      className={`flex items-start max-w-[85%] group ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar with micro-interactions */}
                      {!isUser && (
                        <div className="flex-shrink-0 w-9 h-9 mr-3 mt-1">
                          <div className="relative">
                            <img
                              src="/StelarLogo.svg"
                              alt="Stelar"
                              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                            />

                            {/* Typing indicator */}
                            {isTypingThis && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
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
                            ? "px-4 py-3 rounded-3xl rounded-br-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            : "rounded-3xl rounded-bl-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        } ${
                          isUser
                            ? darkMode
                              ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border border-emerald-500/30"
                              : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border border-emerald-400/30"
                            : darkMode
                            ? "  text-white"
                            : "  text-gray-900  "
                        } hover:scale-[1.02] transform-gpu`}
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

                        {/* Message state indicators */}
                        {!isUser && isLatestMessage && (
                          <div className="absolute -bottom-1 -right-1">
                            {isTypingThis && (
                              <div className="w-2 h-2 bg-emerald-400 rounded-full "></div>
                            )}
                            {isCompleted && (
                              <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-60"></div>
                            )}
                          </div>
                        )}

                        {/* Subtle gradient overlay on hover */}
                        <div
                          className={`absolute inset-0 rounded-3xl ${
                            isUser ? "rounded-br-lg" : "rounded-bl-lg"
                          } opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-300 pointer-events-none ${
                            isUser
                              ? "bg-gradient-to-t from-white/10 to-transparent"
                              : "bg-gradient-to-t from-emerald-400/5 to-transparent"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start max-w-[85%] group">
                    {/* AI Avatar with pulsing effect */}
                    <div className="flex-shrink-0 w-9 h-9 mr-3 mt-1">
                      <div className="relative">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src="/StelarLogo.svg"
                            alt="Stelar"
                            className="w-5 h-5"
                          />
                        </div>
                        {/* Thinking indicator rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30"></div>
                        <div className="absolute inset-0 rounded-full border border-emerald-400/50"></div>
                      </div>
                    </div>

                    {/* Enhanced Typing Bubble */}
                    <div
                      className={`px-5 py-4 rounded-3xl rounded-bl-lg relative backdrop-blur-xl ${
                        darkMode ? "  text-white" : "  text-gray-900"
                      } shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex items-center space-x-3">
                       
                        <span className="text-sm opacity-80 font-medium">
                          Stelar is analyzing...
                        </span>
                      </div>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent opacity-0 animate-[shimmer_2s_ease-in-out_infinite] rounded-3xl rounded-bl-lg"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Intelligent Report Offer */}
            {showReportOffer && !isGeneratingReport && (
              <div className="px-4 pb-4 user-fade-in">
                <div className="mb-3 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-400/30">
                  <div className="flex items-start">
                    <span className="text-emerald-300 mr-3 flex-shrink-0 text-xl">
                      🧠
                    </span>
                    <div>
                      <h3 className="text-emerald-300 font-medium mb-2">
                        Your Mental Health Fingerprint is Ready!
                      </h3>
                      <p className="text-emerald-100 text-sm mb-3">
                        I've analyzed your communication patterns, thinking
                        style, and emotional expressions. Your unique mental
                        health fingerprint reveals personalized insights about
                        how you process thoughts and emotions.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleNavigateToReport}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 text-sm"
                        >
                          View My Fingerprint 🧬
                        </button>
                        <button
                          onClick={() => setShowReportOffer(false)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-sm"
                        >
                          Continue chatting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-2 border-t border-[#282828]">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    className="w-full px-6 py-4 bg-[#171717] border border-[#282828] rounded-xl text-[#E6E6E6] placeholder-[#737373] focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      conversationData.length === 0
                        ? "Start your mental health journey..."
                        : conversationData.length < 4
                        ? "Share what's on your mind today..."
                        : conversationData.length < 8
                        ? "How do you handle challenges?"
                        : "What patterns do you notice about yourself?"
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isTyping}
                  />
                </div>

                {/* Send Button */}
                <button
                  className={`p-4 rounded-xl font-semibold transition-all duration-300 geist-mono ${
                    input.trim() && !isTyping
                      ? "bg-emerald-400 hover:bg-emerald-500 text-black hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/20"
                      : "bg-[#171717] border border-[#282828] text-[#737373] cursor-not-allowed"
                  }`}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  {isTyping ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"></path>
                    </svg>
                  )}
                </button>
              </div>

              {/* Smart suggestions */}
              {conversationData.length > 0 &&
                conversationData.length < 3 &&
                !isTyping && (
                  <div className="mt-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {[
                        "Tell me about a recent challenge",
                        "How was your day?",
                        "What's been on your mind?",
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(suggestion)}
                          className="flex-shrink-0 px-4 py-2 bg-[#171717] border border-[#282828] text-[#737373] text-sm rounded-lg hover:bg-[#1F1F1F] hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 geist-mono"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Auto-generation notification */}
        {isGeneratingReport && (
          <div className="px-6 pb-6">
            <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-6 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                </div>
              </div>
              <h3 className="text-lg font-medium geist-mono uppercase text-emerald-400 mb-2">
                Creating Your Report
              </h3>
              <p className="text-[#737373]">
                Analyzing communication patterns • Mapping thinking style •
                Detecting emotional signature
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatScreen;
