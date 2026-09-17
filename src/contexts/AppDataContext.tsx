import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { Trip } from '../types/trip';
import { storage, AppSettings } from '../utils/storage';
import { seedVehicle, seedTrips } from '../data/seed';

interface AppDataContextValue {
  vehicles: Vehicle[];
  activeVehicle: Vehicle;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  trips: Trip[];
  tripsForActiveVehicle: Trip[];
  addTrip: (trip: Trip) => void;
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  clearAllData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = { reducedMotion: false, offlineMode: true, units: 'metric' };

export function AppDataProvider({ children }: {children: React.ReactNode;}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => storage.getVehicles([seedVehicle]));
  const [activeVehicleId, setActiveVehicleIdState] = useState<string>(
    () => storage.getActiveVehicleId(seedVehicle.id) || seedVehicle.id
  );
  const [trips, setTrips] = useState<Trip[]>(() => storage.getTrips(seedTrips));
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings(DEFAULT_SETTINGS));

  useEffect(() => storage.setVehicles(vehicles), [vehicles]);
  useEffect(() => storage.setActiveVehicleId(activeVehicleId), [activeVehicleId]);
  useEffect(() => storage.setTrips(trips), [trips]);
  useEffect(() => {
    storage.setSettings(settings);
    window.dispatchEvent(new CustomEvent('veylora:settings-changed'));
  }, [settings]);

  const activeVehicle = useMemo(
    () => vehicles.find((v) => v.id === activeVehicleId) || vehicles[0],
    [vehicles, activeVehicleId]
  );

  const tripsForActiveVehicle = useMemo(
    () =>
    trips.
    filter((t) => t.vehicleId === activeVehicle?.id).
    sort((a, b) => a.date < b.date ? 1 : -1),
    [trips, activeVehicle]
  );

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
    setActiveVehicleIdState(vehicle.id);
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => prev.map((v) => v.id === vehicle.id ? vehicle : v));
  };

  const addTrip = (trip: Trip) => {
    setTrips((prev) => [trip, ...prev]);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const clearAllData = () => {
    setVehicles([seedVehicle]);
    setActiveVehicleIdState(seedVehicle.id);
    setTrips(seedTrips);
    setSettings(DEFAULT_SETTINGS);
  };

  const value: AppDataContextValue = {
    vehicles,
    activeVehicle,
    setActiveVehicleId: setActiveVehicleIdState,
    addVehicle,
    updateVehicle,
    trips,
    tripsForActiveVehicle,
    addTrip,
    settings,
    updateSettings,
    clearAllData
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}