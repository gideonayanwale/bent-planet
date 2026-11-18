import React from "react";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> { size?: number; className?: string; }

/** OIKODARA's approved mark: church arch, cross, connected people and open-book foundation. */
export function BrandIcon({ size = 36, className = "", ...props }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="OIKODARA emblem" {...props}>
      <defs>
        <linearGradient id="oikodara-arch" x1="12" y1="8" x2="83" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5"/><stop offset="0.55" stopColor="#7C3AED"/><stop offset="1" stopColor="#312E81"/>
        </linearGradient>
        <linearGradient id="oikodara-people" x1="15" y1="48" x2="86" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5"/><stop offset="0.52" stopColor="#7C3AED"/><stop offset="1" stopColor="#10B981"/>
        </linearGradient>
      </defs>
      <path d="M13 76V43C13 22.6 29.6 7 50 2C70.4 7 87 22.6 87 43V76" stroke="url(#oikodara-arch)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M50 21V48M38 34.5H62" stroke="#0F172A" strokeWidth="7" strokeLinecap="square"/>
      <circle cx="28" cy="57" r="7.5" fill="#4F46E5"/>
      <circle cx="50" cy="61" r="8" fill="#7C3AED"/>
      <circle cx="72" cy="57" r="7.5" fill="#10B981"/>
      <path d="M8 83C10 68 18 64 28 64C38 64 44 70 46 83H8Z" fill="#4F46E5"/>
      <path d="M29 88C31 72 39 68 50 68C61 68 69 72 71 88H29Z" fill="#7C3AED"/>
      <path d="M54 83C56 70 62 64 72 64C82 64 90 68 92 83H54Z" fill="#10B981"/>
      <path d="M5 91C23 82 39 81 50 85C61 81 77 82 95 91L50 98L5 91Z" fill="#0F172A"/>
      <path d="M12 89C27 84 40 85 50 89C60 85 73 84 88 89" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

interface BrandLogoProps { iconSize?: number; showText?: boolean; className?: string; textClassName?: string; }

export function BrandLogo({ iconSize = 40, showText = true, className = "", textClassName = "" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandIcon size={iconSize} className="shrink-0" />
      {showText && (
        <div className={`flex flex-col select-none leading-none ${textClassName}`}>
          <span className="font-heading text-[1.15rem] font-extrabold tracking-[0.015em] text-foreground">OIKOD<span className="bg-gradient-to-br from-indigo-600 via-violet-600 to-violet-700 bg-clip-text text-transparent">A</span>RA</span>
          <span className="mt-1 hidden text-[0.52rem] font-semibold tracking-[0.025em] text-muted-foreground sm:block">Building the Church. Connecting the People.</span>
        </div>
      )}
    </div>
  );
}
