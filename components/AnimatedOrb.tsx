
import React from 'react';

interface AnimatedOrbProps {
  isListening: boolean;
}

const AnimatedOrb: React.FC<AnimatedOrbProps> = ({ isListening }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className={`absolute w-full h-full transition-transform duration-500 ${isListening ? 'scale-110' : 'scale-100'}`}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="7.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#8A2BE2', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#4A00E0', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <g filter="url(#glow)">
            <path
              d="M 200, 50 C 282.8, 50, 350, 117.2, 350, 200 C 350, 282.8, 282.8, 350, 200, 350 C 117.2, 350, 50, 282.8, 50, 200 C 50, 117.2, 117.2, 50, 200, 50 Z"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="2"
              className={isListening ? 'animate-pulse' : ''}
            />
             <path
              d="M 200, 70 C 271.8, 70, 330, 128.2, 330, 200 C 330, 271.8, 271.8, 330, 200, 330 C 128.2, 330, 70, 271.8, 70, 200 C 70, 128.2, 128.2, 70, 200, 70 Z"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
              strokeOpacity="0.5"
               className={isListening ? 'animate-spin-slow' : ''}
            />
            <path
              d="M100 200 C 100 144.77 144.77 100 200 100 C 255.23 100 300 144.77 300 200 C 300 255.23 255.23 300 200 300 C 144.77 300 100 255.23 100 200 Z"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
              strokeOpacity="0.3"
              transform="rotate(45 200 200)"
               className={isListening ? 'animate-spin-slow-reverse' : ''}
            />
          </g>
        </svg>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
          transform-origin: center;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
           transform-origin: center;
        }
      `}</style>
    </div>
  );
};

export default AnimatedOrb;
