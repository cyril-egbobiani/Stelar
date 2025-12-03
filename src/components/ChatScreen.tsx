import { useRef, useState, useEffect, useCallback } from "react";
import type { Message, WellbeingReport } from "../types";
import {
  analyzeConversationReadiness,
  shouldAutoGenerateReport,
  shouldOfferReport,
} from "../utils/conversationReadiness";
import ChatHeader from "./ChatScreen/ChatHeader";
import ChatMessages from "./ChatScreen/ChatMessages";
import ChatInput from "./ChatScreen/ChatInput";
import { PromptSuggestion } from "./ui/prompt-suggestion";
import ChatReportNotification from "./ChatScreen/ChatReportNotification";

interface ChatScreenProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  conversationData: Message[];
  setConversationData: React.Dispatch<React.SetStateAction<Message[]>>;
  conversationId: string | null;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  setReport: (report: WellbeingReport) => void;
  userName: string;
}

function ChatScreen({
  onNavigate,
  conversationData,
  setConversationData,
  conversationId,
  setConversationId,
  setReport,
  userName,
}: ChatScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Enhanced interaction states
  // messagesEndRef is already declared above, remove duplicate
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationData, conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationData]);

  const startNewConversation = async () => {
    try {
      console.log("🚀 Starting new conversation with:", {
        userId,
        userName: userName || "there",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/conversations/start`,
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversations/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            userName: userName || "there", // fallback if somehow no name
          }),
        }
      );

      console.log("📡 Start conversation response status:", response.status);
      console.log("📡 Start conversation response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("📋 Start conversation response data:", data);
        setConversationId(data.conversation.id);

        // Add personalized greeting
        const personalizedGreeting = data.greeting
          ? data.greeting
          : `Hi ${
              userName || "there"
            }! I'm Stelar, your AI mental health companion. I'm here to listen and help you understand your thoughts and feelings better. How are you doing today?`;

        console.log("💬 Setting initial greeting:", personalizedGreeting);

        setConversationData([
          {
            id: generateUniqueId(),
            text: personalizedGreeting,
            sender: "stelar",
            timestamp: Date.now(),
          },
        ]);
      } else {
        console.error(
          "❌ Failed to start conversation, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // Fallback personalized greeting even if backend fails
      const fallbackGreeting = `Hi ${
        userName || "there"
      }! I'm Stelar, your AI mental health companion. I'm here to listen and help you understand your thoughts and feelings better. How are you doing today?`;

      console.log("🔄 Using fallback greeting:", fallbackGreeting);

      setConversationData([
        {
          id: generateUniqueId(),
          text: fallbackGreeting,
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
          console.log("📤 Sending to conversation endpoint:", {
            conversationId,
            message: input,
            url: `${
              import.meta.env.VITE_BACKEND_URL
            }/api/conversations/message`,
          });

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
          console.log("📤 Sending to legacy chat endpoint:", {
            message: input,
            url: `${import.meta.env.VITE_BACKEND_URL}/chat`,
          });

          response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
          });
        }

        console.log("📡 Backend response status:", response.status);
        console.log("📡 Backend response ok:", response.ok);

        const data = await response.json();
        console.log("📋 Backend response data:", data);

        if (data.success && data.assistantMessage) {
          // New format from conversation endpoint
          console.log(
            "✅ Processing conversation endpoint response:",
            data.assistantMessage
          );

          const replyMessage: Message = {
            id: data.assistantMessage.id,
            timestamp: data.assistantMessage.timestamp,
            text: data.assistantMessage.content,
            sender: "stelar",
          };

          console.log("➕ Adding reply message:", replyMessage);

          // Mark as typing for typewriter effect
          setTypingMessageIds((prev) => new Set([...prev, replyMessage.id]));
          setConversationData((msgs) => [...msgs, replyMessage]);

          if (data.nextQuestion) {
            console.log("❓ Adding follow-up question:", data.nextQuestion);
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
          console.log(
            "✅ Processing legacy chat endpoint response:",
            data.reply
          );

          const replyMessage: Message = {
            id: generateUniqueId(),
            timestamp: Date.now(),
            text: data.reply,
            sender: "stelar",
          };

          console.log("➕ Adding legacy reply message:", replyMessage);

          // Mark as typing for typewriter effect
          setTypingMessageIds((prev) => new Set([...prev, replyMessage.id]));
          setConversationData((msgs) => [...msgs, replyMessage]);

          if (data.nextQuestion) {
            console.log(
              "❓ Adding legacy follow-up question:",
              data.nextQuestion
            );
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
        } else {
          console.warn("❌ No valid response format found:", data);
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

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#0E0E0E] to-[#121212] text-white overflow-hidden relative"
    >
      {/* Background texture and atmosphere - same as welcome screen */}
      <div className="absolute inset-0 bg-black">
        {/* Ambient background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-rose-400/3 to-transparent rounded-full blur-3xl" />

        
      </div>

      <div className="relative z-10">
        {/* Header */}
        <ChatHeader
          onNavigate={onNavigate}
          conversationData={conversationData}
          userName={userName}
        />

        {/* Chat Interface with welcome screen design */}
        <div className="flex flex-col items-center w-full px-4">
          <div className="bg-black border border-zinc-900 rounded-4xl w-full md:max-w-3xl overflow-hidden">
            {/* Messages Area */}
            <ChatMessages
              messages={conversationData}
              typingMessageIds={typingMessageIds}
              completedMessageIds={completedMessageIds}
              setCompletedMessageIds={setCompletedMessageIds}
              setTypingMessageIds={setTypingMessageIds}
              messagesEndRef={messagesEndRef}
            />

            {/* Intelligent Report Offer */}
            {showReportOffer && !isGeneratingReport && (
              <div className="px-4 pb-4 user-fade-in">
                <div className="mb-3 p-4 bg-gradient-to-r from-rose-500/10 to-cyan-500/10 rounded-xl border border-rose-400/30">
                  <div>
                    <h3 className="text-rose-300 font-medium mb-2">
                      Your Mental Health Fingerprint is Ready!
                    </h3>
                    <p className="text-rose-100 text-sm mb-3">
                      I've analyzed your communication patterns, thinking style,
                      and emotional expressions. Your unique mental health
                      fingerprint reveals personalized insights about how you
                      process thoughts and emotions.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleNavigateToReport}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-lg font-medium hover:from-rose-600 hover:to-cyan-600 transition-all duration-200 text-sm"
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
            )}

            {/* Chat Input and Suggestions always visible below messages */}
            <div className="p-2">
              {/* Suggestions above input */}
              {conversationData.length > 0 &&
                conversationData.length < 3 &&
                !isTyping && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    <PromptSuggestion
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInput("Tell me about a recent challenge")
                      }
                      className="text-xs"
                    >
                      Tell me about a recent challenge
                    </PromptSuggestion>
                    <PromptSuggestion
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("How was your day?")}
                      className="text-xs"
                    >
                      How was your day?
                    </PromptSuggestion>
                    <PromptSuggestion
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("What's been on your mind?")}
                      className="text-xs"
                    >
                      What's been on your mind?
                    </PromptSuggestion>
                  </div>
                )}
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSend}
                disabled={isTyping}
              />
            </div>
          </div>
        </div>

        {/* Auto-generation notification */}
        {isGeneratingReport && (
          <ChatReportNotification
            onShowReport={handleNavigateToReport}
            userName={userName}
          />
        )}
      </div>
    </div>
  );
}

export default ChatScreen;
