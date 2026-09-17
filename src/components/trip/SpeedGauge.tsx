import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface SpeedGaugeProps {
  speedKmh: number;
  maxSpeedKmh?: number;
  active: boolean;
}

const SIZE = 240;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SpeedGauge({ speedKmh, maxSpeedKmh = 140, active }: SpeedGaugeProps) {
  const reduced = usePrefersReducedMotion();
  const ratio = Math.min(1, Math.max(0, speedKmh / maxSpeedKmh));
  const offset = CIRCUMFERENCE * (1 - ratio);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[240px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" role="img" aria-label={`Current speed ${Math.round(speedKmh)} kilometres per hour`}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE} fill="none" />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={active ? '#2DD8A0' : '#9AAEBB'}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tabular-nums tracking-tight text-soft">{Math.round(speedKmh)}</span>
        <span className="mt-1 text-sm font-medium text-muted">km/h</span>
        <span className="mt-3 text-xs text-muted">GPS speed estimate</span>
      </div>
    </div>);

}