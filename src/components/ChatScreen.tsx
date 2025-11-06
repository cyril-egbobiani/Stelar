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
  const progressRef = useRef<HTMLDivElement>(null);
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

      {/* Enhanced Progress & Guidance with 2025 design */}
      {conversationData.length > 0 && (
        <div
          ref={progressRef}
          className={`w-full md:max-w-3xl px-4 mb-6 animate-in slide-in-from-bottom-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <div
            className={`relative group backdrop-blur-xl overflow-hidden ${
              darkMode
                ? "bg-gradient-to-br from-emerald-900/10 via-teal-900/10 to-emerald-900/5 border-emerald-700/20"
                : "bg-gradient-to-br from-emerald-50/60 via-teal-50/60 to-emerald-50/40 border-emerald-200/30"
            } p-6 rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-[1.02]`}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-400/5 rounded-full blur-2xl animate-pulse [animation-delay:1s]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Animated brain icon */}
                  <div className="relative">
                    <span className="text-2xl animate-float">🧠</span>
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-75"></div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Mental Health Fingerprint
                      </span>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs opacity-70 font-medium">
                      {conversationData.length}/8+ exchanges •
                      <span className="text-emerald-400 ml-1">
                        {Math.round((conversationData.length / 8) * 100)}%
                        analyzed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis status badge */}
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    conversationData.length >= 8
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  {conversationData.length >= 8 ? "✨ Ready" : "🔍 Analyzing"}
                </div>
              </div>

              {/* Enhanced Progress Bar with micro-animations */}
              <div className="mb-5">
                <div
                  className={`relative w-full ${
                    darkMode ? "bg-white/5" : "bg-gray-200/50"
                  } rounded-full h-3 overflow-hidden shadow-inner`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full"></div>
                  <div
                    className="relative bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{
                      width: `${Math.min(
                        (conversationData.length / 8) * 100,
                        100
                      )}%`,
                      boxShadow:
                        "0 0 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-transparent rounded-full"></div>
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  </div>
                </div>

                {/* Progress milestones */}
                <div className="flex justify-between mt-2 text-xs opacity-60">
                  <span>Start</span>
                  <span>Building rapport</span>
                  <span>Deep analysis</span>
                  <span>Ready</span>
                </div>
              </div>

              {/* Dynamic Guidance with enhanced animations */}
              <div className="flex items-start text-sm">
                {conversationData.length < 3 ? (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100/10 rounded-full flex items-center justify-center mr-3 animate-pulse">
                      <span className="text-lg">🌱</span>
                    </div>
                    <div>
                      <span className="opacity-90 font-medium block mb-1">
                        Getting to know you
                      </span>
                      <span className="text-xs opacity-70">
                        Building rapport and understanding your communication
                        style...
                      </span>
                    </div>
                  </>
                ) : conversationData.length < 6 ? (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-100/10 rounded-full flex items-center justify-center mr-3 animate-pulse">
                      <span className="text-lg">🔍</span>
                    </div>
                    <div>
                      <span className="opacity-90 font-medium block mb-1">
                        Analyzing patterns
                      </span>
                      <span className="text-xs opacity-70">
                        Examining thinking patterns and emotional expressions...
                      </span>
                    </div>
                  </>
                ) : conversationData.length < 8 ? (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100/10 rounded-full flex items-center justify-center mr-3 animate-pulse">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <span className="opacity-90 font-medium block mb-1">
                        Deep insights forming
                      </span>
                      <span className="text-xs opacity-70">
                        Mapping your unique mental health fingerprint...
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100/20 rounded-full flex items-center justify-center mr-3 animate-bounce">
                      <span className="text-lg">✨</span>
                    </div>
                    <div>
                      <span className="opacity-90 font-medium block mb-1 text-emerald-300">
                        Fingerprint complete!
                      </span>
                      <span className="text-xs opacity-70">
                        Your unique mental health profile is ready for analysis.
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>
      )}

      {/* Enhanced Chat Interface */}
      <div
        className={`chat-area flex flex-col rounded-3xl w-full md:max-w-3xl overflow-hidden relative backdrop-blur-xl border-2 ${
          darkMode
            ? "bg-black border-gray-700/30 shadow-2xl"
            : "bg-white/40 border-gray-200/30 shadow-2xl"
        }`}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0    pointer-events-none"></div>
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
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                          )}
                          {/* Completion glow */}
                          {isCompleted && isLatestMessage && (
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
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
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
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
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full border border-emerald-400/50 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Enhanced Typing Bubble */}
                  <div
                    className={`px-5 py-4 rounded-3xl rounded-bl-lg relative backdrop-blur-xl ${
                      darkMode ? "  text-white" : "  text-gray-900"
                    } shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      </div>
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
          {/* Enhanced Input Bar with floating design */}
          <div
            className={`mx-4 mb-4 p-2 rounded-3xl backdrop-blur-xl shadow-2xl border transition-all duration-300 ${
              darkMode
                ? "bg-black/60 border-white/8 shadow-black/20"
                : "bg-white/80 border-gray-200/28 shadow-gray-900/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 relative group">
                <input
                  className={`w-full px-6 py-4 rounded-2xl font-medium text-base transition-all duration-300 border-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                    darkMode
                      ? "bg-white/5 text-white placeholder-gray-400 hover:bg-white/8"
                      : "bg-gray-50/80 text-gray-900 placeholder-gray-500 hover:bg-gray-100/80"
                  } group-hover:shadow-lg`}
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

                {/* Input focus indicator */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-teal-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Character count for longer messages */}
                {input.length > 100 && (
                  <div
                    className={`absolute -top-8 right-2 text-xs transition-colors duration-200 ${
                      input.length > 500 ? "text-red-400" : "text-gray-400"
                    }`}
                  >
                    {input.length}/1000
                  </div>
                )}
              </div>

              {/* Enhanced Send Button */}
              <button
                className={`relative overflow-hidden p-4 rounded-2xl font-semibold transition-all duration-300 transform-gpu ${
                  input.trim() && !isTyping
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/25"
                    : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
                } group/send`}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5"
                    >
                      <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"></path>
                    </svg>

                    {/* Send button glow effect */}
                    {input.trim() && !isTyping && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover/send:opacity-20 transition-opacity duration-300"></div>
                    )}
                  </div>
                )}
              </button>
            </div>

            {/* Smart suggestions */}
            {conversationData.length > 0 &&
              conversationData.length < 3 &&
              !isTyping && (
                <div className="mt-3 px-2">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                      "Tell me about a recent challenge",
                      "How was your day?",
                      "What's been on your mind?",
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(suggestion)}
                        className={`flex-shrink-0 px-3 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 ${
                          darkMode
                            ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                            : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 border border-gray-200"
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                      I've analyzed your communication patterns, thinking style,
                      and emotional expressions. Your unique mental health
                      fingerprint reveals personalized insights about how you
                      process thoughts and emotions.
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

          {/* Auto-generation notification */}
          {isGeneratingReport && (
            <div className="px-4 pb-4 user-fade-in">
              <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30">
                <div className="flex items-center">
                  <div className="typing-dots mr-3">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div>
                    <h3 className="text-emerald-300 font-medium">
                      Creating your Mental Health Fingerprint...
                    </h3>
                    <p className="text-emerald-100 text-sm">
                      Analyzing communication patterns • Mapping thinking style
                      • Detecting emotional signature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>{" "}
        {/* Close content wrapper */}
      </div>
    </div>
  );
}

export default ChatScreen;
