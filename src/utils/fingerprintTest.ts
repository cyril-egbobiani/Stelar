import { generateMentalHealthFingerprint } from "./conversationAnalysis";
import type { ConversationMessage } from "../types";

// Test the Mental Health Fingerprint with sample conversation
export const testFingerprint = () => {
  const sampleConversation: ConversationMessage[] = [
    {
      type: "user",
      content:
        "I've been feeling really stressed about work lately. My boss keeps giving me more projects and I'm not sure how to handle it all.",
    },
    {
      type: "assistant",
      content:
        "That sounds overwhelming. Can you tell me more about what's been most challenging?",
    },
    {
      type: "user",
      content:
        "Well, I'm usually pretty good at solving problems and finding solutions, but this feels different. I keep worrying about disappointing my team and I can't seem to turn off these anxious thoughts.",
    },
    {
      type: "assistant",
      content:
        "It sounds like you're dealing with both the practical challenge and the emotional impact. What have you tried so far?",
    },
    {
      type: "user",
      content:
        "I've been trying to make lists and prioritize, which usually helps me. I'm grateful that I have supportive colleagues, but I don't want to burden them. I know I need to figure out a better way to manage this stress.",
    },
    {
      type: "assistant",
      content:
        "It's good that you're being proactive about finding solutions. What does your ideal work situation look like?",
    },
    {
      type: "user",
      content:
        "I want to feel confident and in control again. I love my job and I'm determined to make this work. I just need to develop better strategies for handling pressure and maybe learn to say no sometimes.",
    },
  ];

  const fingerprint = generateMentalHealthFingerprint(sampleConversation);

  console.log("🧠 Mental Health Fingerprint Test Results:");
  console.log("==========================================");
  console.log("📞 Communication Pattern:");
  console.log(
    `  Response Length: ${fingerprint.communicationPattern.responseLength}`
  );
  console.log(
    `  Emotional Expressiveness: ${fingerprint.communicationPattern.emotionalExpressiveness}/100`
  );
  console.log(
    `  Directness: ${fingerprint.communicationPattern.directness}/100`
  );
  console.log(
    `  Vocabulary Complexity: ${fingerprint.communicationPattern.vocabularyComplexity}/100`
  );

  console.log("\n🧩 Thinking Pattern:");
  console.log(
    `  Problem Solving Style: ${fingerprint.thinkingPattern.problemSolvingStyle}`
  );
  console.log(
    `  Future Orientation: ${fingerprint.thinkingPattern.futureOrientation}/100`
  );
  console.log(
    `  Decision Making: ${fingerprint.thinkingPattern.decisionMaking}`
  );
  console.log(
    `  Perspective Taking: ${fingerprint.thinkingPattern.perspectiveTaking}`
  );

  console.log("\n❤️ Emotional Signature:");
  console.log(
    `  Baseline Mood: ${fingerprint.emotionalSignature.baselineMood}`
  );
  console.log(
    `  Emotional Range: ${fingerprint.emotionalSignature.emotionalRange}/100`
  );
  console.log(
    `  Stress Triggers: ${
      fingerprint.emotionalSignature.stressTriggers.join(", ") ||
      "None detected"
    }`
  );
  console.log(
    `  Resilience Markers: ${
      fingerprint.emotionalSignature.resilienceMarkers.toString ||
      "None detected"
    }`
  );
  console.log(
    `  Emotional Regulation: ${fingerprint.emotionalSignature.emotionalRegulation}/100`
  );

  console.log("\n🎯 Overall Metrics:");
  console.log(`  Uniqueness Score: ${fingerprint.uniquenessScore}/100`);
  console.log(`  Confidence: ${fingerprint.confidenceScore}/100`);
  console.log(`  Last Updated: ${fingerprint.lastUpdated}`);

  return fingerprint;
};
