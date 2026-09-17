import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, GaugeIcon, FuelIcon, MapPinIcon, TrendingDownIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { heroHighlights } from '../../data/content';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const HERO_IMAGE = "/e9befcb9-4cf4-4b05-aa72-900c6e506640.jpg";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const initial = reduced ? undefined : { opacity: 0, y: 14 };
  const animate = reduced ? undefined : { opacity: 1, y: 0 };

  return (
    <section id="top" className="relative overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />
      </div>

      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-6 py-24 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <motion.div initial={initial} animate={animate} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Find your most efficient drive
              </span>
            </motion.div>

            <motion.h1
              initial={initial}
              animate={animate}
              transition={{ duration: 0.45, delay: 0.06 }}
              className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-soft sm:text-5xl md:text-6xl">
              
              Smarter drives,
              <br />
              <span className="bg-gradient-to-r from-accent2 to-accent bg-clip-text text-transparent">
                brighter tomorrows
              </span>
            </motion.h1>

            <motion.p
              initial={initial}
              animate={animate}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              
              Veylora analyzes your vehicle, speed, trip data, road conditions, and driving behaviour to estimate
              fuel consumption and identify a more efficient driving strategy.
            </motion.p>

            <motion.div
              initial={initial}
              animate={animate}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3">
              
              <Link to="/dashboard">
                <Button size="lg">
                  Start Optimizing
                  <ArrowRightIcon size={18} />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={initial}
              animate={animate}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              
              {heroHighlights.map((item) =>
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted">
                  <item.icon size={16} className="text-accent" aria-hidden="true" />
                  {item.label}
                </div>
              )}
            </motion.div>
          </div>

          <div className="relative hidden min-h-[420px] md:block" aria-hidden="true">
            <FloatingCard
              className="right-2 top-2"
              delay={0.3}
              icon={<GaugeIcon size={16} className="text-accent" />}
              label="Optimal Speed"
              value="58 km/h"
              caption="Estimated · based on your data" />
            
            <FloatingCard
              className="left-0 top-40"
              delay={0.42}
              icon={<FuelIcon size={16} className="text-accent2" />}
              label="Fuel Usage"
              value="2.8 L"
              caption="Example result" />
            
            <FloatingCard
              className="right-8 bottom-28"
              delay={0.54}
              icon={<MapPinIcon size={16} className="text-accent" />}
              label="Trip Distance"
              value="42.6 km"
              caption="Example result" />
            
            <FloatingCard
              className="left-6 bottom-0"
              delay={0.66}
              icon={<TrendingDownIcon size={16} className="text-accent2" />}
              label="Estimated Savings"
              value="≈ 22%"
              caption="Compared to your current speed" />
            
          </div>
        </div>
      </div>
    </section>);

}

interface FloatingCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
  className?: string;
  delay?: number;
}

function FloatingCard({ icon, label, value, caption, className = '', delay = 0 }: FloatingCardProps) {
  const reduced = usePrefersReducedMotion();
  const initial = reduced ? undefined : { opacity: 0, y: 10, scale: 0.97 };
  const animate = reduced ? undefined : { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`absolute w-48 rounded-2xl border border-white/15 bg-navydark/70 p-4 shadow-glow backdrop-blur-md ${className}`}>
      
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold text-soft">{value}</div>
      <div className="mt-1 text-[11px] text-muted">{caption}</div>
    </motion.div>);

}