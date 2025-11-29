import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number; // ms per character
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text = "",
  delay = 0,
  onComplete,
}) => {
  const safeText = typeof text === "string" ? text : String(text ?? "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndex < safeText.length) {
      intervalRef.current = window.setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
      };
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, safeText, delay, onComplete]);

  const revealWindow = 10;

  return (
    <span className="relative inline-block">
      {safeText.split("").map((char, idx) => {
        if (idx >= currentIndex) return null;
        const animProgress = Math.min(1, (currentIndex - idx) / revealWindow);
        const ease = (t: number) => 1 - Math.pow(1 - t, 2.5);
        const eased = ease(animProgress);
        return (
          <span
            key={idx}
            className="inline-block"
            style={{
              opacity: 0.4 + 0.6 * eased,
              filter: `blur(${(1 - eased) * 1.2}px)`,
              transform: `scale(${0.98 + 0.02 * eased}) translateY(${
                (1 - eased) * 4
              }px)`,
              transition:
                "opacity 0.7s cubic-bezier(.4,.8,.2,1), filter 1.2s cubic-bezier(.4,.8,.2,1), transform 0.7s cubic-bezier(.4,.8,.2,1)",
              willChange: "opacity, filter, transform",
            }}
          >
            {char === " " ? (
              <span style={{ width: "0.4em", display: "inline-block" }} />
            ) : (
              char
            )}
          </span>
        );
      })}
      {currentIndex < safeText.length && (
        <span
          className="inline-block ml-0.5"
          style={{
            width: "0.7em",
            height: "1.2em",
            background: "linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%)",
            borderRadius: "2px",
            boxShadow: "0 0 4px 0 #e0e0e0",
            animation: "caretPulse 1.2s infinite cubic-bezier(.4,.8,.2,1)",
            verticalAlign: "middle",
          }}
        />
      )}
      <style>{`
        @keyframes caretPulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </span>
  );
};

export default TypewriterText;