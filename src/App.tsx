import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import AboutScreen from "./components/AboutScreen";
import ChatScreen from "./components/ChatScreen";
import QuestionFlow from "./components/QuestionFlow";

const dummyQuestions = [
  "What's your name?",
  "How are you feeling today?",
  "What made you smile recently?",
  "Is there something on your mind?",
  "How do you usually relax?",
  "What's one thing you'd like to improve?",
  "Any goals for this week?",
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "about" | "chat" | "questions"
  >("welcome");

  const handleNavigation = (
    screen: "welcome" | "about" | "chat" | "questions"
  ) => {
    setCurrentScreen(screen);
  };

  const handleQuestionsComplete = (answers: string[]) => {
    // Handle answers (e.g., save, show summary, etc.)
    setCurrentScreen("chat"); // Go back to chat or another screen
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen onNavigate={handleNavigation} />;
      case "about":
        return <AboutScreen onNavigate={handleNavigation} />;
      case "chat":
        return <ChatScreen onNavigate={handleNavigation} />;
      case "questions":
        return (
          <QuestionFlow
           />
        );
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased">{renderScreen()}</div>
  );
}

export default App;
