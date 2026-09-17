import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: number;
  theme?: 'dark' | 'light';
  className?: string;
}

export function Logo({ variant = 'full', size = 30, theme = 'dark', className = '' }: LogoProps) {
  const wordColor = theme === 'dark' ? 'text-soft' : 'text-lighttext';

  const mark =
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="shrink-0">
    
      <defs>
        <linearGradient id="veylora-arc" x1="4" y1="8" x2="44" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2DD8A0" />
        </linearGradient>
        <linearGradient id="veylora-road" x1="8" y1="44" x2="40" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A9B8" />
          <stop offset="100%" stopColor="#2DD8A0" />
        </linearGradient>
      </defs>
      <path d="M6 19.5A18 18 0 0 1 42 19.5" stroke="url(#veylora-arc)" strokeWidth="4.2" strokeLinecap="round" fill="none" />
      <path d="M9 42C15.5 30 20 26.5 24 24.5C29 22 34.5 22.5 39.5 16.5" stroke="url(#veylora-road)" strokeWidth="4.2" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="24.5" r="2.6" fill="#2DD8A0" />
    </svg>;


  const wordmark =
  <span className={`font-bold tracking-tight ${wordColor}`} style={{ fontSize: size * 0.62 }}>
      Vey
      <span className="bg-gradient-to-r from-accent2 to-accent bg-clip-text text-transparent">lora</span>
    </span>;


  if (variant === 'mark') return <span className={className}>{mark}</span>;
  if (variant === 'wordmark') return <span className={className}>{wordmark}</span>;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {mark}
      {wordmark}
    </span>);

}