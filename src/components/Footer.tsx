import React, { useEffect } from "react";
import { gsap } from "gsap";

const Footer: React.FC = () => {
  useEffect(() => {
    // Initial animation for footer elements
    gsap.set([".footer-container", ".footer-content"], {
      opacity: 0,
      y: 30,
    });

    const tl = gsap.timeline();
    tl.to(".footer-container", {
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: "power3.out",
    }).to(
      ".footer-content",
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        stagger: 0.1,
      },
      "-=0.4"
    );
  }, []);

  return (
    <footer className="footer-container relative bg-gradient-to-t from-[#0A0A0A] to-[#121212] border-t border-[#292929]/50">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="footer-content col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-transparent rounded-xl flex items-center justify-center">
                <img src="/StelarLogo.svg" alt="Stelar" className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold geist-mono text-[#E6E6E6] tracking-wide">
                STELAR
              </span>
            </div>
            <p className="text-[#B8B8B8] leading-relaxed mb-6 max-w-md">
              AI-powered mental health analysis that transforms your
              conversations into personalized insights and actionable wellbeing
              reports.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm geist-mono">Available 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-content">
            <h3 className="text-[#E6E6E6] font-semibold geist-mono tracking-wide text-sm uppercase mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#how-it-works"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-content">
            <h3 className="text-[#E6E6E6] font-semibold geist-mono tracking-wide text-sm uppercase mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#help"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#crisis"
                  className="text-[#B8B8B8] hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Crisis Resources
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-content border-t border-[#292929]/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#787878] text-sm">
              © 2025 Stelar. All rights reserved.
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#292929] rounded-lg">
                <svg
                  className="w-4 h-4 text-emerald-400"
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
                <span className="text-xs text-[#B8B8B8] geist-mono">
                  End-to-End Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"></div>
    </footer>
  );
};

export default Footer;
