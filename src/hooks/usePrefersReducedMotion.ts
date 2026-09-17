import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

export const SETTINGS_CHANGED_EVENT = 'veylora:settings-changed';

function readReducedMotionSetting(): boolean {
  return storage.getSettings({ reducedMotion: false, offlineMode: true, units: 'metric' }).reducedMotion;
}

/**
 * Combines the OS-level `prefers-reduced-motion` media query with the
 * in-app "Reduce motion" preference from Settings, so either source can
 * disable animation.
 */
export function usePrefersReducedMotion(): boolean {
  const [osReduced, setOsReduced] = useState<boolean>(() =>
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  const [appReduced, setAppReduced] = useState<boolean>(() =>
  typeof window !== 'undefined' ? readReducedMotionSetting() : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMq = (e: MediaQueryListEvent) => setOsReduced(e.matches);
    mq.addEventListener('change', handleMq);

    const handleSettings = () => setAppReduced(readReducedMotionSetting());
    window.addEventListener(SETTINGS_CHANGED_EVENT, handleSettings);

    return () => {
      mq.removeEventListener('change', handleMq);
      window.removeEventListener(SETTINGS_CHANGED_EVENT, handleSettings);
    };
  }, []);

  return osReduced || appReduced;
}