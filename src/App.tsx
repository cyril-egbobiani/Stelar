import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import AboutScreen from "./components/AboutScreen";
import ChatScreen from "./components/ChatScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "about" | "chat"
  >("welcome");

  const handleNavigation = (screen: "welcome" | "about" | "chat") => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen onNavigate={handleNavigation} />;
      case "about":
        return <AboutScreen onNavigate={handleNavigation} />;
      case "chat":
        return <ChatScreen onNavigate={handleNavigation} />;
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased">{renderScreen()}</div>
  );
}

export default App;
