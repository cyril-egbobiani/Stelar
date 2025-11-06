import type {
  ConversationMessage,
  WellbeingReport,
  MentalHealthFingerprint,
  CommunicationPattern,
  ThinkingPattern,
  EmotionalSignature,
} from "../types";

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

  // Generate basic insights from the mental health fingerprint
  const fingerprint = generateMentalHealthFingerprint(conversationData);

  // Communication pattern insights
  if (fingerprint.communicationPattern.emotionalExpressiveness > 0.7) {
    insights.push(
      "You express emotions openly and authentically in your communication"
    );
  } else if (fingerprint.communicationPattern.emotionalExpressiveness < 0.3) {
    insights.push(
      "You communicate in a more reserved emotional style; exploring emotional expression might be valuable"
    );
  }

  if (fingerprint.communicationPattern.directness > 0.7) {
    insights.push(
      "Your direct communication style shows clarity and confidence in expressing yourself"
    );
  } else if (fingerprint.communicationPattern.directness < 0.3) {
    insights.push(
      "You communicate with careful consideration; building assertiveness could be empowering"
    );
  }

  // Thinking pattern insights
  if (fingerprint.thinkingPattern.problemSolvingStyle === "solution-focused") {
    insights.push(
      "Your solution-oriented mindset is a significant strength for overcoming challenges"
    );
  } else if (fingerprint.thinkingPattern.problemSolvingStyle === "ruminative") {
    insights.push(
      "You tend to deeply process experiences; learning to break rumination cycles could help"
    );
  }

  if (fingerprint.thinkingPattern.futureOrientation > 0.6) {
    insights.push(
      "Your forward-thinking approach shows optimism and planning abilities"
    );
  } else if (fingerprint.thinkingPattern.futureOrientation < 0.3) {
    insights.push(
      "You're very present-focused; setting future goals might enhance motivation"
    );
  }

  // Emotional signature insights
  if (fingerprint.emotionalSignature.emotionalRange > 0.6) {
    insights.push(
      "You experience a rich emotional life, which indicates depth and authenticity"
    );
  }

  if (fingerprint.emotionalSignature.resilienceMarkers > 0.5) {
    insights.push(
      "You demonstrate strong resilience patterns that help you navigate difficulties"
    );
  }

  if (fingerprint.emotionalSignature.emotionalRegulation > 0.6) {
    insights.push(
      "You show good emotional self-awareness and regulation skills"
    );
  }

  // Traditional theme-based insights (enhanced)
  if (
    allText.includes("stress") ||
    allText.includes("pressure") ||
    allText.includes("overwhelmed")
  ) {
    const stressInsight =
      fingerprint.thinkingPattern.problemSolvingStyle === "solution-focused"
        ? "While stress is present, your solution-focused approach is helping you manage it effectively"
        : "Stress management appears to be a key concern that could benefit from targeted strategies";
    insights.push(stressInsight);
  }

  if (
    allText.includes("sleep") ||
    allText.includes("tired") ||
    allText.includes("insomnia")
  ) {
    insights.push(
      "Sleep patterns may need attention to support your overall wellbeing"
    );
  }

  if (
    allText.includes("work") ||
    allText.includes("job") ||
    allText.includes("career")
  ) {
    const workInsight =
      fingerprint.thinkingPattern.perspectiveTaking === "others-focused"
        ? "Work challenges are affecting you, and your consideration for others shows strong interpersonal skills"
        : "Work-related challenges are affecting wellbeing and deserve focused attention";
    insights.push(workInsight);
  }

  if (
    allText.includes("relationship") ||
    allText.includes("family") ||
    allText.includes("friends")
  ) {
    insights.push(
      "Social relationships are an important factor in your wellbeing"
    );
  }

  if (
    allText.includes("anxious") ||
    allText.includes("anxiety") ||
    allText.includes("worried")
  ) {
    const anxietyInsight =
      fingerprint.emotionalSignature.emotionalRegulation > 0.5
        ? "You show awareness of anxiety, and your emotional regulation skills are a valuable resource"
        : "Anxiety levels may benefit from management techniques and emotional regulation strategies";
    insights.push(anxietyInsight);
  }

  // Add uniqueness insight
  if (fingerprint.uniquenessScore > 0.6) {
    insights.push(
      "Your communication and thinking patterns are quite unique, which reflects your individual perspective"
    );
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

// Mental Health Fingerprint Analysis Functions

export const analyzeCommunicationPattern = (
  conversationData: ConversationMessage[]
): CommunicationPattern => {
  const userMessages = conversationData.filter((msg) => msg.type === "user");

  if (userMessages.length === 0) {
    return {
      responseLength: 0.5,
      emotionalExpressiveness: 0.5,
      directness: 0.5,
      vocabularyComplexity: 0.5,
    };
  }

  // Calculate average response length
  const avgLength =
    userMessages.reduce((sum, msg) => sum + msg.content.length, 0) /
    userMessages.length;
  const responseLength = Math.min(1, avgLength / 200); // Normalize to 0-1

  // Analyze emotional expressiveness (use of emotional words)
  const emotionalWords = userMessages.reduce((count, msg) => {
    const text = msg.content.toLowerCase();
    const emotions = text.match(
      /feel|feeling|emotion|happy|sad|angry|excited|worried|anxious|stressed|grateful|frustrated|overwhelmed|calm|peaceful|hopeful|hopeless|confident|insecure/g
    );
    return count + (emotions ? emotions.length : 0);
  }, 0);
  const emotionalExpressiveness = Math.min(
    1,
    (emotionalWords / userMessages.length) * 0.25
  );

  // Analyze directness (use of "I" statements, definitive language)
  const directnessIndicators = userMessages.reduce((count, msg) => {
    const text = msg.content.toLowerCase();
    const directWords = text.match(
      /\bi\s|definitely|absolutely|certain|sure|know|will|must|always|never/g
    );
    const indirectWords = text.match(
      /maybe|perhaps|might|could|possibly|sometimes|kind of|sort of|i think|i guess/g
    );
    return (
      count +
      (directWords ? directWords.length : 0) -
      (indirectWords ? indirectWords.length : 0)
    );
  }, 0);
  const directness = Math.max(
    0,
    Math.min(1, 0.5 + directnessIndicators * 0.05)
  );

  // Analyze vocabulary complexity (longer words, varied vocabulary)
  const allWords = userMessages.join(" ").toLowerCase().split(/\s+/);
  const complexWords = allWords.filter((word) => word.length > 6).length;
  const uniqueWords = new Set(allWords).size;
  const vocabularyComplexity = Math.min(
    1,
    complexWords / allWords.length + (uniqueWords / allWords.length) * 0.5
  );

  return {
    responseLength,
    emotionalExpressiveness,
    directness,
    vocabularyComplexity,
  };
};

export const analyzeThinkingPattern = (
  conversationData: ConversationMessage[]
): ThinkingPattern => {
  const userMessages = conversationData.filter((msg) => msg.type === "user");
  const allText = userMessages
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  // Analyze problem-solving style
  const solutionWords = allText.match(
    /solution|fix|solve|plan|strategy|approach|try|will|action|steps/g
  );
  const analyticalWords = allText.match(
    /because|reason|analyze|think|consider|evaluate|understand|why|how/g
  );
  const ruminativeWords = allText.match(
    /worry|anxious|can't stop|keep thinking|ruminate|cycle|loop|stuck/g
  );

  const solutionCount = solutionWords ? solutionWords.length : 0;
  const analyticalCount = analyticalWords ? analyticalWords.length : 0;
  const ruminativeCount = ruminativeWords ? ruminativeWords.length : 0;

  let problemSolvingStyle: "solution-focused" | "analytical" | "ruminative";
  if (solutionCount > analyticalCount && solutionCount > ruminativeCount) {
    problemSolvingStyle = "solution-focused";
  } else if (
    ruminativeCount > solutionCount &&
    ruminativeCount > analyticalCount
  ) {
    problemSolvingStyle = "ruminative";
  } else {
    problemSolvingStyle = "analytical";
  }

  // Analyze future orientation
  const futureWords = allText.match(
    /will|future|plan|goal|tomorrow|next|hope|dream|aspire|want to|going to/g
  );
  const futureOrientation = Math.min(
    1,
    ((futureWords ? futureWords.length : 0) / userMessages.length) * 0.2
  );

  // Analyze decision making
  const decisiveWords = allText.match(
    /decided|will|definitely|certain|sure|know what|clear|determined/g
  );
  const hesitantWords = allText.match(
    /maybe|unsure|don't know|confused|uncertain|hesitant|not sure/g
  );
  const decisiveCount = decisiveWords ? decisiveWords.length : 0;
  const hesitantCount = hesitantWords ? hesitantWords.length : 0;

  let decisionMaking: "decisive" | "hesitant" | "balanced";
  if (decisiveCount > hesitantCount * 1.5) {
    decisionMaking = "decisive";
  } else if (hesitantCount > decisiveCount * 1.5) {
    decisionMaking = "hesitant";
  } else {
    decisionMaking = "balanced";
  }

  // Analyze perspective taking
  const selfWords = allText.match(/\bi\s|\bme\b|\bmy\b|\bmyself\b/g);
  const othersWords = allText.match(
    /they|them|people|others|family|friends|colleague|partner/g
  );
  const selfCount = selfWords ? selfWords.length : 0;
  const othersCount = othersWords ? othersWords.length : 0;

  let perspectiveTaking: "self-focused" | "others-focused" | "balanced";
  if (selfCount > othersCount * 2) {
    perspectiveTaking = "self-focused";
  } else if (othersCount > selfCount) {
    perspectiveTaking = "others-focused";
  } else {
    perspectiveTaking = "balanced";
  }

  return {
    problemSolvingStyle,
    futureOrientation,
    decisionMaking,
    perspectiveTaking,
  };
};

export const analyzeEmotionalSignature = (
  conversationData: ConversationMessage[]
): EmotionalSignature => {
  const userMessages = conversationData.filter((msg) => msg.type === "user");
  const allText = userMessages
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  // Analyze baseline mood
  const positiveWords = allText.match(
    /good|great|happy|excited|wonderful|amazing|fantastic|love|enjoy|grateful|thankful|blessed|optimistic|hopeful|confident/g
  );
  const negativeWords = allText.match(
    /bad|terrible|sad|angry|frustrated|worried|anxious|stressed|depressed|hopeless|awful|hate|annoyed/g
  );
  const neutralWords = allText.match(
    /okay|fine|normal|average|usual|typical|same|regular/g
  );

  const positiveCount = positiveWords ? positiveWords.length : 0;
  const negativeCount = negativeWords ? negativeWords.length : 0;
  const neutralCount = neutralWords ? neutralWords.length : 0;

  let baselineMood: "optimistic" | "neutral" | "pessimistic";
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    baselineMood = "optimistic";
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    baselineMood = "pessimistic";
  } else {
    baselineMood = "neutral";
  }

  // Analyze emotional range (variety of emotions)
  const emotionCategories = {
    joy: /happy|excited|joyful|elated|cheerful|delighted/g,
    sadness: /sad|down|blue|melancholy|disappointed|heartbroken/g,
    anger: /angry|mad|furious|irritated|annoyed|frustrated/g,
    fear: /scared|afraid|terrified|anxious|worried|nervous/g,
    surprise: /surprised|shocked|amazed|astonished|stunned/g,
    disgust: /disgusted|revolted|repulsed|sickened/g,
    calm: /calm|peaceful|serene|relaxed|tranquil/g,
    love: /love|adore|cherish|affection|care|fond/g,
  };

  const emotionsFound = Object.keys(emotionCategories).filter((emotion) =>
    allText.match(emotionCategories[emotion as keyof typeof emotionCategories])
  );
  const emotionalRange = Math.min(
    1,
    emotionsFound.length / Object.keys(emotionCategories).length
  );

  // Extract stress triggers (context around stress words)
  const stressTriggers: string[] = [];
  const stressMatches = allText.match(
    /stressed about|stressed by|anxiety about|worried about|overwhelmed by|pressure from/g
  );
  if (stressMatches) {
    stressMatches.forEach((match) => stressTriggers.push(match));
  }

  // Extract resilience markers and calculate score
  const resilienceMatches = allText.match(
    /overcome|manage|cope|handle|get through|bounce back|resilient|strong|persevere/g
  );
  const resilienceScore = Math.min(
    1,
    ((resilienceMatches ? resilienceMatches.length : 0) / userMessages.length) *
      0.3
  );

  // Analyze emotional regulation (ability to discuss difficult emotions calmly)
  const emotionalRegulationIndicators = allText.match(
    /understand|realize|recognize|aware|manage|control|regulate|cope|handle/g
  );
  const emotionalRegulation = Math.min(
    1,
    ((emotionalRegulationIndicators
      ? emotionalRegulationIndicators.length
      : 0) /
      userMessages.length) *
      0.25
  );

  return {
    baselineMood,
    emotionalRange,
    stressTriggers: [...new Set(stressTriggers)].slice(0, 5), // Unique triggers, max 5
    resilienceMarkers: resilienceScore,
    emotionalRegulation,
  };
};

