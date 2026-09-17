import { useCallback, useEffect, useRef, useState } from 'react';

export type LiveTripStatus = 'idle' | 'active' | 'paused' | 'completed';

export interface LiveTripState {
  status: LiveTripStatus;
  durationSec: number;
  distanceKm: number;
  currentSpeedKmh: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  routeProgress: number;
  gpsConnected: boolean;
}

export interface LiveTripResult {
  distanceKm: number;
  durationSec: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  speedSamples: number[];
}

const TARGET_DURATION_SEC = 18 * 60;
const INITIAL_STATE: LiveTripState = {
  status: 'idle',
  durationSec: 0,
  distanceKm: 0,
  currentSpeedKmh: 0,
  maxSpeedKmh: 0,
  avgSpeedKmh: 0,
  routeProgress: 0,
  gpsConnected: false
};

/**
 * Simulates a smoothly-varying live trip (speed, distance, route progress)
 * so the trip screen feels complete in any environment. In production this
 * would be wired to the browser Geolocation API.
 */
export function useLiveTrip() {
  const [state, setState] = useState<LiveTripState>(INITIAL_STATE);
  const speedSamples = useRef<number[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.status !== 'active') return;
    const interval = window.setInterval(() => {
      setState((prev) => {
        const t = prev.durationSec + 1;
        const wave = Math.sin(t / 14) * 14 + Math.sin(t / 5) * 4;
        const speed = Math.max(12, Math.min(96, 50 + wave));
        speedSamples.current.push(speed);
        const distanceKm = prev.distanceKm + speed / 3600;
        const avgSpeedKmh = speedSamples.current.reduce((sum, s) => sum + s, 0) / speedSamples.current.length;

        return {
          ...prev,
          durationSec: t,
          distanceKm,
          currentSpeedKmh: speed,
          maxSpeedKmh: Math.max(prev.maxSpeedKmh, speed),
          avgSpeedKmh,
          routeProgress: Math.min(1, t / TARGET_DURATION_SEC),
          gpsConnected: true
        };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [state.status]);

  const start = useCallback(() => {
    speedSamples.current = [];
    setState({ ...INITIAL_STATE, status: 'active', gpsConnected: true });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused', currentSpeedKmh: 0 }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'active' }));
  }, []);

  const end = useCallback((): LiveTripResult => {
    const current = stateRef.current;
    setState((prev) => ({ ...prev, status: 'completed', currentSpeedKmh: 0 }));
    return {
      distanceKm: current.distanceKm,
      durationSec: current.durationSec,
      avgSpeedKmh: current.avgSpeedKmh,
      maxSpeedKmh: current.maxSpeedKmh,
      speedSamples: speedSamples.current.slice()
    };
  }, []);

  const reset = useCallback(() => {
    speedSamples.current = [];
    setState(INITIAL_STATE);
  }, []);

  return { state, start, pause, resume, end, reset };
}