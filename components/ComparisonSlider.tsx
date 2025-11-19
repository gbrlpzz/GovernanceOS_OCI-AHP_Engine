
import React, { useCallback } from 'react';

interface ComparisonSliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (val: number) => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  leftLabel,
  rightLabel,
  value,
  onChange
}) => {
  const getLabel = useCallback((val: number) => {
    if (val === 0) return "EQUAL";
    if (val < 0) return `${Math.abs(val) + 1} : 1`;
    return `1 : ${val + 1}`;
  }, []);

  // Progressive Opacity Logic
  const leftIntensity = value < 0 ? Math.abs(value) / 8 : 0;
  const rightIntensity = value > 0 ? value / 8 : 0;

  return (
    <div 
      className="w-full border-2 border-swiss-border bg-swiss-white group hover:border-swiss-black transition-colors duration-300"
      role="group" 
      aria-label={`Compare ${leftLabel} against ${rightLabel}`}
    >
      <style>{`
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 48px;
          background: #ffffff;
          border: 3px solid #000000;
          box-shadow: 3px 3px 0px 0px #000000;
          cursor: pointer;
          position: relative;
          z-index: 30;
          transition: background-color 0.2s ease, transform 0.1s ease, border-color 0.2s ease;
        }
        
        .custom-range::-webkit-slider-runnable-track {
            height: 100%;
            background: transparent;
            cursor: pointer;
        }
        
        .custom-range::-moz-range-thumb {
          width: 24px;
          height: 48px;
          background: #ffffff;
          border: 3px solid #000000;
          box-shadow: 3px 3px 0px 0px #000000;
          cursor: pointer;
          z-index: 30;
          transition: background-color 0.2s ease, transform 0.1s ease, border-color 0.2s ease;
        }

        .custom-range:hover::-webkit-slider-thumb {
           background: #0044FF;
           border-color: #000000;
        }

        .custom-range:active::-webkit-slider-thumb {
           transform: scale(0.95);
           background: #0044FF;
        }

        .custom-range:focus::-webkit-slider-thumb {
           border-color: #0044FF;
           outline: none;
        }
        
        .custom-range:focus::-moz-range-thumb {
           border-color: #0044FF;
           outline: none;
        }
      `}</style>

      {/* Header with Progressive Blackout */}
      <div className="flex border-b-2 border-swiss-border group-hover:border-swiss-black transition-colors">
        <div 
            className="flex-1 p-4 text-xs font-mono uppercase tracking-wider border-r-2 border-swiss-border group-hover:border-swiss-black transition-colors transition-all duration-200"
            style={{
                backgroundColor: `rgba(0, 0, 0, ${leftIntensity})`,
                color: leftIntensity > 0.4 ? '#FFFFFF' : '#000000',
                fontWeight: leftIntensity > 0 ? 700 : 400
            }}
        >
          {leftLabel}
        </div>
        
        <div className="w-32 p-4 flex items-center justify-center text-xs font-mono font-bold text-swiss-black bg-swiss-gray border-r-2 border-l-2 border-swiss-border group-hover:border-swiss-black transition-colors">
          {getLabel(value)}
        </div>

        <div 
            className="flex-1 p-4 text-right text-xs font-mono uppercase tracking-wider border-l-2 border-swiss-border group-hover:border-swiss-black transition-colors transition-all duration-200"
            style={{
                backgroundColor: `rgba(0, 0, 0, ${rightIntensity})`,
                color: rightIntensity > 0.4 ? '#FFFFFF' : '#000000',
                fontWeight: rightIntensity > 0 ? 700 : 400
            }}
        >
          {rightLabel}
        </div>
      </div>

      {/* Slider Track Area */}
      <div className="relative h-24 bg-swiss-white flex items-center overflow-visible">
        
        {/* Rail (Track) */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-swiss-border z-0 -translate-y-1/2 pointer-events-none"></div>

        {/* Central Axis */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-swiss-black z-0 pointer-events-none"></div>

        {/* Grid Lines (Ruler) */}
        <div className="absolute inset-0 flex justify-between px-10 pointer-events-none z-0">
            {Array.from({length: 17}).map((_, i) => {
                const val = i - 8;
                const isZero = val === 0;
                const isMajor = Math.abs(val) % 4 === 0; // 0, 4, 8
                
                let heightClass = "h-2 mt-10"; 
                let colorClass = "bg-swiss-border";
                let widthClass = "w-px";

                if (isZero) { 
                    heightClass = "h-full"; 
                    colorClass = "bg-transparent"; // Hidden, handled by central axis div
                    widthClass = "w-0.5";
                } else if (isMajor) { 
                    heightClass = "h-4 mt-9"; 
                    colorClass = "bg-swiss-black"; 
                    widthClass = "w-0.5";
                }

                return (
                    <div key={i} className={`flex flex-col items-center justify-center w-4 relative`}>
                        {isMajor && !isZero && (
                            <span className="absolute top-3 text-[9px] font-mono text-swiss-muted">{Math.abs(val)}</span>
                        )}
                        <div className={`${widthClass} ${heightClass} ${colorClass}`}></div>
                    </div>
                )
            })}
        </div>

        {/* Range Input */}
        <input
          type="range"
          min="-8"
          max="8" 
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          aria-label={`Comparison value: ${value}`}
          className="custom-range absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20 focus:outline-none"
        />
      </div>
    </div>
  );
};
