import { useState } from "react";

interface QuestionFlowProps {
  questions: string[];
  onComplete: (answers: string[]) => void;
}

function QuestionFlow({ questions, onComplete }: QuestionFlowProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );

  const handleAnswer = (answer: string) => {
    const updated = [...answers];
    updated[current] = answer;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete(answers);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-blue-200 via-blue-600 to-blue-500 p-8">
      <h2 className="text-2xl text-white mb-6">{questions[current]}</h2>
      <input
        className="px-4 py-2 rounded-lg bg-white/80 text-emerald-700 font-medium focus:outline-none mb-4"
        type="text"
        value={answers[current]}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder="Your answer..."
      />
      <button
        className="px-6 py-2 rounded bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
        onClick={handleNext}
      >
        {current < questions.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
}

const dummyQuestions = [
  "What's your name?",
  "How are you feeling today?",
  "What made you smile recently?",
  "Is there something on your mind?",
  "How do you usually relax?",
  "What's one thing you'd like to improve?",
  "Any goals for this week?",
];

// Example usage (replace with your navigation logic as needed)
function App() {
  const handleComplete = (answers: string[]) => {
    console.log("User answers:", answers);
    // You can navigate to another page or show a summary here
  };

  return (
    <QuestionFlow questions={dummyQuestions} onComplete={handleComplete} />
  );
}

export default App;
