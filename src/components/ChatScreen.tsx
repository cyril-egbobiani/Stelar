import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface ChatScreenProps {
  onNavigate: (screen: "welcome" | "about" | "chat") => void;
}

type Message = {
  text: string;
  sender: "user" | "stelar";
};

function ChatScreen({ onNavigate }: ChatScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const [iconState, setIconState] = useState(darkMode ? "sun" : "moon");

  const greetings = [
    "Hey there! 😊 What's on your mind today?",
    "Hi! How's your day going so far?",
    "Hello! I'm here if you want to talk about anything.",
    "Hey! Is there something you'd like to share?",
    "Hi! How are you feeling right now?",
    "Hey friend! Need to chat or just hang out?",
    "Hi! I'm all ears, what's up?",
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      sender: "stelar",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { text: "I'm here to support you!", sender: "stelar" },
        ]);
      }, 1000);
    }
  };

  const handleToggleDarkMode = () => {
    if (animating) return;
    setAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimating(false);
      },
    });

    // Scale down and blur out
    tl.to(iconRef.current, {
      scale: 0.7,
      filter: "blur(8px)",
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setDarkMode((prev) => !prev);
        setIconState((prev) => (prev === "sun" ? "moon" : "sun"));
      },
    });

    // Scale up and blur in
    tl.to(iconRef.current, {
      scale: 1,
      filter: "blur(0px)",
      duration: 0.18,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col items-center ${
        darkMode ? "bg-black" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center p-2 h-fit">
        <button
          className={` border-black/20 px-4 py-2 rounded-full ${
            darkMode
              ? "text-white hover:bg-gray-800"
              : "text-black hover hover:bg-gray-200"
          }`}
          onClick={() => onNavigate("welcome")}
        >
          Back
        </button>
        <button
          className={`p-2 rounded-full font-semibold ${
            darkMode
              ? "text-white hover:bg-gray-800 transition duration-180 ease-in"
              : "text-black hover:bg-gray-200 transition duration-180 ease-in"
          } transition`}
          onClick={handleToggleDarkMode}
          disabled={animating}
        >
          <div ref={iconRef}>
            {iconState === "sun" ? (
              <img width={24} src="/Sun.svg" alt="Light mode" />
            ) : (
              <img width={24} src="/Solar.svg" alt="Dark mode" />
            )}
          </div>
        </button>
      </div>
      {/* Chat area: fixed height, flex column */}
      <div
        className={`flex  flex-col rounded-3xl rounded-b-none border-gray-200 border-1 w-full md:max-w-5xl shadow-sm overflow-hidden ${
          darkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-100"
        }`}
        style={{ height: "calc(100vh - 56px)", position: "relative" }} // 56px = header height
      >
        {/* Messages: only this div scrolls */}
        <div
          className="no-scroll flex-1 overflow-y-auto px-4 py-6 space-y-3 pb-24 messages-scroll"
          id="messages-container"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`w-fit max-w-[60%] break-words px-4 py-2 rounded-2xl ${
                  msg.sender === "user"
                    ? darkMode
                      ? "bg-gray-900 text-white rounded"
                      : "bg-gray-100 text-black rounded"
                    : darkMode
                    ? "bg-gradient-to-t from-blue-600 to-blue-500 text-white rounded"
                    : "bg-gradient-to-t from-blue-600 to-blue-500 text-white rounded"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Bar: always at bottom of chat area */}
        <div
          className={`px-4 py-3 flex items-center gap-2 w-full backdrop-blur-md ${
            darkMode ? "bg-black/60" : "bg-white/40"
          }`}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <input
            className={`flex-1 px-4 py-2 rounded-full font-medium focus:outline-none ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
            }`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className={`px-6 py-2 rounded-full font-semibold transition ${"bg-blue-500 text-white hover:bg-blue-600"}`}
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
