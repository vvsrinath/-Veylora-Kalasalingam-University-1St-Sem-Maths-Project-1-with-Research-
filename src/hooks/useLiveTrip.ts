import { useCallback, useEffect, useRef, useState } from 'react';
import { RoutePoint, GeoContext, EnvironmentSnapshot, RoadSnapshot } from '../types/trip';
import { fetchEnvironment, fetchGeoContext, fetchRoadSnapshot, fetchElevation } from '../utils/environmentApi';

export type LiveTripStatus = 'idle' | 'active' | 'paused' | 'completed';
export type GpsSource = 'gps' | 'simulated' | 'none';

export interface LiveTripState {
  status: LiveTripStatus;
  durationSec: number;
  distanceKm: number;
  currentSpeedKmh: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  routeProgress: number;
  gpsConnected: boolean;
  gpsSource: GpsSource;
  accuracyM: number | null;
  geoContext: GeoContext | null;
  environment: EnvironmentSnapshot | null;
}

export interface LiveTripResult {
  distanceKm: number;
  durationSec: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  speedSamples: number[];
  gpsSource: GpsSource;
  accuracyM: number | null;
  routeCoordinates?: RoutePoint[];
  geoContext?: GeoContext;
  environment?: EnvironmentSnapshot;
  environmentEnd?: EnvironmentSnapshot;
  road?: RoadSnapshot;
  elevationGainM?: number;
}

const TARGET_DURATION_SEC = 18 * 60;
const GEO_OPTIONS: PositionOptions = { enableHighAccuracy: true, timeout: 12000, maximumAge: 1000 };
const GPS_ACQUIRE_TIMEOUT_MS = 15000;

const INITIAL_STATE: LiveTripState = {
  status: 'idle',
  durationSec: 0,
  distanceKm: 0,
  currentSpeedKmh: 0,
  maxSpeedKmh: 0,
  avgSpeedKmh: 0,
  routeProgress: 0,
  gpsConnected: false,
  gpsSource: 'none',
  accuracyM: null,
  geoContext: null,
  environment: null
};

const EARTH_RADIUS_KM = 6371;
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sleep(ms: number): Promise<undefined> {
  return new Promise((resolve) => window.setTimeout(() => resolve(undefined), ms));
}

/**
 * Uses the browser Geolocation API (device GPS) when available and permitted,
 * and transparently falls back to a smooth simulator when it is not. The trip
 * records which source produced its data so results are never misrepresented.
 * On GPS fixes it captures free (keyless) context: reverse-geocoded country/place,
 * live temperature + AQI from Open-Meteo, and road data from OpenStreetMap/Overpass.
 */
