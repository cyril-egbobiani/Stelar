export interface Message {
  id: string;
  text: string;
  sender: "user" | "stelar";
  timestamp: number;
}

export interface ConversationMessage {
  type: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// Mental Health Fingerprint Types
export interface CommunicationPattern {
  responseLength: number; // 0-1 (brief to detailed)
  emotionalExpressiveness: number; // 0-1
  directness: number; // 0-1
  vocabularyComplexity: number; // 0-1
}

export interface ThinkingPattern {
  problemSolvingStyle: "solution-focused" | "analytical" | "ruminative";
  futureOrientation: number; // 0-1
  decisionMaking: "decisive" | "hesitant" | "balanced";
  perspectiveTaking: "self-focused" | "others-focused" | "balanced";
}

export interface EmotionalSignature {
  baselineMood: "optimistic" | "neutral" | "pessimistic";
  emotionalRange: number; // 0-1 (variety of emotions expressed)
  stressTriggers: string[];
  resilienceMarkers: number; // 0-1 (resilience score)
  emotionalRegulation: number; // 0-1
}

export interface MentalHealthFingerprint {
  communicationPattern: CommunicationPattern;
  thinkingPattern: ThinkingPattern;
  emotionalSignature: EmotionalSignature;
  uniquenessScore: number; // How unique this pattern is (0-1)
  confidenceScore: number; // How confident we are in this analysis (0-1)
  lastUpdated: Date;
}

export interface WellbeingReport {
  wellbeingScore: number;
  keyInsights: string[];
  recommendations: string[];
  conversationSummary: string;
  emotionalState: string;
  riskLevel: "low" | "medium" | "high";
  mentalHealthFingerprint?: MentalHealthFingerprint;
}

// API Response types
export interface AnalysisResponse {
  success: boolean;
  analysis: WellbeingReport;
  reportId: string;
  processingTime?: number;
  fallbackUsed?: boolean;
}

export interface ConversationResponse {
  success: boolean;
  conversation: {
    id: string;
    userId: string;
    messages: ConversationMessage[];
    status: "active" | "completed";
    startedAt: string;
    completedAt?: string;
  };
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  nextQuestion: string;
  conversationId?: string;
}
