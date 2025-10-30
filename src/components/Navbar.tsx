import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for animation targets
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Initial navbar animation
  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set([logoRef.current, linksRef.current, hamburgerRef.current], {
      opacity: 0,
      y: -20,
    });

    // Animate navbar entrance
    tl.to(navRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    })
      .to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.2)",
        },
        "-=0.3"
      )
      .to(
        linksRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        hamburgerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.2"
      );
  }, []);

  // Logo hover animation
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.05,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.5)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        rotation: 0,
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
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.4)",
        }
      );

      // Stagger animate menu items
      const menuItems = mobileMenuRef.current?.querySelectorAll("a");
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
            onComplete: () => setIsAnimating(false),
          },
          "-=0.2"
        );
      }
    } else if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.classList.contains("hidden")
    ) {
      setIsAnimating(true);
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.9,
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
  }, [open]);

  // Hamburger animation
  const toggleMenu = () => {
    if (isAnimating) return;

    // Animate hamburger icon
    gsap.to(hamburgerRef.current, {
      rotation: open ? 0 : 180,
      duration: 0.3,
      ease: "power2.out",
    });

    setOpen(!open);
  };

  return (
    <>
      {/* Navbar Container with Max Width and Centering */}
      <div className="relative top-0  left-0 right-0 z-50 flex justify-center ">
        <nav
          ref={navRef}
          className="relative w-full  bg-emerald-500 backdrop-blur-lg rounded shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all duration-300 overflow-hidden"
        >
          {/* Corner borders - Top Left */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-600 rounded-tl"></div>
          {/* Corner borders - Top Right */}
          <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-600 rounded-tr"></div>
          {/* Corner borders - Bottom Left */}
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-600 rounded-bl"></div>
          {/* Corner borders - Bottom Right */}
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-600 rounded-br"></div>

          <div className="flex items-center justify-between px-5 md:px-6 py-4 gap-2">
            {/* Logo Section */}
            <div
              ref={logoRef}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <img
                  src="/StelarLogo.svg"
                  alt="Stelar Logo"
                  className="h-7 w-7 md:h-8 md:w-8"
                />
                <div className="absolute inset-0 bg-emerald-400  rounded-full opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl md:text-2xl font-semibold  bg-clip-text text-white">
                Stelar
              </span>
            </div>

            {/* Desktop Navigation Links & CTA */}
            <div ref={linksRef} className="hidden md:flex items-center gap-8">
              {/* Navigation Links */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2"></div>
                <a
                  href="/features"
                  className="relative text-emerald-700 hover:text-emerald-900 font-medium text-sm transition-colors duration-200 group tracking-tight"
                >
                  Features
                </a>
                <a
                  href="/insights"
                  className="relative text-emerald-700 hover:text-emerald-900 font-medium text-sm transition-colors duration-200 group tracking-tight"
                >
                  Insights
                </a>
                <a
                  href="/help"
                  className="relative text-emerald-700 hover:text-emerald-900 font-medium text-sm transition-colors duration-200 group tracking-tight"
                >
                  Help
                </a>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="flex items-center justify-center px-5 py-2.5 gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-base rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/20 tracking-tight"
              >
                Start Journey
                <svg
                  className="w-5 h-5 ml-1"
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

            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerRef}
              type="button"
              className="md:hidden p-2 text-white hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle navigation"
              aria-expanded={open ? "true" : "false"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div className="relative left-0 right-0 z-50 md:hidden flex justify-center px-4">
        <div ref={mobileMenuRef} className="w-full   hidden">
          <div className="relative bg-emerald-500/20 backdrop-blur-lg rounded-2xl shadow-xl shadow-emerald-900/10 px-5 py-6 overflow-hidden">
            {/* Corner borders - Top Left */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-300/60 rounded-tl"></div>
            {/* Corner borders - Top Right */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-300/60 rounded-tr"></div>
            {/* Corner borders - Bottom Left */}
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-300/60 rounded-bl"></div>
            {/* Corner borders - Bottom Right */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-300/60 rounded-br"></div>
            <div className="flex flex-col items-center gap-4">
              <a
                href="/features"
                className="text-emerald-700 hover:text-emerald-900 font-medium  py-3 px-4 rounded-xl hover:bg-emerald-50/50 transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                Features
              </a>
              <a
                href="/insights"
                className="text-emerald-700 hover:text-emerald-900 font-medium py-3 px-4 rounded-xl hover:bg-emerald-50/50 transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                Insights
              </a>
              <a
                href="/help"
                className="text-emerald-700 hover:text-emerald-900 font-medium py-3 px-4 rounded-xl hover:bg-emerald-50/50 transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                Help
              </a>
              {/* Mobile CTA */}
              <button
                type="button"
                className="mt-2 flex items-center justify-center px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-xl transition-all duration-200"
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
