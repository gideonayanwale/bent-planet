import React from "react";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function BrandIcon({ size = 36, className = "", ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Outer Circle Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        className="stroke-slate-900 dark:stroke-slate-100"
        strokeWidth="6.5"
        fill="white"
      />

      {/* Subtle globe / planet curvature wireframe lines */}
      <path
        d="M10 52 C 25 78, 75 78, 90 52"
        stroke="#CBD5E1"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M18 42 C 32 64, 68 64, 82 42"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Golden Chevron / Bent Angle */}
      {/* Left wing */}
      <path
        d="M 12 36 L 50 62 L 50 48 L 19 26 Z"
        fill="#D99B26"
      />
      {/* Right wing */}
      <path
        d="M 50 62 L 88 36 L 81 26 L 50 48 Z"
        fill="#C58A1B"
      />
      {/* Center crease line */}
      <line
        x1="50"
        y1="48"
        x2="50"
        y2="62"
        stroke="#8C5E0D"
        strokeWidth="1.5"
      />
    </svg>
  );
}

interface BrandLogoProps {
  iconSize?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export function BrandLogo({
  iconSize = 36,
  showText = true,
  className = "",
  textClassName = "",
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandIcon size={iconSize} className="shrink-0 drop-shadow-sm" />
      {showText && (
        <div className={`flex flex-col select-none leading-none ${textClassName}`}>
          <div className="flex flex-col">
            <span className="font-serif text-[1.15rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Bent
            </span>
            <span className="font-serif text-[1.15rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Planet
            </span>
          </div>
          <div className="h-[2.5px] w-full max-w-[50px] bg-[#D99B26] mt-[3px] rounded-full" />
        </div>
      )}
    </div>
  );
}
