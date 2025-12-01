import React, { useEffect, useState } from "react";
// Removed shadcn/ui imports
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Footer from "./Footer";

gsap.registerPlugin(TextPlugin);

interface WelcomeScreenProps {
  onStartQuestionnaire: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartQuestionnaire,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial states for all animated elements
    gsap.set(
      [
        ".hero-badge",
        ".hero-title",
        ".hero-subtitle",
        ".stelar-folder",
        ".feature-card",
        ".testimonial-card",
        ".cta-button",
        ".cta-features",
      ],
      {
        opacity: 0,
        y: 40,
      }
    );

    // Sophisticated entrance animation inspired by the design
    const tl = gsap.timeline();

    tl.to(".hero-badge", {
      duration: 0.8,
      y: 0,
      opacity: 1,
      ease: "power3.out",
    })
      .to(
        ".hero-title",
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          ease: "power3.out",
        },
        "-=0.4"
      )
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
        ".stelar-folder",
        {
          duration: 1,
          y: 0,
          opacity: 1,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .to(
        ".feature-card",
        {
          duration: 0.8,
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        ".testimonial-card",
        {
          duration: 0.8,
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
          y: 0,
          opacity: 1,
          ease: "elastic.out(1, 0.3)",
        },
        "-=0.2"
      )
      .to(
        ".cta-features",
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        },
        "-=0.6"
      );

    // Mouse position tracking for subtle parallax
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-[#0E0E0E] to-[#121212] text-white overflow-hidden relative">
      {/* Background texture and atmosphere */}
      <div className="absolute inset-0">
        {/* Ambient background elements */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-500/5 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-rose-400/3 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x * 0.2}px, ${
              -mousePosition.y * 0.2
            }px)`,
          }}
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            {/* New Product Badge */}
            <div className=" inline-flex items-center gap-2 px-3 py-1 mb-6 bg-[#171717] border border-[#282828] rounded-full">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
              <span className="text-sm text-[#AAAAAA]   tracking-wide ">
                New
              </span>
              <span className="text-sm text-[#F2F2F2] ">
                AI Mental Health Analysis
              </span>
            </div>

            {/* Main Hero Title */}
            <h1 className="text-3xl md:text-5xl  mb-6 leadiing-14  tracking-tight">
              <span className="text-[#EEEEEE]">Understand Your Mind</span>
              <br />
              <span className="text-[#EEEEEE]">Through </span>
              <span className="bg-gradient-to-r from-rose-400 to-rose-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className=" text-lg text-[#AAAAAA] max-w-xl mx-auto leading-relaxed mb-6">
              AI-powered conversation analysis reveals your unique mental health
              patterns and provides personalized insights for better wellness.
            </p>
            {/* Call to Action Button */}
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 text-md font-medium text-rose-100 bg-rose-500 hover:bg-rose-600 rounded-2xl transition-all duration-300 hover:scale-105  mb-12"
            >
              <span className="flex items-center gap-3  ">
                <span>Start Your Journey</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 bg-amber-200 text-amber-600 rounded-full transition-transform"
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

            {/* Modal/Section for engagement options using shadcn/ui Dialog */}
            {/* Engagement options modal removed; navigation now handled by page */}
            {/* Stelar Folder Visual Element */}
            <div className="stelar-folder relative mx-auto mb-16 w-[400px] h-[280px]">
              {/* Folder Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#292929] to-[#323232] rounded-2xl border border-[#404040] shadow-2xl">
                {/* Folder Tab */}
                <div className="absolute -top-4 left-8 w-24 h-8 bg-gradient-to-b from-[#292929] to-[#323232] rounded-t-xl border-t border-l border-r border-[#404040]" />

                {/* Inner Content Area */}
                <div className="absolute inset-4 bg-[#1A1A1A] rounded-xl border border-[#353535] p-6">
                  {/* Floating Analysis Cards */}
                  <div className="relative h-full">
                    <div className="absolute top-2 left-4 w-20 h-12 bg-gradient-to-br from-rose-500/20 to-rose-600/10 rounded-lg border border-rose-500/20 transform rotate-3" />
                    <div className="absolute top-6 right-4 w-20 h-12 bg-gradient-to-br from-rose-500/20 to-rose-600/10 rounded-lg border border-rose-500/20 transform -rotate-2" />
                    <div className="absolute bottom-4 left-6 w-20 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/20 transform rotate-1" />

                    {/* Central AI Brain Icon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Shadow */}
              <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/20 rounded-full blur-lg" />
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* AI Analysis Feature */}
            <div className="feature-card group">
              <div className="bg-[#121212] border border-[#292929] rounded-2xl p-8 h-full hover:border-rose-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="text-md font-medium    uppercase mb-4 text-[#ECECED]">
                  Personalized AI Analysis
                </h3>
                <p className="text-[#737373] leading-relaxed">
                  Our advanced AI studies your conversation patterns, emotional
                  markers, and communication style to create your unique mental
                  health fingerprint.
                </p>
              </div>
            </div>

            {/* Real-time Insights */}
            <div className="feature-card group">
              <div className="bg-[#121212] border border-[#292929] rounded-2xl p-8 h-full hover:border-rose-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="text-md font-medium      uppercase  mb-4 text-[#ECECED]">
                  Real-time Insights
                </h3>
                <p className="text-[#737373] leading-relaxed">
                  Receive immediate feedback on your emotional state, stress
                  levels, and mental wellness indicators during natural
                  conversation.
                </p>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="feature-card group">
              <div className="bg-[#121212] border border-[#292929] rounded-2xl p-8 h-full hover:border-rose-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="text-md font-medium     mb-4    uppercase  text-[#ECECED]">
                  Complete Privacy
                </h3>
                <p className="text-[#737373] leading-relaxed">
                  Your conversations are encrypted and processed locally. We
                  never store personal data or share insights with third
                  parties.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof / Testimonial */}
          <div className="testimonial-card text-center mb-20">
            <div className="max-w-4xl mx-auto bg-[#0F0F0F] border border-[#282828] rounded-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full border-2 border-[#0F0F0F]" />
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full border-2 border-[#0F0F0F]" />
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-[#0F0F0F]" />
                </div>
                <span className="ml-4 text-[#737373] text-sm font-medium">
                  Trusted by mental health professionals
                </span>
              </div>
              <p className="text-lg text-[#ECECED] mb-4 italic">
                "Stelar provides insights that would take months of traditional
                therapy to uncover. The AI's ability to identify patterns in
                conversation is remarkable."
              </p>
              <p className="text-[#737373] text-sm">
                Dr. Sarah Chen, Clinical Psychologist
              </p>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="text-center">
            {/* Call to Action Button */}
           <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 text-md font-medium text-rose-100 bg-rose-500 hover:bg-rose-600 rounded-2xl transition-all duration-300 hover:scale-105 mb-12"
            >
              <span className="flex items-center gap-3  ">
                <span>Start Your Journey</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 bg-amber-200 text-amber-600 rounded-full transition-transform"
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
            {/* Responsive feature tiles without checkmark */}
            <div className="cta-features grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center text-sm text-[#F2F2F2] w-full max-w-2xl mx-auto">
              {/* Tile 1: Anonymous & Secure */}
              <div className="flex flex-col items-center bg-[#181818] border border-[#292929] rounded-xl px-5 py-4 w-full shadow-md hover:shadow-rose-400/10 transition-all">
                <div className="mb-2">
                  <svg
                    className="w-7 h-7 text-purple-400"
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
                <span className="text-center font-medium">
                  Completely anonymous & secure
                </span>
              </div>
              {/* Tile 2: No Signup Required */}
              <div className="flex flex-col items-center bg-[#181818] border border-[#292929] rounded-xl px-5 py-4 w-full shadow-md hover:shadow-rose-400/10 transition-all">
                <div className="mb-2">
                  <svg
                    className="w-7 h-7 text-cyan-400"
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
                </div>
                <span className="text-center font-medium">
                  No signup required
                </span>
              </div>
              {/* Tile 3: Fast Results */}
              <div className="flex flex-col items-center bg-[#181818] border border-[#292929] rounded-xl px-5 py-4 w-full shadow-md hover:shadow-rose-400/10 transition-all">
                <div className="mb-2">
                  <svg
                    className="w-7 h-7 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="text-center font-medium">
                  Results in {"<"} 10 minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
    </div>
  );
};

export default WelcomeScreen;
