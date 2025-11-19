import React from 'react';

export const ConsistencyBadge: React.FC<{ cr: number }> = ({ cr }) => {
  const isGood = cr <= 0.10;
  return (
    <div 
      className={`
        flex items-center gap-0 border-2 
        ${isGood ? 'border-swiss-black text-swiss-black' : 'border-swiss-red text-swiss-red'} 
        bg-white/90 backdrop-blur-md shadow-sharp transition-colors duration-300
      `}
      role="status"
      aria-label={`Consistency Ratio: ${cr.toFixed(3)}. Status: ${isGood ? 'Pass' : 'Review needed'}`}
    >
      <div className={`px-4 py-3 font-mono text-2xl font-bold border-r-2 ${isGood ? 'border-swiss-black' : 'border-swiss-red'}`}>
        {cr.toFixed(2)}
      </div>
      <div className="px-5 py-2 flex flex-col justify-center">
        <span className="text-[9px] uppercase tracking-[0.25em] leading-none opacity-60 font-bold">Consistency</span>
        <span className="font-mono text-sm font-black uppercase tracking-widest mt-1">
            {isGood ? 'OPTIMAL' : 'DRIFTING'}
        </span>
      </div>
    </div>
  );
};