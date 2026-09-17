import React, { useEffect, useRef, useState } from 'react';
import { MapPinIcon, CircleIcon } from 'lucide-react';

interface RoutePathProps {
  progress: number;
  active: boolean;
}

const PATH_D = 'M24,150 C70,40 110,170 150,90 C180,30 210,120 250,55 C265,30 275,45 280,25';

export function RoutePath({ progress, active }: RoutePathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [point, setPoint] = useState({ x: 24, y: 150 });
  const clampedProgress = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    setPathLength(length);
    const p = path.getPointAtLength(length * clampedProgress);
    setPoint({ x: p.x, y: p.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navydark">
      <svg viewBox="0 0 300 180" className="h-56 w-full" role="img" aria-label="Simplified route trace of your trip">
        <path d={PATH_D} stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="#2DD8A0"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLength || 1}
          strokeDashoffset={(pathLength || 1) * (1 - clampedProgress)}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.23,1,0.32,1)' }} />
        
        <circle cx="24" cy="150" r="4" fill="#9AAEBB" />
        <circle cx={point.x} cy={point.y} r="6" fill="#2DD8A0" className={active ? 'animate-pulse' : ''} />
      </svg>
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-navy/70 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">
        <CircleIcon size={8} className="fill-current text-muted" />
        Start
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-navy/70 px-2.5 py-1 text-[11px] font-medium text-accent backdrop-blur">
        <MapPinIcon size={12} />
        Current position
      </div>
    </div>);

}