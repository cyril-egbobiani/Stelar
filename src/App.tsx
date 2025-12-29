import { useState } from "react";
import AboutScreen from "./components/AboutScreen";
import ChatScreen from "./components/ChatScreen";
import ReportScreen from "./components/ReportScreen";
import ReceiptScreen from "./components/ReceiptScreen";
import ConclusionScreen from "./components/ConclusionScreen";
import Navbar from "./components/Navbar";
import UserDetailsScreen from "./components/UserDetailsScreen";
import type { Message, WellbeingReport } from "./types";
import WelcomeScreen from "./components/WelcomeScreen";
import EngagementOptions from "./components/EngagementOptions";
import BreathingScreen from "./components/BreathingScreen";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [currentScreen, setCurrentScreen] = useState<
    | "welcome"
    | "about"
    | "userDetails"
    | "chat"
    | "report"
    | "receipt"
    | "conclusion"
    | "engage"
    | "breathing"
  >("welcome");
  const [conversationData, setConversationData] = useState<Message[]>([]);
  const [wellbeingReport, setWellbeingReport] =
    useState<WellbeingReport | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(() => {
    // Check if user name already exists in localStorage
    return localStorage.getItem("stelar_user_name") || "";
  });

  const handleNavigation = (
    screen:
      | "welcome"
      | "about"
      | "userDetails"
      | "chat"
      | "report"
      | "receipt"
      | "conclusion"
      | "engage"
      | "breathing"
  ) => {
    setCurrentScreen(screen);
  };

  const handleUserNameSubmit = (name: string) => {
    setUserName(name);
    handleNavigation("chat");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <>
            {/* <UserDetailsScreen
            onSubmit={handleUserNameSubmit}
            onBack={() => handleNavigation("welcome")}
          /> */}
            <Navbar />
            <WelcomeScreen
              onStartQuestionnaire={() => {
                handleNavigation("engage");
              }}
            />
          </>
        );
      case "engage":
        return (
          <>
            <EngagementOptions onNavigate={handleNavigation} />
          </>
        );
      case "breathing":
        return <BreathingScreen onNavigate={handleNavigation} />;
      case "about":
        return (
          <>
            <Navbar />
            <AboutScreen />
          </>
        );
      case "userDetails":
        return (
          <UserDetailsScreen
            onSubmit={handleUserNameSubmit}
            onBack={() => handleNavigation("welcome")}
          />
        );
      case "chat":
        return (
          <>
            <ChatScreen
              onNavigate={handleNavigation}
              setConversationData={setConversationData}
              conversationData={conversationData}
              conversationId={conversationId}
              setConversationId={setConversationId}
              setReport={setWellbeingReport}
              userName={userName}
            />
          </>
        );
      case "report":
        return (
          <>
            <Navbar />
            <ReportScreen
              onNavigate={handleNavigation}
              conversationData={conversationData}
              setWellbeingReport={setWellbeingReport}
              conversationId={conversationId}
            />
          </>
        );
      case "receipt":
        return wellbeingReport ? (
          <>
            <Navbar />
            <ReceiptScreen
              report={wellbeingReport}
              onBack={() => handleNavigation("report")}
              onNext={() => handleNavigation("conclusion")}
            />
          </>
        ) : null;
      case "conclusion":
        return wellbeingReport ? (
          <>
            <Navbar />
            <ConclusionScreen
              onNavigate={handleNavigation}
              report={wellbeingReport}
            />
          </>
        ) : null;
      default:
        return (
          <WelcomeScreen
            onStartQuestionnaire={() => handleNavigation("engage")}
          />
        );
    }
  };

  return <ThemeProvider>{renderScreen()}</ThemeProvider>;
}

export default App;
