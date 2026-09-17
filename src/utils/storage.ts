import { Vehicle } from '../types/vehicle';
import { Trip } from '../types/trip';

const KEYS = {
  vehicles: 'veylora:vehicles',
  activeVehicleId: 'veylora:activeVehicleId',
  trips: 'veylora:trips',
  settings: 'veylora:settings'
};

export interface AppSettings {
  reducedMotion: boolean;
  offlineMode: boolean;
  units: 'metric';
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {


    // Storage may be unavailable (private mode / quota). The app still
    // works for the current session using in-memory state.
  }}
export const storage = {
  getVehicles: (fallback: Vehicle[]) => safeGet(KEYS.vehicles, fallback),
  setVehicles: (vehicles: Vehicle[]) => safeSet(KEYS.vehicles, vehicles),
  getActiveVehicleId: (fallback: string | null) => safeGet(KEYS.activeVehicleId, fallback),
  setActiveVehicleId: (id: string) => safeSet(KEYS.activeVehicleId, id),
  getTrips: (fallback: Trip[]) => safeGet(KEYS.trips, fallback),
  setTrips: (trips: Trip[]) => safeSet(KEYS.trips, trips),
  getSettings: (fallback: AppSettings) => safeGet(KEYS.settings, fallback),
  setSettings: (settings: AppSettings) => safeSet(KEYS.settings, settings)
};