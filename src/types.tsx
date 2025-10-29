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

export interface WellbeingReport {
  wellbeingScore: number;
  keyInsights: string[];
  recommendations: string[];
  conversationSummary: string;
  emotionalState: string;
  riskLevel: "low" | "medium" | "high";
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
