import React, { useState, useCallback } from 'react';
import { RouteDetails } from '../types';
import { textToSpeechAmharic } from '../services/geminiService';
import { useLocation } from '../hooks/useLocation';
import GoogleMapView from './GoogleMapView';
import MicIcon from './icons/MicIcon';

// Audio decoding helpers
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


interface MapScreenProps {
  route: RouteDetails;
  onBack: () => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ route, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { location, error: locationError } = useLocation();
  
  const handlePlayDirections = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64Audio = await textToSpeechAmharic(route.directionsAmharic);
      // FIX: Cast window to `any` to handle vendor-prefixed webkitAudioContext for broader browser compatibility.
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedData = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedData, audioContext);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      source.onended = () => {
        setIsPlaying(false);
        audioContext.close();
      };
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    }
  }, [route.directionsAmharic, isPlaying]);

  const renderMap = () => {
    if (locationError) {
      return <div className="absolute inset-0 bg-[#1A182E] flex items-center justify-center text-red-400 p-4">{`Could not get your location: ${locationError}`}</div>;
    }
    if (!location) {
      return <div className="absolute inset-0 bg-[#1A182E] flex items-center justify-center text-gray-300">Getting your location...</div>;
    }
    return <GoogleMapView origin={location} destination={route.destination} />;
  }

  return (
    <div className="relative w-full h-full bg-[#0D0B1F] text-white overflow-hidden">
        {renderMap()}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D0B1F] via-[#0D0B1F]/90 to-transparent p-6 pt-24">
            <div className="bg-[#1C1A33]/80 backdrop-blur-md p-6 rounded-2xl">
                <div className="text-center mb-4">
                    <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold">{route.duration} ({route.distance})</h2>
                <p className="text-gray-400">Simplest path to {route.destination}</p>
                <div className="w-full h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-1/3 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={handlePlayDirections}
                        disabled={isPlaying}
                        className="flex-grow bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-4 rounded-full text-lg shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPlaying ? 'Speaking...' : 'Listen'}
                    </button>
                    <button className="ml-4 w-16 h-16 rounded-full flex items-center justify-center bg-white/10">
                        <MicIcon className="w-7 h-7 text-white" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MapScreen;