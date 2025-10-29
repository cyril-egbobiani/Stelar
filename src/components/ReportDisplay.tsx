import { useEffect, useState } from "react";
import type { WellbeingReport } from "../types";

interface ReportDisplayProps {
  report: WellbeingReport;
  onNext: () => void;
}

function ReportDisplay({ report, onNext }: ReportDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Animate score counting up
    const timer = setTimeout(() => {
      const increment = report.wellbeingScore / 50;
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= report.wellbeingScore) {
            clearInterval(interval);
            return report.wellbeingScore;
          }
          return Math.min(prev + increment, report.wellbeingScore);
        });
      }, 20);
    }, 500);

    return () => clearTimeout(timer);
  }, [report.wellbeingScore]);

  // const getScoreColor = (score: number) => {
  //   if (score >= 70) return "text-indigo-300";
  //   if (score >= 40) return "text-yellow-300";
  //   return "text-red-300";
  // };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-indigo-400 to-indigo-500";
    if (score >= 40) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  // const getScoreDescription = (score: number) => {
  //   if (score >= 70) return "Good wellbeing indicators";
  //   if (score >= 40) return "Moderate wellbeing with room for improvement";
  //   return "Areas of concern identified";
  // };

  const getRiskLevelDisplay = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return { emoji: "💚", text: "Low Risk", color: "text-green-300" };
      case "medium":
        return { emoji: "🟡", text: "Medium Risk", color: "text-yellow-300" };
      case "high":
        return { emoji: "🔴", text: "High Risk", color: "text-red-300" };
      default:
        return { emoji: "💚", text: "Low Risk", color: "text-green-300" };
    }
  };

  const riskDisplay = getRiskLevelDisplay(report.riskLevel);
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-indigo-300";
    if (score >= 40) return "text-yellow-300";
    return "text-red-300";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 70) return "Good wellbeing indicators";
    if (score >= 40) return "Moderate wellbeing with room for improvement";
    return "Areas of concern identified";
  };

  return (
    <div
      className={`max-w-2xl mx-auto text-white p-4 sm:p-6 transition-all duration-1000 stagger-children ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
      }`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text text-transparent stagger-item">
        Your Wellbeing Report
      </h1>

      {/* Wellbeing Score - Enhanced */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
        <h2 className="text-lg sm:text-xl mb-4 font-semibold">
          Wellbeing Score
        </h2>

        {/* Circular Progress Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-white/20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${getScoreColor(
                    report.wellbeingScore
                  )} transition-all duration-1000`}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${animatedScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-base sm:text-lg font-bold ${getScoreColor(
                    report.wellbeingScore
                  )}`}
                >
                  {Math.round(animatedScore)}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div
                className={`text-2xl sm:text-3xl font-bold mb-1 ${getScoreColor(
                  report.wellbeingScore
                )}`}
              >
                {Math.round(animatedScore)}/100
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm">
                {getScoreDescription(report.wellbeingScore)}
              </p>
            </div>
          </div>

          {/* Risk Level Indicator */}
          <div className="text-center">
            <div className="text-xl sm:text-2xl mb-1">{riskDisplay.emoji}</div>
            <div
              className={`text-xs sm:text-sm font-medium ${riskDisplay.color}`}
            >
              {riskDisplay.text}
            </div>
          </div>
        </div>

        {/* Enhanced Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${getScoreGradient(
              report.wellbeingScore
            )} h-3 rounded-full transition-all duration-1000 ease-out`}
            data-width={animatedScore}
            style={{ width: `${animatedScore}%` }}
          ></div>
        </div>
      </div>

      {/* Emotional State */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">😊</span>
          Emotional State
        </h2>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full"></div>
          <p className="text-indigo-100 text-lg capitalize">
            {report.emotionalState}
          </p>
        </div>
      </div>

      {/* Key Insights - Enhanced */}
      {report.keyInsights.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
          <h2 className="text-xl mb-4 font-semibold flex items-center">
            <span className="mr-2">💡</span>
            Key Insights
          </h2>
          <div className="space-y-4">
            {report.keyInsights.map((insight: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-indigo-100 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations - Enhanced */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">🌟</span>
          Recommendations
        </h2>
        <div className="space-y-4">
          {report.recommendations.map((recommendation: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 group"
              style={{
                animationDelay: `${(idx + report.keyInsights.length) * 200}ms`,
              }}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mr-3 mt-1 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xs">→</span>
              </div>
              <p className="text-indigo-100 leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Summary - Enhanced */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">📝</span>
          Session Summary
        </h2>
        <div className="bg-white/5 rounded-lg p-4 border-l-4 border-indigo-400">
          <p className="text-indigo-100 leading-relaxed italic">
            "{report.conversationSummary}"
          </p>
        </div>
      </div>

      {/* Enhanced Continue Button */}
      <div className="text-center stagger-item">
        <button
          onClick={onNext}
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full text-white font-semibold text-base sm:text-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300/50"
        >
          <span className="relative z-10 flex items-center justify-center">
            View Receipt & Share
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}

export default ReportDisplay;
