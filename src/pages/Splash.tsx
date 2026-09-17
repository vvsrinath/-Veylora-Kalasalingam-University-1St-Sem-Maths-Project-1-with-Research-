import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';

const MOBILE_ROAD_IMAGE = "/3aaf7ba0-b43b-46f5-9558-a497815b019d.jpg";

interface SplashProps {
  reducedMotion?: boolean;
}

export function Splash({ reducedMotion = false }: SplashProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-navy">
      <img src={MOBILE_ROAD_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy" />

      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex flex-col items-center">
        
        <Logo size={40} theme="dark" />
        <p className="mt-2 text-sm text-muted">Drive Smarter. Go Further.</p>

        <div className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }} />
          
        </div>
        <p className="mt-4 text-xs text-muted">Loading your smarter drive…</p>
      </motion.div>
    </div>);

}