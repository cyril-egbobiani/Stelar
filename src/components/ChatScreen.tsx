import { useRef, useState } from "react";
// import gsap from "gsap";

interface ChatScreenProps {
  onNavigate: (screen: "welcome" | "about" | "chat") => void;
}

type Message = {
  text: string;
  sender: "user" | "stelar";
};

function ChatScreen({ onNavigate }: ChatScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Array of greeting variants
  const greetings = [
    "Hey there! 😊 What's on your mind today?",
    "Hi! How's your day going so far?",
    "Hello! I'm here if you want to talk about anything.",
    "Hey! Is there something you'd like to share?",
    "Hiya! How are you feeling right now?",
    "Hey friend! Need to chat or just hang out?",
    "Hi! I'm all ears—what's up?",
  ];

  // Pick a random greeting on mount
  const [messages, setMessages] = useState<Message[]>([
    {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      sender: "stelar",
    },
  ]);
  const [input, setInput] = useState("");

  //   useEffect(() => {
  //     if (containerRef.current) {
  //       gsap.fromTo(
  //         containerRef.current,
  //         { opacity: 0, y: 40, scale: 0.98 },
  //         { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
  //       );
  //     }
  //   }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate bot reply (for demo)
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { text: "I'm here to support you!", sender: "stelar" },
        ]);
      }, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center bg-gray-50"
    >
      <div className=" p-2 h-fit w-full flex justify-end">
        <button
          className="text-black/70  border-black/20 px-4  py-2 rounded-full hover:bg-gray-100 hover:text-black transition duration-180 ease-in"
          onClick={() => onNavigate("welcome")}
        >
          Back
        </button>
      </div>

      <div className="bg-white mx-4 rounded-3xl rounded-b-none  flex-1 border-gray-100 border-1 h-full w-full md:max-w-5xl flex flex-col shadow-sm  overflow-hidden">
        <div className="py-4 px-6 bg-white/10 flex items-center justify-end "></div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow
                ${
                  msg.sender === "user"
                    ? "bg-white/80  text-blue-700 rounded-bl-none"
                    : " bg-gradient-to-t from-blue-500 to-blue-400 text-white rounded"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {/* Input Bar */}
        <div className="px-4 py-3 bg-white/20 flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-full bg-white/80 text-blue-700 font-medium focus:outline-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
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
