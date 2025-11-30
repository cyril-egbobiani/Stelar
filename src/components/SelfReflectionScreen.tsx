import React, { useState } from "react";
import TypewriterText from "./TypewriterText";

const prompts = [
  "What made you smile today?",
  "Describe a moment you felt proud recently.",
  "Is there something on your mind you'd like to let go of?",
  "What is one thing you are grateful for right now?",
];

const SelfReflectionScreen: React.FC<{
    onNavigate: (screen: string) => void;
}> = ({ onNavigate }) => {
    const [currentPrompt, setCurrentPrompt] = useState(0);
    const [responses, setResponses] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(false);

    const handleTypewriterComplete = () => {
        setShowInput(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setResponses([...responses, input]);
        setInput("");
        setShowInput(false);
        if (currentPrompt < prompts.length - 1) {
            setCurrentPrompt(currentPrompt + 1);
        } else {
            onNavigate("welcome"); // Or show a summary screen
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#18181B] to-[#121212] px-4 py-12 text-white">
            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-tight">
                    Before we start help us to<br />understand you better
                </h1>
                <div className="w-20 h-1 bg-white/10 rounded-full mb-8" />
                <div className="w-full flex flex-col gap-8">
                    <div className="rounded-xl px-6 py-7 bg-[#232326] border border-[#232326] shadow-lg flex flex-col items-center">
                        <div className="mb-6 text-lg text-center w-full">
                            <TypewriterText text={prompts[currentPrompt]} delay={22} onComplete={handleTypewriterComplete} />
                        </div>
                        {showInput && (
                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                                <textarea
                                    className="w-full h-24 p-4 rounded-xl bg-[#18181B] border border-[#292929] text-white mb-6 focus:outline-none focus:border-rose-500 transition text-base resize-none"
                                    placeholder="Type your response..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-white text-black font-semibold text-base shadow transition-all duration-200 hover:bg-rose-500 hover:text-white"
                                    style={{ letterSpacing: "0.01em" }}
                                >
                                    {currentPrompt < prompts.length - 1 ? "Next" : "Finish"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    }
export default SelfReflectionScreen;
