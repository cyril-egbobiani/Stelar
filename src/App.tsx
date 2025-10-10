import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import AboutScreen from "./components/AboutScreen";
import ChatScreen from "./components/ChatScreen";
import ReportScreen from "./components/ReportScreen";
import ConclusionScreen from "./components/ConclusionScreen";
import Navbar from "./components/Navbar";
import type { Message, Report } from "./types";

function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "about" | "chat" | "report" | "conclusion"
  >("welcome");
  const [conversationData, setConversationData] = useState<Message[]>([]);
  const [report, setReport] = useState<Report | null>(null);

  const handleNavigation = (
    screen: "welcome" | "about" | "chat" | "report" | "conclusion"
  ) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <>
            <Navbar />
            <WelcomeScreen onNavigate={handleNavigation} />
          </>
        );
      case "about":
        return <AboutScreen onNavigate={handleNavigation} />;
      case "chat":
        return (
          <ChatScreen
            onNavigate={handleNavigation}
            setConversationData={setConversationData}
            conversationData={conversationData}
          />
        );
      case "report":
        return (
          <ReportScreen
            onNavigate={handleNavigation}
            conversationData={conversationData}
            setReport={setReport}
          />
        );
      case "conclusion":
        return report ? (
          <ConclusionScreen onNavigate={handleNavigation} report={report} />
        ) : null;
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;
