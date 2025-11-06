import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useTheme } from "../contexts/ThemeContext";

gsap.registerPlugin(TextPlugin);

interface WelcomeScreenProps {
  onStartQuestionnaire: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartQuestionnaire,
}) => {
  const { isDarkMode } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial states for all animated elements to ensure they start invisible
    gsap.set(
      [
        ".hero-title",
        ".hero-subtitle",
        ".preview-indicator",
        ".feature-card",
        ".social-proof",
        ".cta-button",
        ".cta-subtitle",
      ],
      {
        opacity: 0,
        clearProps: "transform",
      }
    );

    // Initial page load animation with Dieter Rams simplicity + Jonathan Ive refinement
    const tl = gsap.timeline();

    tl.to(".hero-title", {
      duration: 1.2,
      y: 0,
      opacity: 1,
      ease: "power3.out",
    })
      .to(
        ".hero-subtitle",
        {
          duration: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .to(
        ".preview-indicator",
        {
          duration: 0.8,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        ".feature-card",
        {
          duration: 0.8,
          y: 0,
          opacity: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      )
      .to(
        ".social-proof",
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        ".cta-button",
        {
          duration: 1,
          scale: 1,
          opacity: 1,
          ease: "elastic.out(1, 0.3)",
        },
        "-=0.2"
      )
      .to(
        ".cta-subtitle",
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        },
        "-=0.8"
      );

    // Mouse position tracking for parallax (Apple-inspired spatial interactions)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLetsTalk = () => {
    // Sophisticated button animation (Material Design meaningful motion)
    gsap.to(".cta-button", {
      duration: 0.2,
      scale: 0.95,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(".cta-button", {
          duration: 0.3,
          scale: 1,
          ease: "back.out(1.7)",
        });
        onStartQuestionnaire();
      },
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-hidden ${
        isDarkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Initial styles to prevent FOUC */}
      <style>{`
        .hero-title, .hero-subtitle, .preview-indicator, .feature-card, .social-proof, .cta-button, .cta-subtitle {
          opacity: 0;
        }
      `}</style>
      {/* Subtle Background Elements - Dieter Rams Minimalism */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Single subtle accent - not overwhelming */}
        <div
          className="absolute top-20 right-20 w-72 h-72 bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${
              mousePosition.y * 0.5
            }px)`,
          }}
        />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-20"
          style={{
            transform: `translate(${-mousePosition.x * 0.3}px, ${
              -mousePosition.y * 0.3
            }px)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 pt-40">
        {/* Hero Section - Apple-inspired Typography Hierarchy */}
        <div ref={heroRef} className="text-center mb-20">
          <h1 className="hero-title text-6xl md:text-7xl font-light mb-6 text-gray-900 dark:text-white leading-tight tracking-tight">
            Mental Health
            <span className="block font-thin text-emerald-600 dark:text-emerald-400">
              Fingerprint
            </span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Discover your unique psychological patterns through intelligent
            conversation analysis
          </p>

          {/* Preview of what they'll get - Clean, minimal indicator */}
          <button
            onClick={handleLetsTalk}
            className="preview-indicator mt-12 inline-flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Get insights in ~10 minutes
            </span>
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Value Proposition Cards - Modern Minimalism */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="feature-card group">
            <div className="bg-white dark:bg-black custom-dotted-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg dark:hover:shadow-2xl feature-card-border">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Advanced algorithms analyze your conversation patterns to reveal
                unique insights about your mental health journey.
              </p>
            </div>
          </div>

          <div className="feature-card group">
            <div className="bg-white dark:bg-black custom-dotted-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg dark:hover:shadow-2xl feature-card-border">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
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
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Instant Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get immediate, personalized feedback that helps you understand
                your emotional patterns and mental wellness.
              </p>
            </div>
          </div>

          <div className="feature-card group">
            <div className="bg-white dark:bg-black custom-dotted-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg dark:hover:shadow-2xl feature-card-border">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Privacy First
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your conversations and insights remain completely private and
                secure with enterprise-grade encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof - Clean & Credible */}
        <div className="social-proof text-center mb-16">
          <div className="inline-flex items-center space-x-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Trusted by thousands
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              ⭐ 4.9/5 satisfaction rating
            </div>
          </div>
        </div>

        {/* Call to Action - Modern & Clear */}
        <div ref={ctaRef} className="text-center">
          <button
            onClick={handleLetsTalk}
            className="cta-button group relative px-16 py-5 text-xl font-semibold text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 mb-4"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span>Start Your Mental Health Journey</span>
              <svg
                className="w-5 h-5"
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
            </span>
          </button>
          <p className="cta-subtitle mt-4 text-sm text-gray-500 dark:text-gray-400">
            No signup required • Takes 5-10 minutes • Completely confidential
          </p>
        </div>
      </div>

      {/* Clean bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
    </div>
  );
};

export default WelcomeScreen;
