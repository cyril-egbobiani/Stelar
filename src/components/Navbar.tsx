import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for animation targets
  const brandRef = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      brandRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  // Spring animation for mobile nav links when menu opens
  useEffect(() => {
    // Only animate on mobile
    if (linksRef.current && window.innerWidth < 768) {
      if (open) {
        setIsAnimating(true);
        gsap.set(linksRef.current, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "100%",
          left: "0",
          width: "100%",
        });
        gsap.fromTo(
          linksRef.current,
          {
            opacity: 0,
            scale: 0.8,
            y: -20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
            onComplete: () => setIsAnimating(false),
          }
        );
      } else {
        setIsAnimating(true);
        gsap.to(linksRef.current, {
          opacity: 0,
          scale: 0.6,
          y: -40,
          duration: 0.2,
          ease: "back.in(1.7)",
          onComplete: () => {
            gsap.set(linksRef.current, { display: "none" });
            setIsAnimating(false);
          },
        });
      }
    }
  }, [open]);

  return (
    <nav className="fixed my-4 left-1/2 transform -translate-x-1/2 w-fit z-50 bg-white/10 backdrop-blur-md px-4 rounded-full border-1 border-white/20 py-3 flex gap-10 md:px-8 items-center justify-between">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2">
        <img src="/StelarLogo.svg" alt="Stelar Logo" className="h-8 w-8" />
      </div>

      {/* Divider - only visible on mobile */}
      <div className="md:hidden h-6 w-px bg-white/30"></div>

      {/* Hamburger Icon (mobile) */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={open ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
          />
        </svg>
      </button>

      {/* Navigation Links */}
      <div
        ref={linksRef}
        className={`gap-4 md:gap-8 mt-2 md:mt-0 text-lg kavoon md:items-center px-6 rounded-3xl bg-emerald-950 border-3  shadow-emerald-700 border-emerald-500 backdrop-blur-md p-6 ${
          !isAnimating && !open ? "hidden" : ""
        } md:flex md:static md:w-auto  md:border-0 md:shadow-none md:p-0 md:flex-row md:bg-none`}
      >
        <a
          href="/"
          className="text-white hover:text-emerald-300 transition py-2"
        >
          Home
        </a>
        <a
          href="/about"
          className="text-white hover:text-emerald-300 transition py-2"
        >
          About
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