export const generateMentalHealthFingerprint = (
  conversationData: ConversationMessage[]
): MentalHealthFingerprint => {
  const communicationPattern = analyzeCommunicationPattern(conversationData);
  const thinkingPattern = analyzeThinkingPattern(conversationData);
  const emotionalSignature = analyzeEmotionalSignature(conversationData);

  // Calculate uniqueness score based on how different the patterns are from "average"
  const avgExpressiveness = 0.5;
  const avgDirectness = 0.5;
  const avgComplexity = 0.5;
  const avgFutureOrientation = 0.5;
  const avgEmotionalRange = 0.5;
  const avgRegulation = 0.5;

  const uniquenessFactors = [
    Math.abs(communicationPattern.emotionalExpressiveness - avgExpressiveness),
    Math.abs(communicationPattern.directness - avgDirectness),
    Math.abs(communicationPattern.vocabularyComplexity - avgComplexity),
    Math.abs(thinkingPattern.futureOrientation - avgFutureOrientation),
    Math.abs(emotionalSignature.emotionalRange - avgEmotionalRange),
    Math.abs(emotionalSignature.emotionalRegulation - avgRegulation),
  ];

  const uniquenessScore =
    uniquenessFactors.reduce((sum, factor) => sum + factor, 0) /
    uniquenessFactors.length;

  // Calculate confidence based on conversation length and data richness
  const messageCount = conversationData.filter(
    (msg) => msg.type === "user"
  ).length;
  const wordCount = conversationData
    .filter((msg) => msg.type === "user")
    .reduce((sum, msg) => sum + msg.content.split(" ").length, 0);

  // More sophisticated confidence calculation
  let confidenceScore = 0;

  // Base confidence from message count (need at least 10 for reliable patterns)
  if (messageCount >= 30) confidenceScore += 0.5; // High confidence base
  else if (messageCount >= 15)
    confidenceScore += 0.35; // Medium confidence base
  else if (messageCount >= 8) confidenceScore += 0.2; // Low confidence base
  else confidenceScore += 0.1; // Very low confidence

  // Additional confidence from word count (depth of responses)
  const avgWordsPerMessage = wordCount / Math.max(messageCount, 1);
  if (avgWordsPerMessage >= 20) confidenceScore += 0.2; // Detailed responses
  else if (avgWordsPerMessage >= 10)
    confidenceScore += 0.15; // Moderate responses
  else confidenceScore += 0.05; // Brief responses

  // Bonus for emotional vocabulary richness
  const emotionalWords = conversationData
    .filter((msg) => msg.type === "user")
    .join(" ")
    .toLowerCase()
    .match(
      /feel|emotion|happy|sad|angry|excited|worried|anxious|stressed|grateful|frustrated|calm|hopeful|confident/g
    );
  const emotionalRichness = emotionalWords
    ? emotionalWords.length / messageCount
    : 0;
  if (emotionalRichness >= 2) confidenceScore += 0.15;
  else if (emotionalRichness >= 1) confidenceScore += 0.1;
  else confidenceScore += 0.05;

  // Cap at 1.0
  confidenceScore = Math.min(1, confidenceScore);

  return {
    communicationPattern,
    thinkingPattern,
    emotionalSignature,
    uniquenessScore,
    confidenceScore,
    lastUpdated: new Date(),
  };
};

export const analyzeConversation = (
  conversationData: ConversationMessage[]
): WellbeingReport => {
  const wellbeingScore = calculateWellbeingScore(conversationData);
  const keyInsights = extractKeyInsights(conversationData);
  const recommendations = generateRecommendations(conversationData);
  const conversationSummary = summarizeConversation(conversationData);

  // Generate Mental Health Fingerprint
  const mentalHealthFingerprint =
    generateMentalHealthFingerprint(conversationData);

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
    mentalHealthFingerprint,
  };
};
