import { useEffect } from "react";
import gsap from "gsap";

function Navbar() {
  // Initial navbar animation
  useEffect(() => {
    const navbar = document.querySelector(".navbar-container");
    const logo = document.querySelector(".navbar-logo");
    const ctaButton = document.querySelector(".navbar-cta");

    if (navbar && logo && ctaButton) {
      const tl = gsap.timeline();

      // Set initial states
      gsap.set([logo, ctaButton], {
        opacity: 0,
        y: -20,
      });

      // Sophisticated entrance animation
      tl.to(navbar, {
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          logo,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          ctaButton,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
    }
  }, []);

  // Logo hover animation
  useEffect(() => {
    const logo = document.querySelector(".navbar-logo");
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

  return (
    <>
      {/* Modern Navbar with sophisticated design */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="navbar-container max-w-7xl mx-auto bg-[#141414]/15 backdrop-blur-xl   ">
          <div className="flex items-center justify-between px-6 lg:px-8 py-4">
            {/* Logo Section */}
            <div className="navbar-logo flex items-center gap-3 cursor-pointer group">
              <div className="logo-icon relative">
                <div className="w-8 h-8 bg-transparent rounded-xl flex items-center justify-center">
                  <img src="/StelarLogo.svg" alt="s" />
                </div>
              </div>
              <span className="font-semibold geist-mono text-[#E6E6E6] tracking-wide">
                STELAR
              </span>
            </div>

             <div className="lg:flex items-center gap-8">
              {/* CTA Button */}
              <button
                type="button"
                className="navbar-cta px-6 py-3 border-2  rounded-xl bg-rose-600   border-rose-500 hover:bg-rose-600 text-rose-100 font-semibold text-sm tracking-wide   transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-400/20"
              >
                Start Journey
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
