
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "relative px-6 py-3 md:px-8 md:py-4 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    // Primary: White body, Black border, Hard Black Shadow. 
    // Hover: Blue body, White text, Shadow collapses.
    primary: "bg-white text-swiss-black border-2 border-swiss-black shadow-sharp hover:shadow-flat hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-swiss-blue hover:text-white hover:border-swiss-blue focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-swiss-black",
    
    // Secondary: Transparent body, Border. Hover: Hatching pattern.
    secondary: "bg-white border-2 border-swiss-border text-swiss-black hover:border-swiss-black hover:bg-stripe-pattern focus-visible:border-swiss-black shadow-sm hover:shadow-hover",
    
    // Danger: Red text.
    danger: "bg-white border-2 border-swiss-border text-swiss-red hover:bg-swiss-red hover:border-swiss-red hover:text-white shadow-none hover:shadow-sharp focus-visible:border-swiss-red",
    
    // Ghost: Minimal
    ghost: "text-swiss-muted hover:text-swiss-black border-2 border-transparent hover:border-swiss-border bg-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        // Rotating Square Loader - Uses currentColor to match text (White on hover/primary, Black otherwise)
        <div className="w-3 h-3 border-2 border-current animate-spin-square" aria-hidden="true" />
      )}
      {!isLoading && children}
      {isLoading && <span className="opacity-80">PROCESSING...</span>}
    </button>
  );
};
