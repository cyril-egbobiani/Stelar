import { useState } from "react";
import AboutScreen from "./components/AboutScreen";
import ChatScreen from "./components/ChatScreen";
import ReportScreen from "./components/ReportScreen";
import ReceiptScreen from "./components/ReceiptScreen";
import ConclusionScreen from "./components/ConclusionScreen";
import Navbar from "./components/Navbar";
import type { Message, WellbeingReport } from "./types";
import WelcomeScreen from "./components/WelcomeScreen";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "about" | "chat" | "report" | "receipt" | "conclusion"
  >("welcome");
  const [conversationData, setConversationData] = useState<Message[]>([]);
  const [wellbeingReport, setWellbeingReport] =
    useState<WellbeingReport | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleNavigation = (
    screen: "welcome" | "about" | "chat" | "report" | "receipt" | "conclusion"
  ) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <>
            <Navbar />
            <WelcomeScreen
              onStartQuestionnaire={() => handleNavigation("chat")}
            />
            {/* <WelcomeScreen onNavigate={handleNavigation} /> */}
            {/* <AboutScreen /> */}
          </>
        );
      case "about":
        return (
          <>
            <Navbar />
            <AboutScreen />
          </>
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
            onStartQuestionnaire={() => handleNavigation("chat")}
          />
        );
    }
  };

  return <ThemeProvider>{renderScreen()}</ThemeProvider>;
}

export default App;
