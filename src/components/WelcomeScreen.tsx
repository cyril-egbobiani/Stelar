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
  const processRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    const timeline = gsap.timeline();

    gsap.set(
      [
        titleRef.current,
        subtitleRef.current,
        buttonsContainerRef.current,
        processRef.current,
        benefitsRef.current,
        socialProofRef.current,
      ],
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
      "-=0.3"
    );

    // Stagger animate the new sections
    timeline.to(
      [processRef.current, benefitsRef.current, socialProofRef.current],
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.2,
        ease: "power4.out",
      },
      "-=0.3"
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
        [
          titleRef.current,
          subtitleRef.current,
          buttonsContainerRef.current,
          processRef.current,
          benefitsRef.current,
          socialProofRef.current,
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
    <div className="relative min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Bold headline following Patch System style */}
            <div className="mb-6">
              <h1
                ref={titleRef}
                className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-6"
              >
                THE EASIEST WAY TO{" "}
                <span className="text-emerald-600">UNLOCK YOUR POTENTIAL</span>
              </h1>
            </div>

            {/* Subtitle with value proposition */}
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto"
            >
              Transform your daily wellbeing through AI-powered conversations.
              Get personalized insights, build resilience, and achieve lasting
              growth in just{" "}
              <span className="font-semibold text-emerald-600">
                10 minutes per day
              </span>
              .
            </p>

            {/* Action buttons */}
            <div
              ref={buttonsContainerRef}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button
                ref={primaryButtonRef}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handleLetsTalk}
              >
                Start Your Journey 💪
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

              <button
                ref={secondaryButtonRef}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-105"
                onClick={() => onNavigate("about")}
              >
                See How It Works
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                100% Private & Secure
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9/5 Average Rating
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No Setup Required
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Process Section */}
      <div ref={processRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              THE STELAR SYSTEM
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven 3-step process transforms your wellbeing in just
              minutes per day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  01
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                SHARE YOUR THOUGHTS
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Have natural conversations with our AI about your daily
                experiences, challenges, and aspirations. No structured forms or
                complex setup.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  02
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                GET PERSONALIZED INSIGHTS
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes patterns in your conversations to identify
                strengths, growth opportunities, and personalized
                recommendations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  03
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                TRANSFORM YOUR WELLBEING
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Receive actionable strategies, track your progress, and watch as
                small daily improvements compound into lasting positive change.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div ref={benefitsRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              PROVEN RESULTS IN JUST{" "}
              <span className="text-emerald-600">10 MINUTES A DAY</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands who have transformed their wellbeing with Stelar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                85%
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Improved Self-Awareness
              </h3>
              <p className="text-gray-600">
                Users report better understanding of their emotions and thought
                patterns
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                92%
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Increased Resilience
              </h3>
              <p className="text-gray-600">
                Better ability to bounce back from challenges and stress
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                78%
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enhanced Life Satisfaction
              </h3>
              <p className="text-gray-600">
                Overall improvement in happiness and life fulfillment
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                90%
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Better Goal Achievement
              </h3>
              <p className="text-gray-600">
                More clarity and success in personal and professional goals
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                88%
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Improved Relationships
              </h3>
              <p className="text-gray-600">
                Better communication and deeper connections with others
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                10min
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Daily Time Investment
              </h3>
              <p className="text-gray-600">
                Average time needed to see meaningful progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div ref={socialProofRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              REAL PEOPLE. REAL RESULTS.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Stelar has transformed lives across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-semibold">SM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Stelar helped me understand my stress patterns and develop
                better coping strategies. I feel more confident and balanced
                than ever before."
              </p>
              <div className="flex text-yellow-400">★★★★★</div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-semibold">DJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">David J.</h4>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The insights from my conversations were eye-opening. Stelar
                guided me to make small changes that had a huge impact on my
                overall wellbeing."
              </p>
              <div className="flex text-yellow-400">★★★★★</div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-semibold">RL</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rachel L.</h4>
                  <p className="text-sm text-gray-600">Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I was skeptical at first, but Stelar's approach is so natural
                and insightful. It's like having a wise friend who really
                understands you."
              </p>
              <div className="flex text-yellow-400">★★★★★</div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <div className="bg-emerald-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to unlock your potential?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands who are already transforming their wellbeing with
                Stelar
              </p>
              <button
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={handleLetsTalk}
              >
                Start Your Journey Today 💪
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
