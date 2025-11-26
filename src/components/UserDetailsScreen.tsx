import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface UserDetailsScreenProps {
  onSubmit: (name: string) => void;
  onBack: () => void;
}

function UserDetailsScreen({ onSubmit, onBack }: UserDetailsScreenProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    if (containerRef.current && formRef.current) {
      const tl = gsap.timeline();

      gsap.set(formRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.95,
      });

      tl.to(formRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;

    setIsSubmitting(true);

    // Store name in localStorage for persistence
    localStorage.setItem("stelar_user_name", name.trim());

    // Add a small delay for better UX
    setTimeout(() => {
      onSubmit(name.trim());
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim().length >= 2) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#0E0E0E] to-[#121212] text-white overflow-hidden relative"
    >
      {/* Background texture and atmosphere - same as welcome screen */}
      <div className="absolute inset-0">
        {/* Ambient background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-rose-400/3 to-transparent rounded-full blur-3xl" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.08]">
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
        {/* Header */}
        <div className="w-full flex justify-start items-center px-6 py-4">
          <button
            className="px-6 py-3 geist-mono bg-[#171717] border border-[#282828] rounded-xl text-[#E6E6E6] hover:bg-[#1F1F1F] hover:border-rose-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10"
            onClick={onBack}
          >
            ← Back
          </button>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
          <div ref={formRef} className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-transparent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
                 <img
                  src="/StelarLogo.svg"
                  alt="Stelar"
                  className="w-8 h-8"
                />
              </div>

              <h1 className="text-3xl    text-[#E6E6E6] mb-4 tracking-wide">
                Let's get to know you
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Elegant Name Input with Underlines */}
              <div className="space-y-6">
                {/* Custom Text Input with Underlines */}
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    className="w-full bg-transparent text-2xl text-[#E6E6E6] placeholder-[#737373] focus:outline-none focus:placeholder-rose-100/24 transition-all duration-300 pb-4 border-0 geist-mono font-bold tracking-wide"
                    autoFocus
                    autoComplete="given-name"
                  />

                  {/* Subtle Underlines */}
                  <div className="absolute bottom-0 left-0 right-0">
                    {/* Base line */}
                    <div className="w-full h-px bg-[#282828]"></div>

                    {/* Active line that grows on focus */}
                    <div
                      className={`h-px bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-300 ${
                        name.trim().length > 0 ? "w-full" : "w-0"
                      }`}
                    ></div>
                  </div>

                  {/* Focus indicator dots */}
                  <div className="absolute -bottom-2 left-0 right-0 flex justify-center space-x-1 opacity-0 focus-within:opacity-100 transition-opacity duration-300">
                    <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse animate-delay-200"></div>
                    <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse animate-delay-400"></div>
                  </div>
                </div>

                {/* Character count hint */}
                {name.length > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={`geist-mono transition-colors duration-300 ${
                        name.trim().length >= 2
                          ? "text-rose-400"
                          : "text-[#737373]"
                      }`}
                    >
                      {name.trim().length >= 2
                        ? "✓ Ready to continue"
                        : "At least 2 characters needed"}
                    </span>
                    <span className="text-[#737373] geist-mono text-xs">
                      {name.length}/50
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={name.trim().length < 2 || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg  tracking-wide transition-all duration-300 ${
                  name.trim().length >= 2 && !isSubmitting
                    ? "bg-rose-400 hover:bg-rose-500 text-black hover:scale-[1.02] hover:shadow-lg hover:shadow-rose-400/20"
                    : "bg-[#171717] border border-[#282828] text-[#737373] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    {/* <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    </div> */}
                    <span>Getting ready...</span>
                  </div>
                ) : (
                  "Continue to Chat"
                )}
              </button>
            </form>

            {/* Helper text */}
            <div className="text-center mt-6">
              <p className="text-sm text-[#737373]">
                We'll use your name to personalize your mental health analysis
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsScreen;
