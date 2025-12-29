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
import ChatReportNotification from "./ChatScreen/ChatReportNotification";
import MoodCheckIn, {
  type MoodSelection,
  type IntentSelection,
} from "./ChatScreen/MoodCheckIn";
import ConversationProgress from "./ChatScreen/ConversationProgress";
import { getPhaseFromMessageCount } from "./ChatScreen/conversationPhases";
import QuickReplies from "./ChatScreen/QuickReplies";

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

  // Mood check-in state (new guided flow)
  const [hasCompletedCheckIn, setHasCompletedCheckIn] = useState(false);
  const [userMood, setUserMood] = useState<MoodSelection | null>(null);
  const [userIntent, setUserIntent] = useState<IntentSelection | null>(null);

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

  // Only start conversation after mood check-in is complete
  useEffect(() => {
    if (
      hasCompletedCheckIn &&
      conversationData.length === 0 &&
      !conversationId
    ) {
      startNewConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedCheckIn, conversationData, conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationData]);

  // Handle mood check-in completion
  const handleMoodCheckInComplete = (
    mood: MoodSelection,
    intent: IntentSelection
  ) => {
    setUserMood(mood);
    setUserIntent(intent);
    setHasCompletedCheckIn(true);
  };

  const startNewConversation = async () => {
    try {
      // Build context-aware greeting based on mood/intent
      const moodContext = userMood
        ? `User is feeling ${userMood.label.toLowerCase()} (${userMood.emoji}).`
        : "";
      const intentContext = userIntent
        ? `They want to: ${userIntent.label.toLowerCase()} - ${
            userIntent.description
          }.`
        : "";

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversations/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            userName: userName || "there",
            context: {
              mood: userMood,
              intent: userIntent,
              moodContext,
              intentContext,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversation.id);

        // Generate contextual greeting based on mood/intent
        let greeting = data.greeting;
        if (!greeting) {
          greeting = getContextualGreeting(userName, userMood, userIntent);
        }

        setConversationData([
          {
            id: generateUniqueId(),
            text: greeting,
            sender: "stelar",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // Fallback contextual greeting even if backend fails
      const fallbackGreeting = getContextualGreeting(
        userName,
        userMood,
        userIntent
      );

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

  // Generate greeting based on mood and intent
  const getContextualGreeting = (
    name: string,
    mood: MoodSelection | null,
    intent: IntentSelection | null
  ): string => {
    const displayName = name || "there";

    // Low mood greetings
    if (mood && mood.value <= 2) {
      if (intent?.id === "vent") {
        return `Hey ${displayName}. I can see things feel heavy right now. I'm here to listen — no judgment, no advice unless you want it. Take your time.`;
      }
      if (intent?.id === "anxious") {
        return `Hey ${displayName}. Anxiety can be really draining. Let's slow down together. What's weighing on your mind?`;
      }
      return `Hey ${displayName}. I'm glad you're here. Sometimes just showing up is the hardest part. What's going on?`;
    }

    // Neutral mood greetings
    if (mood && mood.value === 3) {
      if (intent?.id === "reflect") {
        return `Hey ${displayName}. Ready to do some thinking? I'll help you work through whatever's on your mind.`;
      }
      if (intent?.id === "talk") {
        return `Hey ${displayName}! I'm here for it — no agenda needed. What's been on your mind lately?`;
      }
      return `Hey ${displayName}. I'm here whenever you're ready. What would you like to explore?`;
    }

    // Good/Great mood greetings
    if (mood && mood.value >= 4) {
      if (intent?.id === "reflect") {
        return `Hey ${displayName}! Love the energy. Let's channel that into some reflection. What's been going well?`;
      }
      return `Hey ${displayName}! Good to see you in good spirits. What brings you here today?`;
    }

    // Default
    return `Hey ${displayName}! I'm Stelar. I'm here to listen and help you understand your thoughts better. What's on your mind?`;
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
      className="min-h-screen bg-black text-white overflow-hidden relative"
    >
      {/* Show mood check-in if not completed */}
      {!hasCompletedCheckIn ? (
        <MoodCheckIn
          onComplete={handleMoodCheckInComplete}
          userName={userName}
        />
      ) : (
        <div className="relative z-10 flex flex-col h-screen">
          {/* Header */}
          <ChatHeader
            onNavigate={onNavigate}
            conversationData={conversationData}
            userName={userName}
          />

          {/* Progress indicator */}
          <ConversationProgress
            currentPhase={getPhaseFromMessageCount(conversationData.length)}
            messageCount={conversationData.length}
          />

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col items-center w-full px-4 min-h-0">
            <div className="bg-black border-x border-t border-zinc-900 rounded-t-4xl w-full md:max-w-3xl overflow-hidden flex flex-col h-full">
              {/* Messages Area */}
              <ChatMessages
                messages={conversationData}
                typingMessageIds={typingMessageIds}
                completedMessageIds={completedMessageIds}
                setCompletedMessageIds={setCompletedMessageIds}
                setTypingMessageIds={setTypingMessageIds}
                messagesEndRef={messagesEndRef}
                isTyping={isTyping}
              />

              {/* Intelligent Report Offer */}
              {showReportOffer && !isGeneratingReport && (
                <div className="px-4 pb-4">
                  <div className="p-4 bg-gradient-to-r from-rose-500/10 to-zinc-900 rounded-xl border border-rose-500/30">
                    <h3 className="text-rose-300 font-medium mb-2">
                      Your insights are ready
                    </h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      I've gathered enough to share some personalized insights
                      about your mental wellbeing.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleNavigateToReport}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-all duration-200 text-sm"
                      >
                        View insights
                      </button>
                      <button
                        onClick={() => setShowReportOffer(false)}
                        className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-700 transition-all duration-200 text-sm"
                      >
                        Keep chatting
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Input with Quick Replies */}
              <div className="p-3 border-t border-zinc-900">
                {/* Quick Replies */}
                <QuickReplies
                  phase={getPhaseFromMessageCount(conversationData.length)}
                  intent={userIntent}
                  onSelect={(reply) => {
                    setInput(reply);
                    // Auto-send after a brief delay for UX
                    setTimeout(() => {
                      if (reply.trim()) {
                        handleSend();
                      }
                    }, 100);
                  }}
                  disabled={isTyping}
                  lastAiMessage={
                    conversationData.filter((m) => m.sender === "stelar").pop()
                      ?.text || ""
                  }
                />

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
      )}
    </div>
  );
}

export default ChatScreen;
