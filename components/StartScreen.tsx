
import React from 'react';
import AnimatedOrb from './AnimatedOrb';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-[#0D0B1F] text-white flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <AnimatedOrb isListening={false} />
        <h1 className="text-6xl font-bold mt-4">Selam</h1>
        <p className="text-lg text-gray-400 mt-2">Find your way, just by speaking.</p>
      </div>
      <div className="w-full pb-8">
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-4 rounded-full text-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
        >
          Start Navigate
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
