import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { Splash } from './pages/Splash';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { VehicleSetup } from './pages/VehicleSetup';
import { MyVehicles } from './pages/MyVehicles';
import { StartTrip } from './pages/StartTrip';
import { FuelEntry } from './pages/FuelEntry';
import { TripReport } from './pages/TripReport';
import { TripHistory } from './pages/TripHistory';
import { Optimization } from './pages/Optimization';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

export function App() {
  const reducedMotion = usePrefersReducedMotion();
  const [booted, setBooted] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setBooted(true);
      return;
    }
    const timer = setTimeout(() => setBooted(true), 900);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  if (!booted) {
    return <Splash reducedMotion={reducedMotion} />;
  }

  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicle-setup" element={<VehicleSetup />} />
          <Route path="/my-vehicles" element={<MyVehicles />} />
          <Route path="/trip/start" element={<StartTrip />} />
          <Route path="/trip/fuel-entry" element={<FuelEntry />} />
          <Route path="/trip/report/:tripId" element={<TripReport />} />
          <Route path="/trip/history" element={<TripHistory />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>);

}