export function useLiveTrip() {
  const [state, setState] = useState<LiveTripState>(INITIAL_STATE);
  const speedSamples = useRef<number[]>([]);
  const accuracies = useRef<number[]>([]);
  const routePoints = useRef<RoutePoint[]>([]);
  const geoContext = useRef<GeoContext | null>(null);
  const environmentStart = useRef<EnvironmentSnapshot | null>(null);
  const watchId = useRef<number | null>(null);
  const lastFix = useRef<{ lat: number; lng: number; at: number } | null>(null);
  const source = useRef<GpsSource>('none');
  const simActive = useRef(false);
  const acquireTimer = useRef<number | null>(null);
  const intervalTimer = useRef<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const stopWatching = useCallback(() => {
    if (watchId.current != null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const captureStartContext = useCallback((lat: number, lng: number) => {
    Promise.all([fetchGeoContext(lat, lng), fetchEnvironment(lat, lng)])
      .then(([geo, env]) => {
        if (geo) geoContext.current = geo;
        if (env) environmentStart.current = env;
        setState((prev) => ({
          ...prev,
          geoContext: geo ?? prev.geoContext,
          environment: env ?? prev.environment
        }));
      })
      .catch(() => undefined);
  }, []);

  const enableSimulator = useCallback(() => {
    if (simActive.current) return;
    stopWatching();
    simActive.current = true;
    source.current = 'simulated';
    setState((prev) => ({ ...prev, gpsSource: 'simulated', gpsConnected: true }));
  }, [stopWatching]);

  const applyPosition = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude, speed, accuracy } = pos.coords;
    const at = pos.timestamp;
    const prev = lastFix.current;
    const deltaKm = prev ? haversineKm(prev.lat, prev.lng, latitude, longitude) : 0;
    const dtH = prev ? (at - prev.at) / 3_600_000 : 0;
    const sample =
      speed != null && speed >= 0
        ? speed * 3.6
        : dtH > 0
          ? Math.max(0, deltaKm / dtH)
          : stateRef.current.currentSpeedKmh;

    lastFix.current = { lat: latitude, lng: longitude, at };
    accuracies.current.push(accuracy);
    if (!simActive.current && source.current !== 'gps') {
      source.current = 'gps';
      simActive.current = false;
    }
    if (sample > 0) speedSamples.current.push(sample);

    const lastPt = routePoints.current[routePoints.current.length - 1];
    if (!lastPt || at - lastPt.at > 2000 || haversineKm(lastPt.lat, lastPt.lng, latitude, longitude) > 0.02) {
      routePoints.current.push({ lat: latitude, lng: longitude, at });
    }

    if (!prev) captureStartContext(latitude, longitude);

    setState((prevState) => ({
      ...prevState,
      currentSpeedKmh: sample,
      gpsConnected: true,
      gpsSource: 'gps',
      accuracyM: Math.round(accuracy),
      distanceKm: Math.round((prevState.distanceKm + deltaKm) * 1000) / 1000,
      maxSpeedKmh: Math.max(prevState.maxSpeedKmh, sample)
    }));
  }, [captureStartContext]);

  const start = useCallback(() => {
    speedSamples.current = [];
    accuracies.current = [];
    routePoints.current = [];
    geoContext.current = null;
    environmentStart.current = null;
    lastFix.current = null;
    source.current = 'none';
    simActive.current = false;
    setState({ ...INITIAL_STATE, status: 'active' });

    if (!('geolocation' in navigator)) {
      enableSimulator();
      return;
    }
    const onError = () => enableSimulator();
    const onFirstFix = (pos: GeolocationPosition) => {
      if (acquireTimer.current != null) {
        window.clearTimeout(acquireTimer.current);
        acquireTimer.current = null;
      }
      applyPosition(pos);
      if (watchId.current == null) {
        watchId.current = navigator.geolocation.watchPosition(applyPosition, onError, GEO_OPTIONS);
      }
    };
    navigator.geolocation.getCurrentPosition(onFirstFix, onError, GEO_OPTIONS);
    acquireTimer.current = window.setTimeout(onError, GPS_ACQUIRE_TIMEOUT_MS);
  }, [applyPosition, enableSimulator]);

  useEffect(() => {
    if (state.status !== 'active') return;
    intervalTimer.current = window.setInterval(() => {
      setState((prev) => {
        const t = prev.durationSec + 1;
        if (simActive.current) {
          const wave = Math.sin(t / 14) * 14 + Math.sin(t / 5) * 4;
          const speed = Math.max(12, Math.min(96, 50 + wave));
          speedSamples.current.push(speed);
          const avg = speedSamples.current.reduce((sum, s) => sum + s, 0) / speedSamples.current.length;
          return {
            ...prev,
            durationSec: t,
            distanceKm: prev.distanceKm + speed / 3600,
            currentSpeedKmh: speed,
            maxSpeedKmh: Math.max(prev.maxSpeedKmh, speed),
            avgSpeedKmh: avg,
            routeProgress: Math.min(1, t / TARGET_DURATION_SEC),
            gpsConnected: true,
            gpsSource: 'simulated'
          };
        }
        const avg = speedSamples.current.length
          ? speedSamples.current.reduce((sum, s) => sum + s, 0) / speedSamples.current.length
          : prev.currentSpeedKmh;
        return { ...prev, durationSec: t, avgSpeedKmh: avg, routeProgress: Math.min(1, t / TARGET_DURATION_SEC) };
      });
    }, 1000);
    return () => {
      if (intervalTimer.current != null) window.clearInterval(intervalTimer.current);
    };
  }, [state.status]);

  useEffect(() => () => {
    if (watchId.current != null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (intervalTimer.current != null) window.clearInterval(intervalTimer.current);
    if (acquireTimer.current != null) window.clearTimeout(acquireTimer.current);
  }, []);

  const pause = useCallback(() => {
    stopWatching();
    lastFix.current = null;
    setState((prev) => ({ ...prev, status: 'paused', currentSpeedKmh: 0 }));
  }, [stopWatching]);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'active' }));
    if (source.current === 'gps' && 'geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(applyPosition, () => undefined, GEO_OPTIONS);
      navigator.geolocation.getCurrentPosition(applyPosition, () => undefined, GEO_OPTIONS);
    }
  }, [applyPosition]);

  const end = useCallback(async (): Promise<LiveTripResult> => {
    const current = stateRef.current;
    stopWatching();
    if (intervalTimer.current != null) window.clearInterval(intervalTimer.current);
    if (acquireTimer.current != null) {
      window.clearTimeout(acquireTimer.current);
      acquireTimer.current = null;
    }
    const avgAccuracy = accuracies.current.length
      ? accuracies.current.reduce((sum, a) => sum + a, 0) / accuracies.current.length
      : null;
    setState((prev) => ({ ...prev, status: 'completed', currentSpeedKmh: 0 }));

    const coords = routePoints.current.slice();
    const result: LiveTripResult = {
      distanceKm: current.distanceKm,
      durationSec: current.durationSec,
      avgSpeedKmh: current.avgSpeedKmh,
      maxSpeedKmh: current.maxSpeedKmh,
      speedSamples: speedSamples.current.slice(),
      gpsSource: source.current,
      accuracyM: avgAccuracy != null ? Math.round(avgAccuracy) : null,
      routeCoordinates: coords.length > 0 ? coords : undefined,
      geoContext: geoContext.current ?? undefined,
      environment: environmentStart.current ?? undefined
    };

    if (source.current === 'gps' && coords.length > 0) {
      const last = coords[coords.length - 1];
      const [envEnd, road, elevation] = await Promise.all([
        Promise.race([fetchEnvironment(last.lat, last.lng), sleep(4500)]),
        Promise.race([fetchRoadSnapshot(coords), sleep(5500)]),
        Promise.race([fetchElevation(last.lat, last.lng), sleep(4000)])
      ]);
      if (envEnd) result.environmentEnd = envEnd;
      if (road) result.road = road;
      const startElevation = geoContext.current?.elevationM;
      if (elevation != null && startElevation != null) {
        result.elevationGainM = elevation - startElevation;
      }
    }
    return result;
  }, [stopWatching]);

  const reset = useCallback(() => {
    stopWatching();
    if (intervalTimer.current != null) window.clearInterval(intervalTimer.current);
    if (acquireTimer.current != null) window.clearTimeout(acquireTimer.current);
    speedSamples.current = [];
    accuracies.current = [];
    routePoints.current = [];
    geoContext.current = null;
    environmentStart.current = null;
    lastFix.current = null;
    source.current = 'none';
    simActive.current = false;
    setState(INITIAL_STATE);
  }, [stopWatching]);

  return { state, start, pause, resume, end, reset };
}