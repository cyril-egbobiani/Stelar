import type { WellbeingReport } from "../utils/conversationAnalysis";

interface ReportDisplayProps {
  report: WellbeingReport;
  onNext: () => void;
}

function ReportDisplay({ report, onNext }: ReportDisplayProps) {
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
    <div className="max-w-2xl mx-auto text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
        Your Wellbeing Report
      </h1>

      {/* Wellbeing Score */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
        <h2 className="text-xl mb-4 font-semibold">Wellbeing Score</h2>
        <div
          className={`text-4xl font-bold mb-2 ${getScoreColor(
            report.wellbeingScore
          )}`}
        >
          {report.wellbeingScore}/100
        </div>
        <p className="text-emerald-100 text-sm">
          {getScoreDescription(report.wellbeingScore)}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${report.wellbeingScore}%` }}
          ></div>
        </div>
      </div>

      {/* Key Insights */}
      {report.keyInsights.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl mb-4 font-semibold flex items-center">
            <span className="mr-2">💡</span>
            Key Insights
          </h2>
          <div className="space-y-3">
            {report.keyInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-emerald-300 mr-3 mt-1">•</span>
                <p className="text-emerald-100">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">🌟</span>
          Recommendations
        </h2>
        <div className="space-y-3">
          {report.recommendations.map((recommendation, idx) => (
            <div key={idx} className="flex items-start">
              <span className="text-cyan-300 mr-3 mt-1">→</span>
              <p className="text-emerald-100">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Summary */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
        <h2 className="text-xl mb-4 font-semibold flex items-center">
          <span className="mr-2">📝</span>
          Session Summary
        </h2>
        <p className="text-emerald-100 leading-relaxed">
          {report.conversationSummary}
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-white font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Continue to Summary
      </button>
    </div>
  );
}

export default ReportDisplay;
