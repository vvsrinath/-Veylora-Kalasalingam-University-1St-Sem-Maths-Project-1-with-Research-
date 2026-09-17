import React from 'react';

type BadgeTone = 'accent' | 'muted' | 'warn' | 'danger' | 'success';

interface BadgeProps {
  tone?: BadgeTone;
  theme?: 'dark' | 'light';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  accent: 'bg-accent/15 text-accent',
  muted: 'bg-white/10 text-muted',
  warn: 'bg-warn/15 text-warn',
  danger: 'bg-danger/15 text-danger',
  success: 'bg-success/15 text-success'
};

const TONE_CLASSES_LIGHT: Record<BadgeTone, string> = {
  accent: 'bg-accent/10 text-emerald-700',
  muted: 'bg-lightborder text-lightmuted',
  warn: 'bg-warn/10 text-amber-700',
  danger: 'bg-danger/10 text-red-700',
  success: 'bg-accent/10 text-emerald-700'
};

export function Badge({ tone = 'accent', theme = 'dark', children, className = '', icon }: BadgeProps) {
  const toneClass = theme === 'dark' ? TONE_CLASSES[tone] : TONE_CLASSES_LIGHT[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${toneClass} ${className}`}>
      
      {icon}
      {children}
    </span>);

}