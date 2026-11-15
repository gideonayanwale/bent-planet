import React from "react";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function BrandIcon({ size = 36, className = "", ...props }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="OIKODARA mark" {...props}>
      <rect x="7" y="7" width="86" height="86" rx="25" fill="#EEF2FF" />
      <path d="M24 76V48C24 32 35.6 20 50 20C64.4 20 76 32 76 48V76" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 9V29M41 18H59" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" />
      <path d="M24 76H76" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
      <circle cx="35" cy="53" r="5" fill="#10B981" /><circle cx="65" cy="53" r="5" fill="#10B981" /><circle cx="50" cy="63" r="5" fill="#4F46E5" />
      <path d="M35 58L46 63M65 58L54 63" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

interface BrandLogoProps {
  iconSize?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export function BrandLogo({ iconSize = 36, showText = true, className = "", textClassName = "" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandIcon size={iconSize} className="shrink-0" />
      {showText && (
        <div className={`flex flex-col select-none leading-none ${textClassName}`}>
          <span className="font-sans text-[1.15rem] font-extrabold tracking-[0.08em] text-slate-950 dark:text-white">OIKODARA</span>
          <span className="mt-1 text-[0.52rem] font-semibold tracking-[0.12em] text-slate-500 dark:text-slate-400">BUILDING THE CHURCH. CONNECTING THE PEOPLE.</span>
        </div>
      )}
    </div>
  );
}
