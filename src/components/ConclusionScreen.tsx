import type { WellbeingReport } from "../types";

interface ConclusionScreenProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  report: WellbeingReport;
}

function ConclusionScreen({ onNavigate, report }: ConclusionScreenProps) {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white/10 rounded-xl text-white shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
      <div className="mb-6">
        <p className="font-semibold">Summary:</p>
        <p className="mt-2">{report?.conversationSummary}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Key Insights:</p>
        <ul className="list-disc ml-6 mt-2">
          {report?.keyInsights?.map((insight: string, idx: number) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Recommendations & Next Steps:</p>
        <ul className="list-disc ml-6 mt-2">
          {report?.recommendations?.map(
            (recommendation: string, idx: number) => (
              <li key={idx}>{recommendation}</li>
            )
          )}
        </ul>
        <p className="mt-4">
          If you need more help, consider reaching out to a professional or
          trusted friend. Take care of yourself!
        </p>
      </div>
      <button
        className="mt-6 px-6 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
        onClick={() => onNavigate("welcome")}
      >
        Back to Home
      </button>
    </div>
  );
}

export default ConclusionScreen;
