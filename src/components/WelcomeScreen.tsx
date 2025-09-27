import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

interface WelcomeScreenProps {
  onNavigate: (screen: "welcome" | "about" | "chat") => void;
}

function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Enable GSAP performance optimizations
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    const timeline = gsap.timeline();

    // Set initial states for smooth slide-up effect
    gsap.set(
      [
        imageRef.current,
        titleRef.current,
        subtitleRef.current,
        buttonsContainerRef.current,
      ],
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
        filter: "blur(4px)",
      }
    );

    timeline.fromTo(
      imageRef.current,
      {
        opacity: 0,
        filter: "blur(8px)",
        scale: 0.95,
        y: 0,
        duration: 0.8,
        ease: "power4.out",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.8,
        ease: "power4.out",
      }
    );

    // Title animation - ultra smooth slide up effect
    timeline.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power4.out",
    });

    // Subtitle animation - smooth slide up then typewriter
    if (subtitleRef.current) {
      const subtitleText =
        "Your personal welfare helper, designed to listen, understand, and support your wellbeing journey.";
      subtitleRef.current.textContent = subtitleText; // Set text directly

      timeline.fromTo(
        subtitleRef.current,
        { filter: "blur(8px)", opacity: 0, y: 0, scale: 1 },
        { filter: "blur(0px)", opacity: 1, duration: 1.2, ease: "power4.out" }
      );
    }

    // Buttons animation - ultra smooth entrance
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
    ); // Start while typewriter is still going

    // Setup button interactions
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
          scale: 0.97, // Within your 0.95-0.98 range
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

  const handleWhatAmI = () => {
    // Add exit animation before navigation
    gsap
      .timeline()
      .to(
        [
          imageRef.current,
          titleRef.current,
          subtitleRef.current,
          buttonsContainerRef.current,
        ],
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in",
          stagger: 0.02,
        }
      )
      .call(() => onNavigate("about"));
  };

  const handleLetsTalk = () => {
    // Add exit animation before navigation
    gsap
      .timeline()
      .to(
        [
          imageRef.current,
          titleRef.current,
          subtitleRef.current,
          buttonsContainerRef.current,
        ],
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
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-bl from-blue-200 via-blue-600 to-blue-500">
      <div className="max-w-md text-center text-white">
        <div className="flex justify-center mb-4 ">
          <img src="/StelarLogo.svg" alt="logo" className="" ref={imageRef} />
        </div>

        <div className="mb-12">
          <h1
            ref={titleRef}
            className="text-4xl font-medium mb-4 text-white font-sans leading-tight"
          >
            Welcome to Stelar
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg leading-relaxed font-sans min-h-[4rem]"
          >
            {/* Text will be animated in via GSAP */}
          </p>
        </div>

        <div
          ref={buttonsContainerRef}
          className="flex flex-col md:flex-row gap-4 justify-center px-9 md:px-0"
        >
          <button
            ref={primaryButtonRef}
            className="px-8 py-4 bg-white/10 text-white rounded-full text-lg font-semibold border-2 border-white/30 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 min-w-44 font-sans transition-colors duration-180"
            onClick={handleWhatAmI}
          >
            About me
          </button>

          <button
            ref={secondaryButtonRef}
            className="px-8 py-4 bg-white/95 text-blue-500 rounded-full text-lg font-semibold shadow-lg shadow-white/20 hover:bg-white hover:shadow-xl hover:shadow-white/30 min-w-44 font-sans transition-colors duration-180"
            onClick={handleLetsTalk}
          >
            Let's talk
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
