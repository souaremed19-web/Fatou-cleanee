import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Fatou's Clean Emblème - Vert & Blanc Branding Guinée */}
      <div className={`relative ${sizeMap[size]} shrink-0 rounded-2xl bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#047857] p-1.5 shadow-md shadow-emerald-600/25 flex items-center justify-center overflow-hidden border border-emerald-400/30`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Background circular swirl */}
          <circle cx="50" cy="50" r="48" fill="#15803d" />
          
          {/* Sparkling bubbles */}
          <circle cx="36" cy="33" r="3" fill="white" />
          <circle cx="43" cy="30" r="2" fill="white" />
          <circle cx="28" cy="42" r="2" fill="white" />
          
          {/* House roof outline */}
          <path 
            d="M 28 45 L 50 25 L 68 41" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Spray nozzle at the top right of the roof */}
          <path 
            d="M 55 24 L 62 24 L 67 19 L 60 19 Z" 
            fill="white" 
          />
          <path 
            d="M 64 21 Q 72 23 70 30" 
            stroke="white" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <circle cx="65" cy="27" r="4" fill="white" />
          <circle cx="65" cy="27" r="2.2" fill="#16a34a" />

          {/* Chimney / Spray pipe */}
          <path 
            d="M 50 30 L 50 45" 
            stroke="white" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 46 32 L 54 32" 
            stroke="white" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* "Fatou's" script text representation */}
          <text 
            x="50" 
            y="52" 
            textAnchor="middle" 
            fill="white" 
            fontSize="18" 
            fontWeight="900" 
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
            style={{ fontStyle: 'italic', filter: 'drop-shadow(0 1px 2px rgba(6,78,59,0.5))' }}
          >
            Fatou's
          </text>

          {/* "clean" in deep forest green bold on pure white */}
          <rect x="23" y="55" width="54" height="20" rx="10" fill="white" />
          <text 
            x="50" 
            y="70" 
            textAnchor="middle" 
            fill="#064e3b" 
            fontSize="16" 
            fontWeight="900" 
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            clean
          </text>

          {/* Brush / bristles and water swooshes at the bottom */}
          <path 
            d="M 40 78 Q 50 82 60 78" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M 42 76 L 43 79 M 46 76 L 47 80 M 50 76 L 50 80 M 54 76 L 53 80 M 58 76 L 57 79" 
            stroke="#064e3b" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M 28 78 Q 45 88 68 83" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 32 84 Q 48 91 62 88" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-[#064e3b]">
              Fatou's <span className="text-[#16a34a]">Clean</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#15803d] font-extrabold border border-emerald-200">
              ★ 4.9
            </span>
          </div>
          <p className="text-[11px] text-[#059669] tracking-wider uppercase font-bold flex items-center gap-1">
            <span>Nettoyage Pro</span>
            <span className="text-slate-300">·</span>
            <span>Conciergerie</span>
            <span className="text-slate-300">·</span>
            <span className="text-[#064e3b]">Conakry 🇬🇳</span>
          </p>
        </div>
      )}
    </div>
  );
};
