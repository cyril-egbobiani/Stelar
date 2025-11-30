import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number; // ms per character
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text = "",
  delay = 9, // Fast default speed (ms per char)
  onComplete,
}) => {
  const safeText = typeof text === "string" ? text : String(text ?? "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    function step(now: number) {
      if (cancelled) return;
      if (currentIndex < safeText.length) {
        if (!lastTimeRef.current) lastTimeRef.current = now;
        if (now - lastTimeRef.current >= delay) {
          setCurrentIndex((prev) => prev + 1);
          lastTimeRef.current = now;
        }
        rafRef.current = requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [currentIndex, safeText, delay, onComplete]);

  return (
    <span className="relative inline-block">
      {safeText.split("").map((char, idx) => {
        if (idx >= currentIndex) return null;
        return (
          <span
            key={idx}
            className="inline-block"
            style={{
              opacity: 1,
              filter: "none",
              transform: "none",
              transition: "none",
              willChange: "auto",
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
