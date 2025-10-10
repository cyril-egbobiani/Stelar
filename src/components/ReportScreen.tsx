import { useEffect, useState } from "react";
import type { Message, Report } from "../types";

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
  const [summary, setSummary] = useState<string>("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [insights, setInsights] = useState<string>("");

  useEffect(() => {
    // Simulate AI analysis (replace with backend call if needed)
    const userMessages = conversationData
      .filter((msg) => msg.sender === "user")
      .map((msg) => msg.text)
      .join(" ");
    setSummary(`You mentioned: "${userMessages}"`);
    setReasons([
      "Stress from work or studies",
      "Lack of sleep or rest",
      "Personal or relationship challenges",
      "Environmental or financial factors",
    ]);
    setInsights(
      "Remember, it's normal to feel this way sometimes. Consider talking to someone you trust or taking a break."
    );
    setReport({ summary, reasons, insights });
  }, [conversationData, setReport, summary, reasons, insights]);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white/10 rounded-xl text-white shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-4">Based on your report</h2>
      <div className="mb-6">
        <p className="font-semibold">What you're going through:</p>
        <p className="mt-2">{summary}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Possible reasons:</p>
        <ul className="list-disc ml-6 mt-2">
          {reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Other insights:</p>
        <p className="mt-2">{insights}</p>
      </div>
      <button
        onClick={() => onNavigate("conclusion")}
        className="mt-6 px-6 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
      >
        Continue to Conclusion
      </button>
    </div>
  );
}

export default ReportScreen;
