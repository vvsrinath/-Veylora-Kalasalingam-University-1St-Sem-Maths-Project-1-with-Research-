import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, NavigationIcon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { useAppData } from '../contexts/AppDataContext';
import { formatCurrency, formatDistance, formatRelativeDay, formatSpeed } from '../utils/format';

const QUALITY_DOT: Record<string, string> = {
  high: 'bg-accent',
  medium: 'bg-warn',
  low: 'bg-danger'
};

export function TripHistory() {
  const { tripsForActiveVehicle } = useAppData();

  return (
    <AppShell background="bg-soft">
      <div className="mx-auto max-w-2xl px-6 py-8 md:py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-lighttext">Trip History</h1>
          <Link to="/trip/start">
            <Button size="sm">Start Trip</Button>
          </Link>
        </div>

        {tripsForActiveVehicle.length === 0 ?
        <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <NavigationIcon size={24} />
            </span>
            <p className="mt-4 text-sm text-lightmuted">No trips recorded yet for this vehicle.</p>
            <Link to="/trip/fuel-entry" className="mt-3 text-sm font-medium text-accent hover:underline">
              Log a trip manually
            </Link>
          </div> :

        <ul className="mt-6 space-y-2.5">
            {tripsForActiveVehicle.map((trip) =>
          <li key={trip.id}>
                <Link
              to={`/trip/report/${trip.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-lightborder bg-white p-4 transition-colors duration-150 hover:bg-black/[0.015]">
              
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${QUALITY_DOT[trip.dataQuality]}`} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-lighttext">{formatDistance(trip.distanceKm)}</p>
                      <p className="mt-0.5 text-xs text-lightmuted">
                        {formatRelativeDay(trip.date)} · {formatSpeed(trip.avgSpeedKmh)} avg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-lighttext">
                        {trip.mileageKmL ? `${trip.mileageKmL.toFixed(1)} km/L` : '—'}
                      </p>
                      <p className="mt-0.5 text-xs text-lightmuted">{trip.fuelCost ? formatCurrency(trip.fuelCost) : '—'}</p>
                    </div>
                    <ChevronRightIcon size={16} className="text-lightmuted" />
                  </div>
                </Link>
              </li>
          )}
          </ul>
        }
      </div>
    </AppShell>);

}