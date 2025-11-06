import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "gsap";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  cycleTheme: () => void;
  animating: boolean;
  iconRef: React.RefObject<HTMLDivElement | null>;
  iconState: string;
  handleToggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark mode like ChatScreen
  const [animating, setAnimating] = useState(false);
  const [iconState, setIconState] = useState(isDarkMode ? "sun" : "moon");
  const iconRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedDarkMode = localStorage.getItem("darkMode") === "true";

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode);
      setIconState(savedDarkMode ? "sun" : "moon");
    }
  }, []);

  // Apply theme changes using ChatScreen's approach
  useEffect(() => {
    const updateTheme = () => {
      if (theme === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(systemDark);
        setIconState(systemDark ? "sun" : "moon");
      } else if (theme === "dark") {
        setIsDarkMode(true);
        setIconState("sun");
      } else {
        setIsDarkMode(false);
        setIconState("moon");
      }

      localStorage.setItem("theme", theme);
      localStorage.setItem("darkMode", isDarkMode.toString());

      // Debug logging
      console.log("Theme updated:", {
        theme,
        isDarkMode,
        iconState: isDarkMode ? "sun" : "moon",
      });
    };

    updateTheme();

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = () => updateTheme();
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme, isDarkMode]);

  // ChatScreen's working toggle function with GSAP animation
  const handleToggleDarkMode = () => {
    if (animating) return;
    setAnimating(true);

    // Apple-inspired sophisticated toggle animation
    const masterToggle = gsap.timeline({
      onComplete: () => setAnimating(false),
    });

    // Enhanced animation sequence with 3D transforms
    masterToggle
      .to(iconRef.current, {
        scale: 0.5,
        rotationY: 180,
        filter: "blur(8px) brightness(0.5)",
        duration: 0.25,
        ease: "power2.in",
      })
      .call(() => {
        setIsDarkMode((prev) => !prev);
        setIconState((prev) => (prev === "sun" ? "moon" : "sun"));
        // Update theme to light/dark when manually toggled (not system)
        if (theme === "system") {
          setTheme(!isDarkMode ? "dark" : "light");
        } else {
          setTheme(theme === "dark" ? "light" : "dark");
        }
      })
      .to(iconRef.current, {
        scale: 1.1,
        rotationY: 360,
        filter: "blur(0px) brightness(1.2)",
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(iconRef.current, {
        scale: 1,
        filter: "blur(0px) brightness(1)",
        duration: 0.2,
        ease: "power2.out",
      });
  };

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode,
        cycleTheme,
        animating,
        iconRef,
        iconState,
        handleToggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
