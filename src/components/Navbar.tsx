import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

function Navbar() {
  const [open, setOpen] = useState(false);

  // Refs for animation targets
  const logoRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
      .fromTo(
        brandRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        hamburgerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .fromTo(
        linksRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  // Animate mobile nav links when menu opens
 useEffect(() => {
  if (open && linksRef.current) {
    gsap.fromTo(
      linksRef.current.children,
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: "power2.out",
        stagger: 0.19,
      }
    );
  }
}, [open]);

  return (
    <nav className="fixed my-4 left-1/2 transform -translate-x-1/2  w-fit z-50 bg-white/10 backdrop-blur-md px-4 rounded-sm border-1 border-white/20 py-3 flex gap-10 md:px-8 items-center justify-between">
      {/* Logo/Brand */}
      <div ref={logoRef} className="flex items-center gap-2">
        <img src="/StelarLogo.svg" alt="Stelar Logo" className="h-8 w-8" />
        <span ref={brandRef} className="text-xl text-white">
          Stelar
        </span>
      </div>
      {/* Hamburger Icon (mobile) */}
      <button
        ref={hamburgerRef}
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
        className={`gap-8 md:flex  md:items-center rounded-sm ${
          open
            ? "flex flex-col absolute top-full left-0 w-full bg-black/95 backdrop-blur-md p-6"
            : "hidden"
        }`}
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
        <a
          href="/chat"
          className="text-white hover:text-emerald-300 transition py-2"
        >
          Chat
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
