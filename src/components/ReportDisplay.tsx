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
  //   if (score >= 70) return "text-emerald-300";
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
    if (score >= 70) return "text-emerald-300";
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent stagger-item">
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
              <p className="text-emerald-100 text-xs sm:text-sm">
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
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
          <p className="text-emerald-100 text-lg capitalize">
            {report.emotionalState}
          </p>
        </div>
      </div>

      {/* Mental Health Fingerprint */}
      {report.mentalHealthFingerprint && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
          <h2 className="text-xl mb-6 font-semibold flex items-center">
            <span className="mr-2">🧠</span>
            Mental Health Fingerprint
          </h2>

          {/* Communication Pattern */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-emerald-300 flex items-center">
              <span className="mr-2">💬</span>
              Communication Style
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-200">Response Length</span>
                  <span className="text-emerald-300 font-medium">
                    {(
                      report.mentalHealthFingerprint.communicationPattern
                        .responseLength * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        report.mentalHealthFingerprint.communicationPattern
                          .responseLength * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-200">Emotional Expression</span>
                  <span className="text-emerald-300 font-medium">
                    {(
                      report.mentalHealthFingerprint.communicationPattern
                        .emotionalExpressiveness * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        report.mentalHealthFingerprint.communicationPattern
                          .emotionalExpressiveness * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Thinking Pattern */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-emerald-300 flex items-center">
              <span className="mr-2">🤔</span>
              Thinking Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-emerald-200 mb-1">
                  Problem Solving
                </div>
                <div className="text-lg font-medium text-white capitalize">
                  {
                    report.mentalHealthFingerprint.thinkingPattern
                      .problemSolvingStyle
                  }
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-emerald-200 mb-1">
                  Decision Making
                </div>
                <div className="text-lg font-medium text-white capitalize">
                  {
                    report.mentalHealthFingerprint.thinkingPattern
                      .decisionMaking
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Signature */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3 text-emerald-300 flex items-center">
              <span className="mr-2">❤️</span>
              Emotional Signature
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😌</span>
                </div>
                <div className="text-sm text-emerald-200">Baseline Mood</div>
                <div className="text-lg font-medium text-white capitalize">
                  {
                    report.mentalHealthFingerprint.emotionalSignature
                      .baselineMood
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎭</span>
                </div>
                <div className="text-sm text-emerald-200">Emotional Range</div>
                <div className="text-lg font-medium text-white">
                  {(
                    report.mentalHealthFingerprint.emotionalSignature
                      .emotionalRange * 100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <div className="text-sm text-emerald-200">Resilience</div>
                <div className="text-lg font-medium text-white">
                  {(
                    report.mentalHealthFingerprint.emotionalSignature
                      .resilienceMarkers * 100
                  ).toFixed(0)}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-emerald-200">Analysis Confidence</span>
              <span className="text-emerald-300 font-medium">
                {(report.mentalHealthFingerprint.confidenceScore * 100).toFixed(
                  0
                )}
                %
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-emerald-400 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    report.mentalHealthFingerprint.confidenceScore * 100
                  }%`,
                }}
              ></div>
            </div>

            {/* Confidence guidance message */}
            {report.mentalHealthFingerprint.confidenceScore < 0.7 && (
              <div className="mt-3 p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                <div className="flex items-start">
                  <span className="text-emerald-300 mr-2 flex-shrink-0">
                    💡
                  </span>
                  <div className="text-sm text-emerald-200">
                    <strong>Tip:</strong> For more accurate insights, try having
                    a longer conversation (
                    {report.mentalHealthFingerprint.confidenceScore < 0.4
                      ? "15-20 more exchanges"
                      : "5-10 more exchanges"}
                    ) to help our AI better understand your unique patterns.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-emerald-100 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations - Enhanced */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">🌟</span>
          Personalized Action Plan
        </h2>
        <div className="space-y-5">
          {report.recommendations.map((recommendation: string, idx: number) => (
            <div
              key={idx}
              className="p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-100 leading-relaxed mb-3">
                      {recommendation}
                    </p>

                    {/* Action Steps */}
                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                      <h4 className="text-emerald-300 font-medium text-sm mb-2">
                        🎯 Action Steps:
                      </h4>
                      <ul className="text-xs text-emerald-200 space-y-1">
                        {idx === 0 && (
                          <>
                            <li>
                              • Set aside 5-10 minutes daily for mindful
                              reflection
                            </li>
                            <li>• Use the Stelar app for regular check-ins</li>
                            <li>• Track patterns in your mood and responses</li>
                          </>
                        )}
                        {idx === 1 && (
                          <>
                            <li>
                              • Practice one new communication technique this
                              week
                            </li>
                            <li>
                              • Ask for feedback from trusted friends or family
                            </li>
                            <li>
                              • Journal about your communication successes
                            </li>
                          </>
                        )}
                        {idx === 2 && (
                          <>
                            <li>• Identify one area for emotional growth</li>
                            <li>
                              • Practice emotional labeling throughout the day
                            </li>
                            <li>
                              • Consider mindfulness or emotional regulation
                              techniques
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Progress Tracking */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-emerald-300">
                        💡 <strong>Track Progress:</strong> Return in 1-2 weeks
                        to see how your fingerprint evolves
                      </div>
                      <button className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs hover:bg-emerald-500/30 transition-all duration-200">
                        Set Reminder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Guidance */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-400/20">
          <div className="flex items-start">
            <span className="text-emerald-300 mr-3 flex-shrink-0 text-lg">
              🧭
            </span>
            <div>
              <h4 className="text-emerald-300 font-medium mb-2">
                Your Growth Journey
              </h4>
              <p className="text-emerald-200 text-sm mb-3">
                Your Mental Health Fingerprint is unique to you right now. As
                you grow and change, your fingerprint will evolve too. Regular
                check-ins help track your progress and reveal new insights about
                your mental wellbeing patterns.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200">
                  Schedule Next Check-in
                </button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200">
                  Share Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Summary - Enhanced */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 hover:bg-white/15 transition-all duration-300 stagger-item">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">📝</span>
          Session Summary
        </h2>
        <div className="bg-white/5 rounded-lg p-4 border-l-4 border-emerald-400">
          <p className="text-emerald-100 leading-relaxed italic">
            "{report.conversationSummary}"
          </p>
        </div>
      </div>

      {/* Enhanced Continue Button */}
      <div className="text-center stagger-item">
        <button
          onClick={onNext}
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-semibold text-base sm:text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
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
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}

export default ReportDisplay;
