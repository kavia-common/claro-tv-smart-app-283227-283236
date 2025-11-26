import React, { useEffect } from 'react';
import './App.css';
import './theme.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { TopNav } from './components/TopNav';
import { SideMenu } from './components/SideMenu';
import HomeScreen from './pages/HomeScreen';
import SubscriptionScreen from './pages/SubscriptionScreen';
import SettingsScreen from './pages/SettingsScreen';
import { MemoryPanel } from './components/MemoryPanel';
import { FocusProvider } from './hooks/useFocusManager';
import { useRemoteNavigation } from './hooks/useRemoteNavigation';

// Root shell for remote navigation back handler
function Shell() {
  const navigate = useNavigate();
  useRemoteNavigation({
    onBack: () => {
      // Try to go back in history else go home
      if (window.history.length > 1) navigate(-1);
      else navigate('/');
    }
  });

  useEffect(() => {
    // Set a TV-friendly default focus at startup
    const t = setTimeout(() => {
      const first = document.querySelector('.sidemenu .sidemenu-item');
      if (first) first.focus();
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="tv-app">
      <TopNav />
      <SideMenu />
      <main className="main" role="main">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/subscriptions" element={<SubscriptionScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </main>
      <MemoryPanel />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entry rendering TV layout, routing, focus and remote nav */
  useEffect(() => {
    // Global, TV-optimized scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  return (
    <FocusProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </FocusProvider>
  );
}

export default App;
