import React from "react";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> { size?: number; className?: string; }

/** OIKODARA emblem: church arch, cross and connected community. */
export function BrandIcon({ size = 36, className = "", ...props }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="OIKODARA emblem" {...props}>
      <path d="M19 82V47C19 29.9 32.9 16 50 16C67.1 16 81 29.9 81 47V82" stroke="#818CF8" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 5V29M39 17H61" stroke="#A78BFA" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M19 82H81" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
      <circle cx="33" cy="54" r="6" fill="#10B981" /><circle cx="67" cy="54" r="6" fill="#10B981" /><circle cx="50" cy="67" r="6" fill="#818CF8" />
      <path d="M33 60L45 67M67 60L55 67" stroke="#A5B4FC" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

interface BrandLogoProps { iconSize?: number; showText?: boolean; className?: string; textClassName?: string; }

export function BrandLogo({ iconSize = 36, showText = true, className = "", textClassName = "" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandIcon size={iconSize} className="shrink-0" />
      {showText && (
        <div className={`flex flex-col select-none leading-none ${textClassName}`}>
          <span className="font-heading text-[1.15rem] font-extrabold tracking-[0.08em] text-white">OIKODARA</span>
          <span className="mt-1 text-[0.52rem] font-semibold tracking-[0.12em] text-slate-400">BUILDING THE CHURCH. CONNECTING THE PEOPLE.</span>
        </div>
      )}
    </div>
  );
}
