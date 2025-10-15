import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

function Navbar() {
  const [open, setOpen] = useState(false);

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
    ).fromTo(
      linksRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );
  }, []);

  // Spring animation for mobile nav links when menu opens
  useEffect(() => {
    if (linksRef.current) {
      if (open) {
        // Show the element first, then animate in
        gsap.set(linksRef.current, { display: "flex" });
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
          }
        );
      } else {
        // Animate out, then hide
        gsap.to(linksRef.current, {
          opacity: 0,
          scale: 0.6,
          y: -40,
          duration: 0.2,
          ease: "back.in(1.7)",
          onComplete: () => {
            gsap.set(linksRef.current, { display: "none" });
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
        {/* <span ref={brandRef} className="text-xl kavoon text-white">
          Stelar
        </span> */}
      </div>

      {/* Divider - only visible on mobile */}
      <div className=" h-6 w-px bg-white/30"></div>

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
        className={`gap-4 md:gap-8 mt-3 md:mt-0 md:flex  kavoon md:items-center rounded-3xl flex-col items-center absolute top-full left-0 w-full bg-emerald-950 border-3 shadow-sm shadow-emerald-700 border-emerald-500 backdrop-blur-md p-6`}
        style={{ display: "none" }} // Initially hidden
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
