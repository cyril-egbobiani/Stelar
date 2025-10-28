export interface ConversationMessage {
  type: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface WellbeingReport {
  wellbeingScore: number;
  keyInsights: string[];
  recommendations: string[];
  conversationSummary: string;
  emotionalState: string;
  riskLevel: "low" | "medium" | "high";
}

export const calculateWellbeingScore = (
  conversationData: ConversationMessage[]
): number => {
  let score = 50; // baseline

  conversationData.forEach((msg) => {
    if (msg.type === "user") {
      // Positive indicators
      if (
        msg.content.match(
          /good|happy|positive|better|great|excellent|wonderful/i
        )
      )
        score += 10;
      if (msg.content.match(/grateful|thankful|blessed|optimistic/i))
        score += 15;

      // Negative indicators
      if (msg.content.match(/sad|anxious|stressed|worried|depressed/i))
        score -= 10;
      if (msg.content.match(/hopeless|terrible|awful|panic|crisis/i))
        score -= 20;
    }
  });

  return Math.max(0, Math.min(100, score));
};

export const extractKeyInsights = (
  conversationData: ConversationMessage[]
): string[] => {
  const insights: string[] = [];
  const userMessages = conversationData.filter((msg) => msg.type === "user");
  const allText = userMessages
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  // Detect themes
  if (
    allText.includes("stress") ||
    allText.includes("pressure") ||
    allText.includes("overwhelmed")
  ) {
    insights.push("Stress management appears to be a key concern");
  }

  if (
    allText.includes("sleep") ||
    allText.includes("tired") ||
    allText.includes("insomnia")
  ) {
    insights.push("Sleep patterns may need attention");
  }

  if (
    allText.includes("work") ||
    allText.includes("job") ||
    allText.includes("career")
  ) {
    insights.push("Work-related challenges are affecting wellbeing");
  }

  if (
    allText.includes("relationship") ||
    allText.includes("family") ||
    allText.includes("friends")
  ) {
    insights.push("Social relationships are an important factor");
  }

  if (
    allText.includes("anxious") ||
    allText.includes("anxiety") ||
    allText.includes("worried")
  ) {
    insights.push("Anxiety levels may benefit from management techniques");
  }

  return insights;
};

export const generateRecommendations = (
  conversationData: ConversationMessage[]
): string[] => {
  const recommendations: string[] = [];
  const allText = conversationData
    .filter((msg) => msg.type === "user")
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  // Base recommendations
  recommendations.push("Practice daily mindfulness for 10 minutes");
  recommendations.push("Maintain a regular sleep schedule");

  // Conditional recommendations based on conversation content
  if (allText.includes("stress") || allText.includes("overwhelmed")) {
    recommendations.push(
      "Try deep breathing exercises during stressful moments"
    );
    recommendations.push("Consider time management techniques");
  }

  if (allText.includes("anxious") || allText.includes("anxiety")) {
    recommendations.push("Practice grounding techniques (5-4-3-2-1 method)");
    recommendations.push("Consider limiting caffeine intake");
  }

  if (allText.includes("sleep") || allText.includes("tired")) {
    recommendations.push("Create a relaxing bedtime routine");
    recommendations.push("Avoid screens 1 hour before bed");
  }

  if (allText.includes("lonely") || allText.includes("isolated")) {
    recommendations.push("Reach out to friends or family members");
    recommendations.push("Consider joining social activities or groups");
  }

  // Always include professional help option
  recommendations.push(
    "Consider speaking with a mental health professional if concerns persist"
  );

  return recommendations;
};

export const summarizeConversation = (
  conversationData: ConversationMessage[]
): string => {
  const userMessages = conversationData.filter((msg) => msg.type === "user");
  const messageCount = userMessages.length;

  if (messageCount === 0) return "No conversation data available.";

  const commonThemes = extractKeyInsights(conversationData);
  const themeText =
    commonThemes.length > 0
      ? `Main themes discussed include ${commonThemes
          .join(", ")
          .toLowerCase()}.`
      : "Various personal topics were discussed.";

  return `You shared ${messageCount} messages during our conversation. ${themeText} Your openness in discussing these topics shows a positive step toward understanding your wellbeing.`;
};

export const analyzeConversation = (
  conversationData: ConversationMessage[]
): WellbeingReport => {
  const wellbeingScore = calculateWellbeingScore(conversationData);
  const keyInsights = extractKeyInsights(conversationData);
  const recommendations = generateRecommendations(conversationData);
  const conversationSummary = summarizeConversation(conversationData);

  // Determine emotional state
  let emotionalState = "neutral";
  if (wellbeingScore >= 70) emotionalState = "positive";
  else if (wellbeingScore <= 30) emotionalState = "concerning";

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (wellbeingScore <= 20) riskLevel = "high";
  else if (wellbeingScore <= 40) riskLevel = "medium";

  return {
    wellbeingScore,
    keyInsights,
    recommendations,
    conversationSummary,
    emotionalState,
    riskLevel,
  };
};
