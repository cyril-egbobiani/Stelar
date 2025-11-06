import type { Message } from "../types";

interface ReadinessAnalysis {
  isReady: boolean;
  confidence: number;
  reason: string;
  suggestedAction: "continue" | "offer_report" | "auto_generate";
}

export const analyzeConversationReadiness = (
  messages: Message[]
): ReadinessAnalysis => {
  const userMessages = messages.filter((msg) => msg.sender === "user");
  const exchangeCount = Math.floor(messages.length / 2);

  if (userMessages.length === 0) {
    return {
      isReady: false,
      confidence: 0,
      reason: "No user messages",
      suggestedAction: "continue",
    };
  }

  const lastUserMessage =
    userMessages[userMessages.length - 1]?.text.toLowerCase() || "";
  const recentMessages = userMessages
    .slice(-3)
    .map((msg) => msg.text.toLowerCase())
    .join(" ");
  const allUserText = userMessages
    .map((msg) => msg.text.toLowerCase())
    .join(" ");

  // Natural ending indicators
  const endingPhrases = [
    /thank you for listening/,
    /that helps a lot/,
    /i feel better/,
    /makes sense/,
    /that's helpful/,
    /good advice/,
    /i'll try that/,
    /thank you/,
    /appreciate/,
    /ready to/,
    /feeling clearer/,
    /understand now/,
    /got it/,
    /makes perfect sense/,
  ];

  const completionPhrases = [
    /think i'm done/,
    /that's all/,
    /nothing else/,
    /covers everything/,
    /ready for insights/,
    /want to see/,
    /curious about/,
    /show me/,
    /what do you think/,
  ];

  const reflectionPhrases = [
    /looking back/,
    /thinking about/,
    /realize/,
    /understand/,
    /learned/,
    /insight/,
    /perspective/,
    /see now/,
    /makes me think/,
  ];

  let readinessScore = 0;
  const reasons: string[] = [];

  // Minimum conversation depth
  if (exchangeCount >= 15) {
    readinessScore += 0.3;
    reasons.push("substantial conversation depth");
  } else if (exchangeCount >= 8) {
    readinessScore += 0.1;
    reasons.push("moderate conversation depth");
  }

  // Natural ending signals
  const endingSignals = endingPhrases.filter((phrase) =>
    lastUserMessage.match(phrase)
  ).length;
  if (endingSignals > 0) {
    readinessScore += 0.4;
    reasons.push("natural conversation ending");
  }

  // Completion expressions
  const completionSignals = completionPhrases.filter((phrase) =>
    recentMessages.match(phrase)
  ).length;
  if (completionSignals > 0) {
    readinessScore += 0.3;
    reasons.push("user expressing completion");
  }

  // Reflective language
  const reflectionSignals = reflectionPhrases.filter((phrase) =>
    recentMessages.match(phrase)
  ).length;
  if (reflectionSignals > 0) {
    readinessScore += 0.2;
    reasons.push("reflective language");
  }

  // Emotional resolution indicators
  const resolutionWords = allUserText.match(
    /better|clearer|understand|helpful|resolved|confident|calm|peaceful/g
  );
  if (resolutionWords && resolutionWords.length >= 2) {
    readinessScore += 0.2;
    reasons.push("emotional resolution");
  }

  // Length of recent messages (shorter = winding down)
  const recentLength =
    userMessages.slice(-2).reduce((sum, msg) => sum + msg.text.length, 0) / 2;
  if (recentLength < 50 && exchangeCount >= 8) {
    readinessScore += 0.1;
    reasons.push("conversation naturally winding down");
  }

  // Determine action based on score
  let suggestedAction: "continue" | "offer_report" | "auto_generate";
  if (readinessScore >= 0.7) {
    suggestedAction = "auto_generate";
  } else if (readinessScore >= 0.4 && exchangeCount >= 8) {
    suggestedAction = "offer_report";
  } else {
    suggestedAction = "continue";
  }

  return {
    isReady: readinessScore >= 0.4,
    confidence: Math.min(readinessScore, 1.0),
    reason: reasons.join(", ") || "continuing conversation",
    suggestedAction,
  };
};

export const shouldOfferReport = (messages: Message[]): boolean => {
  const analysis = analyzeConversationReadiness(messages);
  return (
    analysis.suggestedAction === "offer_report" ||
    analysis.suggestedAction === "auto_generate"
  );
};

export const shouldAutoGenerateReport = (messages: Message[]): boolean => {
  const analysis = analyzeConversationReadiness(messages);
  return analysis.suggestedAction === "auto_generate";
};
