import { useState } from "react";
import AboutScreen from "./components/AboutScreen";
import ChatScreen from "./components/ChatScreen";
import ReportScreen from "./components/ReportScreen";
import ReceiptScreen from "./components/ReceiptScreen";
import ConclusionScreen from "./components/ConclusionScreen";
import Navbar from "./components/Navbar";
import type { Message, WellbeingReport } from "./types";
import WelcomeScreen from "./components/WelcomeScreen";
 
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
            <WelcomeScreen onNavigate={handleNavigation} />
            {/* <WelcomeScreen onNavigate={handleNavigation} /> */}
            {/* <AboutScreen /> */}
          </>
        );
      case "about":
        return <AboutScreen />;
      case "chat":
        return (
          <ChatScreen
            onNavigate={handleNavigation}
            setConversationData={setConversationData}
            conversationData={conversationData}
            conversationId={conversationId}
            setConversationId={setConversationId}
            setReport={setWellbeingReport}
          />
        );
      case "report":
        return (
          <ReportScreen
            onNavigate={handleNavigation}
            conversationData={conversationData}
            setWellbeingReport={setWellbeingReport}
            conversationId={conversationId}
          />
        );
      case "receipt":
        return wellbeingReport ? (
          <ReceiptScreen
            report={wellbeingReport}
            onBack={() => handleNavigation("report")}
            onNext={() => handleNavigation("conclusion")}
          />
        ) : null;
      case "conclusion":
        return wellbeingReport ? (
          <ConclusionScreen
            onNavigate={handleNavigation}
            report={wellbeingReport}
          />
        ) : null;
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;
