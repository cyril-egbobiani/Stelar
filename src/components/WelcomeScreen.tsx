import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

interface WelcomeScreenProps {
  onNavigate: (screen: "welcome" | "about" | "chat") => void;
}

function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    const timeline = gsap.timeline();

    gsap.set(
      [titleRef.current, subtitleRef.current, buttonsContainerRef.current],
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
        filter: "blur(4px)",
      }
    );

    timeline.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power4.out",
    });

    timeline.to(
      subtitleRef.current,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power4.out",
      },
      "-=0.4"
    );

    timeline.to(
      buttonsContainerRef.current,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power4.out",
      },
      "-=1.0"
    );

    const setupButtonHover = (
      buttonRef: React.RefObject<HTMLButtonElement | null>
    ) => {
      const button = buttonRef.current;
      if (!button) return;

      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.02,
          duration: 0.15,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      };

      const handleMouseDown = () => {
        gsap.to(button, {
          scale: 0.97,
          duration: 0.08,
          ease: "power2.out",
        });
      };

      const handleMouseUp = () => {
        gsap.to(button, {
          scale: 1.02,
          duration: 0.08,
          ease: "power2.out",
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
      button.addEventListener("mousedown", handleMouseDown);
      button.addEventListener("mouseup", handleMouseUp);

      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
        button.removeEventListener("mousedown", handleMouseDown);
        button.removeEventListener("mouseup", handleMouseUp);
      };
    };

    const primaryCleanup = setupButtonHover(primaryButtonRef);
    const secondaryCleanup = setupButtonHover(secondaryButtonRef);

    return () => {
      primaryCleanup?.();
      secondaryCleanup?.();
      timeline.kill();
    };
  }, []);

  const handleLetsTalk = () => {
    gsap
      .timeline()
      .to(
        [titleRef.current, subtitleRef.current, buttonsContainerRef.current],
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in",
          stagger: 0.02,
        }
      )
      .call(() => onNavigate("chat"));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Hero section */}
      <div className="flex flex-col items-center padding px-8 md:px-48 py-32 gap-16 w-full max-w-7xl relative">
        {/* Container */}
        <div className="flex flex-col  items-center gap-6 w-full max-w-2xl">
            

          {/* Heading */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl mt-4 text-center  font-medium text-black leading-tight tracking-tight"
          >
            Unlock your potential 💪 with AI-powered wellbeing insights
          </h1>

          {/* Buttons */}
          <div
            ref={buttonsContainerRef}
            className="flex flex-row items-center gap-2"
          >
            <button
              ref={primaryButtonRef}
              className="flex flex-row justify-center items-center px-5 py-2.5 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              onClick={handleLetsTalk}
            >
              <span className="text-base font-medium text-white tracking-tight">
                Begin Journey
              </span>
            </button>

            <button
              ref={secondaryButtonRef}
              className="flex flex-row justify-center items-center px-5 py-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => onNavigate("about")}
            >
              <span className="text-base font-medium text-gray-900 tracking-tight">
                Discover More
              </span>
            </button>
          </div>

          {/* Value Props */}
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-gray-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-center font-normal text-gray-600 tracking-tight">
                100% private & secure
              </span>
            </div>

            <div className="flex flex-row items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-gray-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-center font-normal text-gray-600 tracking-tight">
                Personal growth focused
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg text-center  leading-relaxed text-gray-600 max-w-xl"
          >
            Discover your strengths, build resilience, and optimize your daily 
            wellbeing through personalized AI conversations. Unlock insights that 
            help you thrive, not just survive.
          </p>
        </div>

        {/* Image placeholder */}
        {/* <div className="w-full h-96 md:h-[500px] bg-gray-100 rounded-3xl flex items-center justify-center mt-8">
          <div className="flex items-center gap-4 text-gray-400">
            <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-14 bg-gray-200 rounded-lg"></div>
            <div className="w-14 h-14 bg-gray-200 rounded"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default WelcomeScreen;
