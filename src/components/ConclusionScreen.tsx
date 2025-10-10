 import type { Report } from "../types";

interface ConclusionScreenProps {
  onNavigate: (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => void;
  report: Report;
}

function ConclusionScreen({ onNavigate, report }: ConclusionScreenProps) {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white/10 rounded-xl text-white shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
      <div className="mb-6">
        <p className="font-semibold">Summary:</p>
        <p className="mt-2">{report?.summary}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Possible reasons:</p>
        <ul className="list-disc ml-6 mt-2">
          {report?.reasons?.map((reason: string, idx: number) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Insights & Next Steps:</p>
        <p className="mt-2">{report?.insights}</p>
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
