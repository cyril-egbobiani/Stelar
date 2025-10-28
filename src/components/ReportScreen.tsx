import { useEffect, useState } from "react";
import type { Message, Report } from "../types";
import {
  calculateWellbeingScore,
  extractKeyInsights,
  generateRecommendations,
  summarizeConversation,
  type WellbeingReport,
} from "../utils/conversationAnalysis";
import ReportGeneratingAnimation from "./ReportGeneratingAnimation";
import ReportDisplay from "./ReportDisplay";

interface ReportScreenProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  conversationData: Message[];
  setReport: (report: Report) => void;
}

function ReportScreen({
  onNavigate,
  conversationData,
  setReport,
}: ReportScreenProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedReport, setGeneratedReport] =
    useState<WellbeingReport | null>(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const report = analyzeConversation(conversationData);
    setGeneratedReport(report);
    setReport(convertToReport(report));
    setIsGenerating(false);
  };

  const analyzeConversation = (data: Message[]): WellbeingReport => {
    // Convert Message[] to ConversationMessage[] format
    const conversationData = data.map((message) => ({
      type:
        message.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: message.text,
    }));

    // Analyze conversation data and generate insights
    return {
      wellbeingScore: calculateWellbeingScore(conversationData),
      keyInsights: extractKeyInsights(conversationData),
      recommendations: generateRecommendations(conversationData),
      conversationSummary: summarizeConversation(conversationData),
      emotionalState: "neutral", // Add missing property
      riskLevel: "low", // Add missing property
    };
  };

  const convertToReport = (wellbeingReport: WellbeingReport): Report => {
    return {
      summary: wellbeingReport.conversationSummary,
      reasons: wellbeingReport.keyInsights,
      insights: wellbeingReport.recommendations, // No need to join
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 to-emerald-950 p-8">
      {isGenerating ? (
        <ReportGeneratingAnimation />
      ) : generatedReport ? (
        <ReportDisplay
          report={generatedReport}
          onNext={() => onNavigate("conclusion")}
        />
      ) : null}
    </div>
  );
}

export default ReportScreen;
