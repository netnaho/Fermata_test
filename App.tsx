
import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import HomeScreen from './components/HomeScreen';
import MapScreen from './components/MapScreen';
import ProfileScreen from './components/ProfileScreen';
import { Screen, RouteDetails } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [route, setRoute] = useState<RouteDetails | null>(null);

  const handleStart = useCallback(() => {
    setScreen('home');
  }, []);

  const handleNavigate = useCallback((routeDetails: RouteDetails) => {
    setRoute(routeDetails);
    setScreen('map');
  }, []);

  const handleShowProfile = useCallback(() => {
    setScreen('profile');
  }, []);

  const handleBackToHome = useCallback(() => {
    setRoute(null);
    setScreen('home');
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} onShowProfile={handleShowProfile} />;
      case 'map':
        return route ? <MapScreen route={route} onBack={handleBackToHome} /> : <HomeScreen onNavigate={handleNavigate} onShowProfile={handleShowProfile} />;
      case 'profile':
        return <ProfileScreen onBack={handleBackToHome} />;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gray-900 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-[#0D0B1F] rounded-3xl shadow-2xl overflow-hidden relative border-4 border-gray-700">
        <div className="w-full h-full">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
