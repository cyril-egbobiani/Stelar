import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../contexts/ThemeContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    theme,
    isDarkMode,
    handleToggleDarkMode,
    animating,
    iconRef,
    iconState,
  } = useTheme();

  // Refs for animation targets
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  // Initial navbar animation - Jonathan Ive style entrance
  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set(
      [
        logoRef.current,
        linksRef.current,
        hamburgerRef.current,
        themeButtonRef.current,
      ],
      {
        opacity: 0,
        y: -10,
      }
    );

    // Clean, purposeful entrance animation
    tl.to(navRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    })
      .to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        linksRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        [hamburgerRef.current, themeButtonRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.5"
      );
  }, []);

  // Refined logo hover interaction
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    logo.addEventListener("mouseenter", handleMouseEnter);
    logo.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      logo.removeEventListener("mouseenter", handleMouseEnter);
      logo.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Handle window resize to reset mobile menu state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
        setIsAnimating(false);
        if (mobileMenuRef.current) {
          mobileMenuRef.current.classList.add("hidden");
          mobileMenuRef.current.classList.remove("flex");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (open) {
      setIsAnimating(true);
      if (mobileMenuRef.current) {
        mobileMenuRef.current.classList.remove("hidden");
        mobileMenuRef.current.classList.add("flex");
      }

      const tl = gsap.timeline();
      tl.fromTo(
        mobileMenuRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );

      // Stagger animate menu items
      const menuItems = mobileMenuRef.current?.querySelectorAll("a, button");
      if (menuItems) {
        tl.fromTo(
          menuItems,
          {
            opacity: 0,
            y: -5,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }

      tl.call(() => setIsAnimating(false));
    } else if (mobileMenuRef.current && !isAnimating) {
      setIsAnimating(true);
      const tl = gsap.timeline();
      tl.to(mobileMenuRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.98,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (mobileMenuRef.current) {
            mobileMenuRef.current.classList.add("hidden");
            mobileMenuRef.current.classList.remove("flex");
          }
          setIsAnimating(false);
        },
      });
    }
  }, [open, isAnimating]);

  const toggleMobileMenu = () => {
    if (!isAnimating) {
      setOpen(!open);
    }
  };

  return (
    <>
      {/* Clean, minimal navbar - Jonathan Ive inspired */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          ref={navRef}
          className={`w-full max-w-7xl backdrop-blur-xl border rounded-2xl shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-950/80 border-gray-800/50 shadow-gray-900/20"
              : "bg-white/80 border-gray-200/50 shadow-gray-900/5"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo Section - Clean & Purposeful */}
            <div
              ref={logoRef}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <img
                  src="/StelarLogo.svg"
                  alt="Stelar Logo"
                  className="h-8 w-8"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Stelar
              </span>
            </div>

            {/* Desktop Navigation - Minimal & Clear */}
            <div ref={linksRef} className="hidden md:flex items-center gap-8">
              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <a
                  href="/features"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  Features
                </a>
                <a
                  href="/insights"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  Insights
                </a>
                <a
                  href="/help"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  Help
                </a>
              </div>

              {/* Theme Toggle Button */}
              <button
                ref={themeButtonRef}
                onClick={handleToggleDarkMode}
                disabled={animating}
                className={`p-2 rounded-full font-semibold ${
                  isDarkMode
                    ? "text-white hover:bg-gray-800 transition duration-180 ease-in"
                    : "text-black hover:bg-gray-200 transition duration-180 ease-in"
                } transition`}
                title={`Current theme: ${theme}`}
              >
                <div ref={iconRef}>
                  {iconState === "sun" ? (
                    <img width={24} src="/Sun.svg" alt="Light mode" />
                  ) : (
                    <img width={24} src="/Solar.svg" alt="Dark mode" />
                  )}
                </div>
              </button>

              {/* CTA Button - Single accent color */}
              <button
                type="button"
                className="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium text-sm rounded-full transition-all duration-200 hover:shadow-lg"
              >
                Start Journey
              </button>
            </div>

            {/* Mobile Controls - Theme Toggle & Menu */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={handleToggleDarkMode}
                disabled={animating}
                className={`p-2 rounded-full font-semibold ${
                  isDarkMode
                    ? "text-white hover:bg-gray-800 transition duration-180 ease-in"
                    : "text-black hover:bg-gray-200 transition duration-180 ease-in"
                } transition`}
                title={`Current theme: ${theme}`}
              >
                <div>
                  {iconState === "sun" ? (
                    <img width={20} src="/Sun.svg" alt="Light mode" />
                  ) : (
                    <img width={20} src="/Solar.svg" alt="Dark mode" />
                  )}
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                ref={hamburgerRef}
                type="button"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-200 ${
                    open ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {open ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Clean overlay */}
      <div className="fixed top-20 left-0 right-0 z-40 md:hidden flex justify-center px-4">
        <div ref={mobileMenuRef} className="w-full max-w-sm hidden">
          <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-lg shadow-gray-900/10 dark:shadow-gray-900/30 px-6 py-6">
            <div className="flex flex-col gap-4">
              <a
                href="/features"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-center"
                onClick={() => setOpen(false)}
              >
                Features
              </a>
              <a
                href="/insights"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-center"
                onClick={() => setOpen(false)}
              >
                Insights
              </a>
              <a
                href="/help"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-center"
                onClick={() => setOpen(false)}
              >
                Help
              </a>
              {/* Mobile CTA */}
              <button
                type="button"
                className="mt-2 px-6 py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium rounded-xl transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                Start Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
