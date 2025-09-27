import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'about' | 'chat'>('welcome')

  const handleNavigation = (screen: 'welcome' | 'about' | 'chat') => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigation} />
      case 'about':
        return <div>About Screen (Coming Soon)</div>
      case 'chat':
        return <div>Chat Screen (Coming Soon)</div>
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />
    }
  }

  return (
    <div className="min-h-screen font-sans antialiased">
      {renderScreen()}
    </div>
  )
}

export default App
