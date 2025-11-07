import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../contexts/ThemeContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, handleToggleDarkMode, animating, iconRef, iconState } =
    useTheme();

  // Refs for animation targets
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial navbar animation
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
        y: -20,
      }
    );

    // Sophisticated entrance animation
    tl.to(navRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
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

  // Logo hover interaction
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseEnter = () => {
      gsap.to(logo.querySelector(".logo-icon"), {
        scale: 1.1,
        rotate: 5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo.querySelector(".logo-icon"), {
        scale: 1,
        rotate: 0,
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
          y: -20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        }
      );

      // Stagger animate menu items
      const menuItems = mobileMenuRef.current?.querySelectorAll("a, button");
      if (menuItems) {
        tl.fromTo(
          menuItems,
          {
            opacity: 0,
            y: -10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.1,
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
        y: -20,
        scale: 0.95,
        duration: 0.3,
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
      {/* Modern Navbar with sophisticated design */}
      <div className="fixed top-0 left-0 right-0 z-50 ">
        <nav
          ref={navRef}
          className={`max-w-7xl mx-auto transition-all duration-500 ease-out ${
            scrolled
              ? "bg-[#141414]/95 backdrop-blur-xl border border-b-[#282828] shadow-2xl shadow-black/20"
              : "bg-[#141414]/80 backdrop-blur-md border border-b-[#282828]/50"
          } `}
        >
          <div className="flex items-center justify-between px-6 lg:px-8 py-4">
            {/* Logo Section */}
            <div
              ref={logoRef}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="logo-icon relative">
                <div className="w-8 h-8 bg-transparent rounded-xl flex items-center justify-center ">
                 <img src="/StelarLogo.svg" alt="s" />
                </div>
              </div>
              <span className="font-semibold geist-mono text-[#E6E6E6] tracking-wide">
                STELAR
              </span>
            </div>

            {/* Desktop Navigation */}
            <div ref={linksRef} className="hidden lg:flex items-center gap-8">
              {/* Navigation Links */}
              <div className="flex items-center gap-8">
                <a
                  href="/features"
                  className="text-[#E6E6E6] hover:text-emerald-400 font-medium text-sm tracking-wide uppercase transition-all duration-300 relative group geist-mono"
                >
                  <span>Features</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="/insights"
                  className="text-[#E6E6E6] hover:text-emerald-400 font-medium text-sm tracking-wide uppercase transition-all duration-300 relative group geist-mono"
                >
                  <span>Insights</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="/help"
                  className="text-[#E6E6E6] hover:text-emerald-400 font-medium text-sm tracking-wide uppercase transition-all duration-300 relative group geist-mono"
                >
                  <span>Help</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                </a>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-4">
                {/* Theme Toggle Button */}
                <button
                  ref={themeButtonRef}
                  onClick={handleToggleDarkMode}
                  disabled={animating}
                  className="w-10 h-10 bg-[#292929] hover:bg-[#353535] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                  title="Toggle theme"
                >
                  <div ref={iconRef} className="w-5 h-5">
                    {iconState === "sun" ? (
                      <svg
                        className="w-5 h-5 text-[#E6E6E6]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-[#E6E6E6]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* CTA Button */}
                <button
                  type="button"
                  className="px-6 py-3 geist-mono rounded-4xl bg-emerald-400 hover:bg-emerald-500 text-black font-semibold text-sm tracking-wide uppercase  transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/20"
                >
                  Start Journey
                </button>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Theme Toggle */}
              <button
                onClick={handleToggleDarkMode}
                disabled={animating}
                className="w-9 h-9 bg-[#292929] hover:bg-[#353535] rounded-lg flex items-center justify-center transition-all duration-300"
                title="Toggle theme"
              >
                <div className="w-4 h-4">
                  {iconState === "sun" ? (
                    <svg
                      className="w-4 h-4 text-[#E6E6E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-[#E6E6E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                ref={hamburgerRef}
                type="button"
                className="w-9 h-9 bg-[#292929] hover:bg-[#353535] rounded-lg flex items-center justify-center transition-all duration-300"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <span
                    className={`block h-0.5 w-5 bg-[#E6E6E6] transition-all duration-300 ${
                      open ? "rotate-45 translate-y-0.5" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-[#E6E6E6] transition-all duration-300 my-1 ${
                      open ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-[#E6E6E6] transition-all duration-300 ${
                      open ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div className="fixed top-20 left-0 right-0 z-40 lg:hidden px-4">
        <div ref={mobileMenuRef} className="hidden">
          <div className="max-w-sm mx-auto bg-[#121212]/95 backdrop-blur-xl border border-[#292929] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
            <div className="p-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-4 mb-6">
                <a
                  href="/features"
                  className="block text-[#E6E6E6] hover:text-emerald-400 font-medium text-base tracking-wide uppercase py-3 px-4 rounded-xl hover:bg-[#292929]/50 transition-all duration-300 geist-mono"
                  onClick={() => setOpen(false)}
                >
                  Features
                </a>
                <a
                  href="/insights"
                  className="block text-[#E6E6E6] hover:text-emerald-400 font-medium text-base tracking-wide uppercase py-3 px-4 rounded-xl hover:bg-[#292929]/50 transition-all duration-300 geist-mono"
                  onClick={() => setOpen(false)}
                >
                  Insights
                </a>
                <a
                  href="/help"
                  className="block text-[#E6E6E6] hover:text-emerald-400 font-medium text-base tracking-wide uppercase py-3 px-4 rounded-xl hover:bg-[#292929]/50 transition-all duration-300 geist-mono"
                  onClick={() => setOpen(false)}
                >
                  Help
                </a>
              </div>

              {/* Mobile CTA */}
              <button
                type="button"
                className="w-full px-6 py-4 bg-emerald-400 hover:bg-emerald-500 text-black font-semibold text-base tracking-wide uppercase rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-400/20 geist-mono"
                onClick={() => setOpen(false)}
              >
                Start Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
