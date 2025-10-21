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

    if (subtitleRef.current) {
      const subtitleText =
        "Your personal welfare helper, designed to listen, understand, and support your wellbeing journey.";
      subtitleRef.current.textContent = subtitleText;

      timeline.fromTo(
        subtitleRef.current,
        { filter: "blur(8px)", opacity: 0, y: 0, scale: 1 },
        { filter: "blur(0px)", opacity: 1, duration: 1.2, ease: "power4.out" }
      );
    }

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
    <div className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden bg-gradient-to-b from-cyan-900 via-emerald-950 to-slate-950">
      {/* Main content */}
      <div className="no-scrollbar max-w-md text-center text-white relative z-20">
        <div className="mb-12">
          <h1
            ref={titleRef}
            className="text-4xl font-medium kavoon mb-4  bg-white bg-clip-text text-transparent font-sans leading-tight"
          >
            Welcome to Stelar
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg leading-relaxed geist  text-white/90 min-h-[4rem]"
          >
            {/* Text will be animated in via GSAP */}
          </p>
        </div>

        <div
          ref={buttonsContainerRef}
          className="flex gap-6 kavoon justify-center"
        >
          {/* Let's talk (primary/emerald) button */}
          <button
            ref={secondaryButtonRef}
            aria-label="Let's talk"
            className="relative h-12 px-6  rounded-full overflow-hidden group transition-all duration-300"
            onClick={handleLetsTalk}
          >
            {/* Gradient border */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 rounded-full p-[2px]"></div>
            {/* Button background */}
            <div className="absolute inset-[2px] bg-emerald-950 rounded-full group-hover:bg-emerald-900 transition-colors duration-300"></div>
            {/* Text */}
            <span className="relative z-10 text-lg  bg-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] tracking-tighter flex items-center justify-center h-full">
              Let's talk
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
