import { useEffect, useState, useCallback } from "react";
import type { Message, WellbeingReport } from "../types";
import {
  calculateWellbeingScore,
  extractKeyInsights,
  generateRecommendations,
  summarizeConversation,
  generateMentalHealthFingerprint,
} from "../utils/conversationAnalysis";
import ReportGeneratingAnimation from "./ReportGeneratingAnimation";
import ReportDisplay from "./ReportDisplay";

interface ReportScreenProps {
  onNavigate: (
    screen:
      | "welcome"
      | "about"
      | "userDetails"
      | "chat"
      | "report"
      | "receipt"
      | "conclusion"
  ) => void;
  setWellbeingReport: (report: WellbeingReport) => void;
  conversationData?: Message[];
  conversationId?: string | null;
}

function ReportScreen({
  onNavigate,
  conversationData,
  setWellbeingReport,
  conversationId,
}: ReportScreenProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedReport, setGeneratedReport] =
    useState<WellbeingReport | null>(null);

  const generateReport = useCallback(async () => {
    setIsGenerating(true);

    try {
      if (conversationId) {
        // Use backend analysis for proper AI-powered analysis
        const analysisResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/analysis/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId }),
          }
        );

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();

          if (analysisData.success) {
            // Convert backend analysis to frontend format
            const backendReport: WellbeingReport = {
              wellbeingScore: analysisData.analysis.wellbeingScore,
              keyInsights: analysisData.analysis.keyInsights,
              recommendations: analysisData.analysis.recommendations,
              conversationSummary: `Analysis of your conversation reveals insights about your current wellbeing state.`,
              emotionalState: analysisData.analysis.emotionalState,
              riskLevel: analysisData.analysis.riskLevel,
            };

            setGeneratedReport(backendReport);
            setWellbeingReport(backendReport);
            setIsGenerating(false);
            return;
          }
        }
      }

      // Fallback to local analysis if backend fails or no conversationId
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const report = analyzeConversation(conversationData ?? []);
      setGeneratedReport(report);
      setWellbeingReport(report);
    } catch (error) {
      console.error("Report generation error:", error);
      // Fallback to local analysis
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const report = analyzeConversation(conversationData ?? []);
      setGeneratedReport(report);
      setWellbeingReport(report);
    }

    setIsGenerating(false);
  }, [conversationId, conversationData, setWellbeingReport]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

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
      mentalHealthFingerprint:
        generateMentalHealthFingerprint(conversationData),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 to-indigo-950 p-8">
      {isGenerating ? (
        <ReportGeneratingAnimation />
      ) : generatedReport ? (
        <ReportDisplay
          report={generatedReport}
          onNext={() => onNavigate("receipt")}
        />
      ) : null}
    </div>
  );
}

export default ReportScreen;
