import { useEffect, useRef } from "react";
import gsap from "gsap";

function ReportGeneratingAnimation() {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial setup
    gsap.set([textRef.current, subtextRef.current], {
      opacity: 0,
      y: 20,
    });

    // Animation sequence
    tl.to([textRef.current, subtextRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out",
    });

    // Animated dots
    if (dotsRef.current) {
      gsap.to(dotsRef.current, {
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    // Spinner rotation
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 2,
        ease: "none",
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-8">
      {/* Animated Spinner */}
      <div className="relative mb-8">
        <div
          ref={spinnerRef}
          className="w-20 h-20 border-4 border-transparent border-t-indigo-300 border-r-indigo-400 rounded-full"
        ></div>
        <div
          className="absolute inset-2 border-2 border-transparent border-b-cyan-300 border-l-cyan-400 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "3s" }}
        ></div>
      </div>

      {/* Main Text */}
      <h2 ref={textRef} className="text-2xl mb-4 font-semibold text-center">
        Analyzing your conversation<span ref={dotsRef}>...</span>
      </h2>

      {/* Subtext */}
      <p
        ref={subtextRef}
        className="text-indigo-200 text-center max-w-md leading-relaxed"
      >
        Our AI is carefully reviewing your responses to provide personalized
        insights and recommendations for your wellbeing journey.
      </p>

      {/* Progress Steps */}
      <div className="mt-8 space-y-3 text-sm text-indigo-100">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-indigo-300 rounded-full mr-3 animate-pulse"></div>
          Processing conversation data
        </div>
        <div className="flex items-center">
          <div
            className="w-2 h-2 bg-indigo-300 rounded-full mr-3 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          Analyzing emotional patterns
        </div>
        <div className="flex items-center">
          <div
            className="w-2 h-2 bg-indigo-300 rounded-full mr-3 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          Generating personalized insights
        </div>
      </div>
    </div>
  );
}

export default ReportGeneratingAnimation;
