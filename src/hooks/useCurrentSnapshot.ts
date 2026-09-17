import { useCallback, useState } from 'react';
import { GeoContext, EnvironmentSnapshot } from '../types/trip';
import { fetchGeoContext, fetchEnvironment } from '../utils/environmentApi';

export type SnapshotStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

export function useCurrentSnapshot() {
  const [status, setStatus] = useState<SnapshotStatus>('idle');
  const [geoContext, setGeoContext] = useState<GeoContext | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentSnapshot | null>(null);

  const refresh = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('denied');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        Promise.all([fetchGeoContext(latitude, longitude), fetchEnvironment(latitude, longitude)])
          .then(([geo, env]) => {
            setGeoContext(geo);
            setEnvironment(env);
            setStatus(geo || env ? 'ready' : 'error');
          })
          .catch(() => setStatus('error'));
      },
      () => setStatus('denied'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  }, []);

  return { status, geoContext, environment, refresh };
}