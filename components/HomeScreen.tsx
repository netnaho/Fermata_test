import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { getDirections } from '../services/geminiService';
import { useLocation } from '../hooks/useLocation';
import { RouteDetails } from '../types';
import AnimatedOrb from './AnimatedOrb';
import UserIcon from './icons/UserIcon';
import MicIcon from './icons/MicIcon';

// Helper functions for audio processing
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // FIX: Updated audio encoding to align with @google/genai SDK guidelines.
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface HomeScreenProps {
  onNavigate: (route: RouteDetails) => void;
  onShowProfile: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onShowProfile }) => {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState("Where Do you Want To Go");
  const { location } = useLocation();

  const sessionRef = useRef<LiveSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const stopListening = useCallback(() => {
    if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
    }
    if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setIsListening(false);
    setStatusText("Where Do you Want To Go");
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
        if (!process.env.API_KEY) {
            setStatusText("API Key not configured.");
            return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        setIsListening(true);
        setStatusText("Listening...");

        let transcription = '';

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: async () => {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    // FIX: Cast window to `any` to handle vendor-prefixed webkitAudioContext for broader browser compatibility.
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    audioContextRef.current = audioContext;

                    const source = audioContext.createMediaStreamSource(stream);
                    mediaStreamSourceRef.current = source;
                    
                    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(audioContext.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        transcription += message.serverContent.inputTranscription.text;
                    }
                    if (message.serverContent?.turnComplete) {
                        stopListening();
                        setStatusText("Finding route...");
                        const finalTranscription = transcription.trim();
                        if (finalTranscription) {
                            const routeDetails = await getDirections(finalTranscription, location);
                            onNavigate(routeDetails);
                        } else {
                            setStatusText("Couldn't hear that. Try again.");
                        }
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Gemini Live error:', e);
                    setStatusText("Error with voice service.");
                    stopListening();
                },
                onclose: () => {
                    // This can be called when stopListening is invoked
                },
            },
            config: {
                // FIX: Added responseModalities as it is required for live sessions.
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                systemInstruction: "You are a helpful navigation assistant for an Amharic-speaking user. Transcribe their destination accurately.",
            },
        });
        
        sessionRef.current = await sessionPromise;
        
    } catch (error) {
      console.error("Failed to start listening:", error);
      setStatusText("Could not start microphone.");
      setIsListening(false);
    }
  }, [isListening, location, onNavigate, stopListening]);

  return (
    <div className="bg-[#0D0B1F] text-white flex flex-col h-full p-6">
      <header className="flex justify-end">
        <button onClick={onShowProfile} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <UserIcon className="w-7 h-7 text-gray-300" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center -mt-16">
        <h1 className="text-5xl font-bold tracking-tight">Hi, There</h1>
        <p className="text-lg text-gray-400 mt-2">{statusText}</p>
        <div className="my-8">
            <AnimatedOrb isListening={isListening} />
        </div>
      </main>

      <footer className="flex justify-center pb-8">
        <button
          onClick={startListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
            ${isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse' 
                : 'bg-gradient-to-br from-purple-600 to-blue-600'
            }`}
        >
          <MicIcon className="w-8 h-8 text-white" />
        </button>
      </footer>
    </div>
  );
};

export default HomeScreen;
