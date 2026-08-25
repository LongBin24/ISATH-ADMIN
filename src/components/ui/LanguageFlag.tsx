import React from "react";

interface FlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CambodiaFlag({ className = "size-4", ...props }: FlagProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={`inline-block shrink-0 rounded-[3px] shadow-xs overflow-hidden ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Top Blue Stripe */}
      <rect width="64" height="12" fill="#003377" />
      {/* Middle Red Stripe */}
      <rect y="12" width="64" height="24" fill="#DA121A" />
      {/* Bottom Blue Stripe */}
      <rect y="36" width="64" height="12" fill="#003377" />
      {/* Angkor Wat Silhouette in White */}
      <g fill="#FFFFFF">
        {/* Base steps */}
        <rect x="16" y="32" width="32" height="2" />
        <rect x="18" y="30" width="28" height="2" />
        {/* Main Central Tower */}
        <polygon points="32,15 29.5,20 34.5,20" />
        <rect x="30" y="20" width="4" height="10" />
        {/* Left Tower */}
        <polygon points="24,19 22,23 26,23" />
        <rect x="23" y="23" width="2" height="7" />
        {/* Right Tower */}
        <polygon points="40,19 38,23 42,23" />
        <rect x="39" y="23" width="2" height="7" />
        {/* Connecting Gallery */}
        <rect x="23" y="26" width="18" height="4" />
      </g>
    </svg>
  );
}

export function UKFlag({ className = "size-4", ...props }: FlagProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={`inline-block shrink-0 rounded-[3px] shadow-xs overflow-hidden ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <clipPath id="uk-flag-clip">
        <rect width="64" height="48" rx="2" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        {/* Blue background */}
        <rect width="64" height="48" fill="#012169" />
        {/* White diagonals */}
        <path d="M0 0 L64 48 M64 0 L0 48" stroke="#FFFFFF" strokeWidth="8" />
        {/* Red diagonals */}
        <path d="M0 0 L64 48" stroke="#C8102E" strokeWidth="4" />
        <path d="M64 0 L0 48" stroke="#C8102E" strokeWidth="4" />
        {/* White cross */}
        <path d="M32 0 v48 M0 24 h64" stroke="#FFFFFF" strokeWidth="14" />
        {/* Red cross */}
        <path d="M32 0 v48 M0 24 h64" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}

export function LanguageFlag({
  locale,
  className = "w-5 h-3.5",
}: {
  locale?: string | null;
  className?: string;
}) {
  if (locale === "km") {
    return <CambodiaFlag className={className} />;
  }
  return <UKFlag className={className} />;
}
